# Twittey Waiter Menu

A tablet-friendly bilingual waiter menu built from the supplied Twittey menu.

## Open it

Because the website includes offline/PWA support, run it through a small local web server instead of double-clicking `index.html`.

### Mac / Windows / Linux

1. Open Terminal/Command Prompt in this folder.
2. Run: `python3 -m http.server 8080`
3. On the tablet, open: `http://COMPUTER-IP:8080`

For permanent use, upload this entire folder to Netlify, Vercel, GitHub Pages, or your own hosting. Then open the website on the tablet and choose **Add to Home Screen**.

## Included

- Arabic and English interface
- Large photographic-style category banners
- Search
- Product ordering and quantities
- Extras and item notes
- Waiter name and table number
- Order total in OMR
- Copy and print order
- Offline cache after first load

## Editing products and prices

Product data is stored near the top of `index.html` in `window.MENU_DATA`.
