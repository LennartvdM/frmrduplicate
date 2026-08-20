# app/src/components/mobile/

The phone version of the site, below 600px wide. These are **separate
components**, not a responsive variation of the desktop pages — a phone
visitor loads these files and never loads the desktop ones.

The consequence worth remembering: **a sentence on the homepage exists in two
places.** The desktop headlines live in
`../sections/medical/MedicalSection.data.js`; the same sentences, in a
different shape, live in `MOBILE_PANELS` in `MobileHome.jsx`. Change one and
the other is now wrong — the site will say different things depending on the
device. Both files carry a warning comment.

`/neoflix` and `/publications` share their section prose with the desktop
pages (from `../../data/`), but each has its own hero text near the top of its
file here.
