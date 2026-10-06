# Macon Tree Removal Co. — macontreeremovalco.com

Static Next.js (App Router) site, exported to plain HTML and deployed to Hostinger by GitHub Actions.

## Edit business details
Everything lives in **`site.config.ts`**: phone number, Web3Forms access key, lead email, GA4 ID, Search Console verification.

## Edit page copy
All copy comes from **`content.md`** (the page content doc). Edit it and push. The build reads:
URL, SEO title, meta description, H1 and the body copy for each `## Page N:` block.
`[PHONE]` becomes the click-to-call number, `[QUOTE BUTTON]` becomes a "Get a Free Quote" button.
Sections called "Note for Aisha" or "Setup Notes" are never published.
Contact form fields come from the "Quote Form Fields" table on the Contact page.

Internal links that content.md describes in words ("Learn more about tree removal", "See the cost guide") are mapped in `lib/pages.ts`, together with each page's image.

## Images
Optimized WebP files are in `public/images` (committed). To re-process originals, put them in `images-src/` (not committed) and run `npm run images`.

## Commands
```
npm install
npm run dev      # local preview at http://localhost:3000
npm run build    # static export to /out
```

## Deploy
Every push to `main` runs `.github/workflows/deploy.yml`: install → build → FTP upload of `/out` to `public_html`.
Needs repository secrets `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`.
