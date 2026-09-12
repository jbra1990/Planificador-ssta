#!/bin/sh
# Genera el index.html del sitio a partir del fragmento fuente.
#
# La app se escribe como un fragmento (título, metas, estilos y marcado) para
# poder publicarla también como artifact, donde el envoltorio del documento lo
# pone la plataforma. Para GitHub Pages hace falta el documento completo: sin
# <!doctype html> el navegador entra en modo quirks y el diseño no coincide con
# el que se probó.
#
# El corte entre <head> y <body> es la última línea </style> del fragmento.
#
# Uso:  ./build.sh ruta/al/fragmento.html
set -eu

SRC="${1:?Indica el archivo fuente, por ejemplo ../Jairo/index.html}"
OUT="$(dirname "$0")/index.html"

CORTE=$(grep -n '^</style>$' "$SRC" | tail -1 | cut -d: -f1)
[ -n "$CORTE" ] || { echo "No se encontró </style> en $SRC" >&2; exit 1; }

{
  echo '<!doctype html>'
  echo '<html lang="es">'
  echo '<head>'
  echo '<meta charset="utf-8" />'
  sed -n "1,${CORTE}p" "$SRC"
  echo '</head>'
  echo '<body>'
  sed -n "$((CORTE + 1)),\$p" "$SRC"
  echo '</body>'
  echo '</html>'
} > "$OUT"

echo "Escrito $OUT"
