import {
  BlobSource, BufferTarget, Conversion, Input, MP4, Mp4OutputFormat,
  Output, QTFF, Quality, WEBM, WebMOutputFormat,
} from '../vendor/mediabunny/mediabunny.min.js';

const MAX_BYTES = 5 * 1024 * 1024;
const MAX_SECONDS = 30;
const profiles = [
  { type: 'video/mp4', format: Mp4OutputFormat, video: 'avc', audio: 'aac' },
  { type: 'video/webm', format: WebMOutputFormat, video: 'vp8', audio: 'opus' },
];

function frameSize(width, height, shortSide) {
  const scale = Math.min(1, shortSide / Math.min(width, height), shortSide * 16 / 9 / Math.max(width, height));
  const even = value => Math.max(2, Math.floor(value * scale / 2) * 2);
  return {width: even(width), height: even(height)};
}

async function encode(input, profile, size, bitrate, audio, onProgress, signal) {
  signal.throwIfAborted();
  const target = new BufferTarget();
  const output = new Output({format: new profile.format(), target});
  const conversion = await Conversion.init({
    input, output, tracks: 'primary', tags: {}, showWarnings: false,
    video: {...size, fit: 'contain', codec: profile.video, frameRate: 24, quality: new Quality({bitrate, bitrateMode: 'variable'})},
    audio: {codec: profile.audio, ...(profile.audio === 'aac' ? {} : {quality: new Quality({bitrate: 64_000})})},
  });
  if (!conversion.isValid || conversion.discardedTracks.some(item => item.track.isVideoTrack() || item.track === audio)) return null;
  signal.throwIfAborted();
  conversion.onProgress = onProgress;
  const cancel = () => { void conversion.cancel().catch(() => {}); };
  signal.addEventListener('abort', cancel, {once: true});
  try {
    await conversion.execute();
    signal.throwIfAborted();
    return target.buffer && new Blob([target.buffer], {type: profile.type});
  } finally {
    signal.removeEventListener('abort', cancel);
  }
}

export async function prepareChatVideo(file, onProgress, signal) {
  const input = new Input({source: new BlobSource(file), formats: [MP4, QTFF, WEBM]});
  try {
    signal.throwIfAborted();
    const video = await input.getPrimaryVideoTrack();
    if (!video) throw Error('Die Datei enthält kein lesbares Video.');
    const audio = await input.getPrimaryAudioTrack();
    const [duration, width, height, format, codec] = await Promise.all([
      input.computeDuration(audio ? [video, audio] : [video]), video.getDisplayWidth(),
      video.getDisplayHeight(), input.getFormat(), video.getCodec(),
    ]);
    signal.throwIfAborted();
    if (!Number.isFinite(duration) || duration <= 0) throw Error('Die Videolänge konnte nicht gelesen werden.');
    // A camera can add one frame of audio padding to a nominal 30-second clip.
    if (duration > MAX_SECONDS + 0.1) throw Error('Bitte kürze das Video auf höchstens 30 Sekunden.');
    const originalType = format === MP4 && codec === 'avc' ? 'video/mp4'
      : format === WEBM && ['vp8', 'vp9', 'av1'].includes(codec) ? 'video/webm' : '';
    if (originalType && file.size <= MAX_BYTES) return {file: file.slice(0, file.size, originalType), width, height};

    // Reserve room for audio, container headers and variation in encoder output.
    const bitrate = Math.max(300_000, Math.min(1_850_000, Math.floor(MAX_BYTES * 8 * .84 / duration) - 140_000));
    for (const profile of profiles) {
      for (const [resolution, ratio] of [[720, 1], [540, .68]]) {
        const size = frameSize(width, height, resolution);
        try {
          const converted = await encode(input, profile, size, Math.round(bitrate * ratio), audio, onProgress, signal);
          if (!converted) break;
          if (converted.size && converted.size <= MAX_BYTES) return {file: converted, ...size};
        } catch (_) {
          signal.throwIfAborted();
          break;
        }
      }
    }
    throw Error('Dieses Video lässt sich hier nicht verkleinern. Bitte versuche einen kürzeren Clip oder wähle in der Kamera HD mit 30 fps.');
  } finally {
    input.dispose();
  }
}
