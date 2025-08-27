# Minimal site

Edit `index.html` directly. To add a paper, add a new `<li>` under the Publications list.

Links can point to arXiv, DOI, or a local PDF placed anywhere under `public/` (the deploy script simply copies this folder as-is).

## Deploy

From the repo root:

```bash
./deploy_minimal.sh
```

This clears `public/` and copies `minimal/` into it. Commit and push the `public/` directory to the hosting branch or serve locally.


