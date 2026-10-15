#!/bin/zsh
# Erzeugt aus dem Original-Logo (schwarz, transparenter Hintergrund) die App-Bausteine:
#  - assets/brand/tfb-logo|mark|ball|tagline.png   zugeschnitten (tagline = Schriftzug)
#  - assets/css/brand.css                  Logos als einfärbbare Masken (data-URI,
#                                          damit es auch per Doppelklick/file:// läuft)
#  - assets/icons/icon-*.png               App-Symbol
# Aufruf nach jedem Logo-Wechsel:  zsh tools/build-brand.sh
set -e
cd "${0:A:h}/.."
B=assets/brand
SRC=$B/tfb-logo-original.png
SIGNATURE="#1C1A17"; CREAM="#F5F0E6"

alpha(){ magick "$@" -alpha extract -strip -define png:compression-level=9 PNG8:- ; }
magick $SRC -trim +repage -resize 900x  PNG32:$B/tfb-logo.png
# Logo ohne Ball (Ball liegt rechts von x=1616, oberhalb des Schriftzugs) – gleicher Zuschnitt wie das Logo,
# damit der Ball separat in Signal-Rot darübergelegt werden kann (Position siehe .tfb-logo-split in app.css)
TRIM=$(magick $SRC -format "%@" info:)
magick $SRC \( +clone -alpha extract -fill black -draw "rectangle 1616,70 1999,759" \) -alpha off -compose CopyOpacity -composite -crop $TRIM +repage -resize 900x PNG32:$B/tfb-logo-noball.png
# Nur der Ball, exakt an seiner Stelle im Logo: 280x280+1616+464 im Original
# → in .tfb-logo-split: left 84.53 %, top 47.95 %, Breite 15.53 %, Höhe 34.78 %
magick $SRC -crop 280x280+1616+464 +repage PNG32:$B/tfb-logo-ball.png
magick $SRC -crop 1830x700+80+60 +repage -trim +repage -resize 600x PNG32:$B/tfb-mark.png
magick $SRC -crop 300x300+1600+450 +repage -trim +repage -resize 160x PNG32:$B/tfb-ball.png
magick $SRC -crop 1840x130+80+775 +repage -trim +repage -resize 900x PNG32:$B/tfb-tagline.png
# Einzelne Wörter, damit der Schriftzug auf schmalen Handys umbrechen kann
magick $B/tfb-tagline.png -crop 540x200+0+0 +repage -trim +repage PNG32:$B/tfb-tagline1.png
magick $B/tfb-tagline.png -crop 400x200+540+0 +repage -trim +repage PNG32:$B/tfb-tagline2.png

css=assets/css/brand.css
{
  echo "/* Automatisch erzeugt von tools/build-brand.sh – nicht von Hand bearbeiten. */"
  for n in logo logo-noball logo-ball mark ball tagline tagline1 tagline2; do
    f=$B/tfb-$n.png
    w=$(magick identify -format %w $f); h=$(magick identify -format %h $f)
    # Maske: Graustufen-Alpha als weißes Motiv auf Schwarz (Luminanz-Maske)
    data=$(magick $f -alpha extract -strip -define png:compression-level=9 PNG8:- | base64 | tr -d '\n')
    echo ".tfb-$n { display: inline-block; aspect-ratio: $w / $h; background-color: currentColor;"
    echo "  -webkit-mask: url(data:image/png;base64,$data) center / contain no-repeat;"
    echo "  -webkit-mask-source-type: luminance; mask: url(data:image/png;base64,$data) center / contain no-repeat luminance; }"
  done
} > $css

# Signature-Kachel: Original-TFB ohne Ball, dieselbe Vorlage für alle App-Symbole.
I=assets/icons
magick $B/tfb-app-icon-source.png -resize 512x512 PNG32:$I/icon-512.png
magick -size 512x512 xc:"$SIGNATURE" \( $B/tfb-app-icon-source.png -resize 420x420 \) -gravity center -composite PNG32:$I/icon-maskable-512.png
magick $I/icon-512.png -resize 192x192 $I/icon-192.png
magick -size 180x180 xc:"$SIGNATURE" \( $B/tfb-app-icon-source.png -resize 180x180 \) -gravity center -composite $I/icon-180.png
magick $B/tfb-app-icon-source.png -resize 64x64 $I/favicon-64.png
magick $B/tfb-app-icon-source.png -define icon:auto-resize=256,128,64,48,32,16 $I/icon.ico
ls -la $css $I

# Weißes "TFB."-Zeichen für Symbole (Kappe, Shirt) als data-URI, damit es auch per Doppelklick lädt
WHITE=$(magick $B/tfb-mark.png -resize 220x -fill white -colorize 100 -strip -define png:compression-level=9 PNG32:- | base64 | tr -d '\n')
printf '%s\n' "// Automatisch erzeugt von tools/build-brand.sh – nicht von Hand bearbeiten." \
  "window.TFB = window.TFB || {};" \
  "TFB.brandMarkWhite = 'data:image/png;base64,$WHITE';" \
  "TFB.brandMarkRatio = $(magick identify -format '%[fx:w/h]' $B/tfb-mark.png);" > assets/js/brand-data.js
ls -la assets/js/brand-data.js
