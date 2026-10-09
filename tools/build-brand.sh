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
GREEN="#1F4D3A"; CREAM="#F5F0E6"

alpha(){ magick "$@" -alpha extract -strip -define png:compression-level=9 PNG8:- ; }
magick $SRC -trim +repage -resize 900x  PNG32:$B/tfb-logo.png
magick $SRC -crop 1830x700+80+60 +repage -trim +repage -resize 600x PNG32:$B/tfb-mark.png
magick $SRC -crop 300x300+1600+450 +repage -trim +repage -resize 160x PNG32:$B/tfb-ball.png
magick $SRC -crop 1840x130+80+775 +repage -trim +repage -resize 900x PNG32:$B/tfb-tagline.png

css=assets/css/brand.css
{
  echo "/* Automatisch erzeugt von tools/build-brand.sh – nicht von Hand bearbeiten. */"
  for n in logo mark ball tagline; do
    f=$B/tfb-$n.png
    w=$(magick identify -format %w $f); h=$(magick identify -format %h $f)
    # Maske: Graustufen-Alpha als weißes Motiv auf Schwarz (Luminanz-Maske)
    data=$(magick $f -alpha extract -strip -define png:compression-level=9 PNG8:- | base64 | tr -d '\n')
    echo ".tfb-$n { display: inline-block; aspect-ratio: $w / $h; background-color: currentColor;"
    echo "  -webkit-mask: url(data:image/png;base64,$data) center / contain no-repeat;"
    echo "  -webkit-mask-source-type: luminance; mask: url(data:image/png;base64,$data) center / contain no-repeat luminance; }"
  done
} > $css

# App-Symbol: cremefarbenes TFB. auf Vereinsgrün
I=assets/icons
magick -size 512x512 xc:none -fill "$GREEN" -draw "roundrectangle 0,0 511,511 112,112" \
  \( $B/tfb-mark.png -resize 380x -fill "$CREAM" -colorize 100 \) -gravity center -geometry -6+0 -composite PNG32:$I/icon-512.png
magick -size 512x512 xc:"$GREEN" \( $B/tfb-mark.png -resize 320x -fill "$CREAM" -colorize 100 \) -gravity center -composite PNG32:$I/icon-maskable-512.png
magick $I/icon-512.png -resize 192x192 $I/icon-192.png
magick -size 180x180 xc:"$GREEN" \( $B/tfb-mark.png -resize 136x -fill "$CREAM" -colorize 100 \) -gravity center -composite $I/icon-180.png
magick -size 64x64 xc:none -fill "$GREEN" -draw "roundrectangle 0,0 63,63 14,14" \( $B/tfb-ball.png -resize 44x -fill "$CREAM" -colorize 100 \) -gravity center -composite $I/favicon-64.png
ls -la $css $I

# Weißes "TFB."-Zeichen für Symbole (Kappe, Shirt) als data-URI, damit es auch per Doppelklick lädt
WHITE=$(magick $B/tfb-mark.png -resize 220x -fill white -colorize 100 -strip -define png:compression-level=9 PNG32:- | base64 | tr -d '\n')
printf '%s\n' "// Automatisch erzeugt von tools/build-brand.sh – nicht von Hand bearbeiten." \
  "window.TFB = window.TFB || {};" \
  "TFB.brandMarkWhite = 'data:image/png;base64,$WHITE';" \
  "TFB.brandMarkRatio = $(magick identify -format '%[fx:w/h]' $B/tfb-mark.png);" > assets/js/brand-data.js
ls -la assets/js/brand-data.js
