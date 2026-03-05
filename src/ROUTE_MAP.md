# Route Map

This maps URL paths to their deobfuscated page component files.

| URL Path | Page Component File | Route ID | Named Elements |
|----------|-------------------|----------|----------------|
| `/` | `page--home.mjs` | `augiA20Il` |  |
| `/worldmapgit` | `page--worldmapgit.mjs` | `wbG3mjw6l` |  |
| `/neoflix` | `page--neoflix.mjs` | `bzydBB85Y` | dbtg_NZW8=dance1, DXqsCYt4L=perspectives1, mRVhqybMB=skills1, NYP2seWhD=team1, tftSCv8zZ=cost1, WjO84y3BZ=time1 |
| `/Publications` | `page--Publications.mjs` | `aLuYbVoBY` | DSPosq1GU=narrative, Y8dEgTIYh=recordfelectrefine, zQbFj9_vB=providers |
| `/Toolbox` + 28 sub-routes | `toolbox-pages.mjs` (consolidated) | various | All use `toolbox-page-factory.mjs` |

## Shared Chunks

| Original File | Deobfuscated Name | Purpose |
|--------------|-------------------|----------|
| `chunk-5swt4qjj.mjs` | `chunk--react-and-framer-runtime.mjs` | react and framer runtime |
| `chunk-riumfbnj.mjs` | `chunk--browser-polyfills.mjs` | browser polyfills |
| `chunk-ezmxfukt.mjs` | `chunk--site-metadata.mjs` | site metadata |
| `chunk-oypszrmx.mjs` | `chunk--framer-components.mjs` | framer components |
| `chunk-yswte6p7.mjs` | `chunk--framer-motion.mjs` | framer motion |
| `chunk-t6gii47u.mjs` | `chunk--shared-components.mjs` | shared components |
| `chunk-nfm7h27b.mjs` | `chunk--embed-component.mjs` | embed component |
| `script_main.wb5gsumg.mjs` | `script_main--router.mjs` | router |
| `sitesnotfoundpage.js@1.1-b76n3trr.mjs` | `page--404-not-found.mjs` | 404 not found |

## Responsive Breakpoints

All pages use these breakpoints:
- **Desktop**: `min-width: 1200px`
- **Tablet**: `min-width: 810px and max-width: 1199px`
- **Mobile**: `max-width: 809px`

## Page Transition Animation

All toolbox pages use the same enter transition when navigating from home:
```js
{
  opacity: 0 → 1,
  scale: 1,
  duration: 0.2s,
  easing: cubic-bezier(0.27, 0, 0.51, 1),
  type: "tween"
}
```
