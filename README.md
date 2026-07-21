# My minimal site

Edit `index.html` directly. To add a paper, add a new `<li>` under the Publications list.

Links can point to arXiv, DOI, or local files placed in the root directory.

## AI experiments

The experiment index is in `ai/index.html`. Each compiled experience is served from
its own directory under `ai/`, while editable source lives under `projects/`.

Before Music can be rebuilt with:

```bash
cd projects/before-music
npm ci
npm run build
```

Copy the generated `dist/` contents into `ai/before-music/` before publishing.

## Deploy

Simply commit and push your changes:

```bash
git add .
git commit -m "Update site"
git push
```

Your site will be served directly from the root files.
