#!/bin/bash
# Download missing assets and third-party dependencies for self-hosting
# Run this script with network access to complete the liberation

set -e

echo "=== Downloading missing Framer assets ==="

# 5 missing framerusercontent.com assets
curl -sL -o assets/79ajxjoljjurdtgiqvvugw34pai.webm \
  "https://framerusercontent.com/assets/79AjxJOlJJurDtgiqVvuGW34pAI.webm"
curl -sL -o images/9pfd7vvquds5eplyfkw551yubps.png \
  "https://framerusercontent.com/assets/9pFd7vvquDS5eplYFkw551yUBPs.png"
curl -sL -o images/d5e2detf0uodhvozexvmy3w1zc.png \
  "https://framerusercontent.com/assets/D5E2dEtF0UoDhvOzeXvMy3W1Zc.png"
curl -sL -o assets/nwfwqm9vebbwcrqkomujfkkma.webm \
  "https://framerusercontent.com/assets/NWFWQm9VeBbWCrqKomUJfkkMA.webm"
curl -sL -o assets/jm9ee97tcdcefsstds6w6jp0e1w.webm \
  "https://framerusercontent.com/assets/jm9eE97tcdcEFSStDS6W6jp0e1w.webm"

echo "=== Downloading search index ==="
curl -sL -o assets/searchIndex.json \
  "https://framerusercontent.com/sites/2onVJKQnRbkHDnsZRykAoO/searchIndex-e61FhQV5RCkg.json"

echo "=== Downloading Google Fonts ==="
mkdir -p assets/fonts

# Inter (multiple weights, latin subset only — add more subsets if needed)
curl -sL -o assets/fonts/inter-v13-latin-regular.woff2 \
  "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fMZ1rib2Bg-4.woff2"
curl -sL -o assets/fonts/inter-v13-latin-medium.woff2 \
  "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYMZ1rib2Bg-4.woff2"
curl -sL -o assets/fonts/inter-v13-latin-bold.woff2 \
  "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuBWYMZ1rib2Bg-4.woff2"
curl -sL -o assets/fonts/inter-v18-latin-medium.woff2 \
  "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYMZ1rib2Bg-4.woff2"

# Montserrat (bold, latin)
curl -sL -o assets/fonts/montserrat-v26-latin-bold.woff2 \
  "https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtZ6Ew7Y3tcoqK5.woff2"

# DM Sans (latin)
curl -sL -o assets/fonts/dmsans-v15-latin-regular.woff2 \
  "https://fonts.gstatic.com/s/dmsans/v15/rP2tp2ywxg089UriI5-g4vlH9VoD8CmcqZG40F9JadbnoEwAkJxhS2f3ZGMZpg.woff2"

echo "=== Downloading Inter from app.framerstatic.com ==="
# These are duplicates of Inter served from Framer's CDN
# Bold
curl -sL -o assets/fonts/Inter-Bold.latin.woff2 \
  "https://app.framerstatic.com/Inter-Bold.latin-UCM45LQF.woff2"
curl -sL -o assets/fonts/Inter-Bold.latin-ext.woff2 \
  "https://app.framerstatic.com/Inter-Bold.latin-ext-BASA5UL3.woff2"
curl -sL -o assets/fonts/Inter-Bold.cyrillic.woff2 \
  "https://app.framerstatic.com/Inter-Bold.cyrillic-6LOMBC2V.woff2"
curl -sL -o assets/fonts/Inter-Bold.cyrillic-ext.woff2 \
  "https://app.framerstatic.com/Inter-Bold.cyrillic-ext-XOTVL7ZR.woff2"
curl -sL -o assets/fonts/Inter-Bold.greek.woff2 \
  "https://app.framerstatic.com/Inter-Bold.greek-YRST7ODZ.woff2"
curl -sL -o assets/fonts/Inter-Bold.greek-ext.woff2 \
  "https://app.framerstatic.com/Inter-Bold.greek-ext-WXWSJXLB.woff2"
curl -sL -o assets/fonts/Inter-Bold.vietnamese.woff2 \
  "https://app.framerstatic.com/Inter-Bold.vietnamese-OEVJMXEP.woff2"
# BoldItalic
curl -sL -o assets/fonts/Inter-BoldItalic.latin.woff2 \
  "https://app.framerstatic.com/Inter-BoldItalic.latin-5ZFQS4XK.woff2"
curl -sL -o assets/fonts/Inter-BoldItalic.latin-ext.woff2 \
  "https://app.framerstatic.com/Inter-BoldItalic.latin-ext-FVPCPRBJ.woff2"
curl -sL -o assets/fonts/Inter-BoldItalic.cyrillic.woff2 \
  "https://app.framerstatic.com/Inter-BoldItalic.cyrillic-7EIL6JWG.woff2"
curl -sL -o assets/fonts/Inter-BoldItalic.cyrillic-ext.woff2 \
  "https://app.framerstatic.com/Inter-BoldItalic.cyrillic-ext-PEYDHC3S.woff2"
curl -sL -o assets/fonts/Inter-BoldItalic.greek.woff2 \
  "https://app.framerstatic.com/Inter-BoldItalic.greek-TJBTLTT7.woff2"
curl -sL -o assets/fonts/Inter-BoldItalic.greek-ext.woff2 \
  "https://app.framerstatic.com/Inter-BoldItalic.greek-ext-3DJOYQMH.woff2"
curl -sL -o assets/fonts/Inter-BoldItalic.vietnamese.woff2 \
  "https://app.framerstatic.com/Inter-BoldItalic.vietnamese-W2625PGF.woff2"
# Italic
curl -sL -o assets/fonts/Inter-Italic.latin.woff2 \
  "https://app.framerstatic.com/Inter-Italic.latin-2DWX32EN.woff2"
curl -sL -o assets/fonts/Inter-Italic.latin-ext.woff2 \
  "https://app.framerstatic.com/Inter-Italic.latin-ext-H4B22QN6.woff2"
curl -sL -o assets/fonts/Inter-Italic.cyrillic.woff2 \
  "https://app.framerstatic.com/Inter-Italic.cyrillic-BFOVMAQB.woff2"
curl -sL -o assets/fonts/Inter-Italic.cyrillic-ext.woff2 \
  "https://app.framerstatic.com/Inter-Italic.cyrillic-ext-YDGMJOJO.woff2"
curl -sL -o assets/fonts/Inter-Italic.greek.woff2 \
  "https://app.framerstatic.com/Inter-Italic.greek-OJTBJNE6.woff2"
curl -sL -o assets/fonts/Inter-Italic.greek-ext.woff2 \
  "https://app.framerstatic.com/Inter-Italic.greek-ext-4KOU3AHC.woff2"
curl -sL -o assets/fonts/Inter-Italic.vietnamese.woff2 \
  "https://app.framerstatic.com/Inter-Italic.vietnamese-TYMT6CKW.woff2"
# Medium
curl -sL -o assets/fonts/Inter-Medium.latin.woff2 \
  "https://app.framerstatic.com/Inter-Medium.latin-Y3IVPL46.woff2"
curl -sL -o assets/fonts/Inter-Medium.latin-ext.woff2 \
  "https://app.framerstatic.com/Inter-Medium.latin-ext-J4DBSW7F.woff2"
curl -sL -o assets/fonts/Inter-Medium.cyrillic.woff2 \
  "https://app.framerstatic.com/Inter-Medium.cyrillic-JVU2PANX.woff2"
curl -sL -o assets/fonts/Inter-Medium.cyrillic-ext.woff2 \
  "https://app.framerstatic.com/Inter-Medium.cyrillic-ext-M4WHNGTS.woff2"
curl -sL -o assets/fonts/Inter-Medium.greek.woff2 \
  "https://app.framerstatic.com/Inter-Medium.greek-DPOQGN7L.woff2"
curl -sL -o assets/fonts/Inter-Medium.greek-ext.woff2 \
  "https://app.framerstatic.com/Inter-Medium.greek-ext-4KCQBEIZ.woff2"
curl -sL -o assets/fonts/Inter-Medium.vietnamese.woff2 \
  "https://app.framerstatic.com/Inter-Medium.vietnamese-PJV76O4P.woff2"

echo "=== Downloading mixkit stock video ==="
curl -sL -o assets/mixkit-clouds-sky.mp4 \
  "https://assets.mixkit.co/videos/preview/mixkit-shining-sun-in-the-sky-surrounded-by-moving-clouds-31793-small.mp4"

echo "=== Downloading GitHub SVG ==="
curl -sL -o assets/worldmap.svg \
  "https://raw.githubusercontent.com/LennartvdM/kaart/main/worldmap.svg"

echo "=== All downloads complete ==="
echo "Run the rewrite-urls.mjs script next to update all references."
