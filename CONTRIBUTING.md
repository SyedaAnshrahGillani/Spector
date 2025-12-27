
# Contributing to Spector ✨

Welcome! Spector is a tiny, privacy-first JSON viewer that lives in a single HTML file. We're delighted you're here to help make it better.

## Why We Love Contributors
Spector stays intentionally minimal—one file, zero dependencies—so your contributions have immediate impact on researchers and developers who need to inspect private data without uploads or servers.

## Getting Started in 3 Steps

1. **Fork & clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Spector.git
   cd Spector
   ```

2. **Run locally**
   ```bash
   python3 -m http.server 8000   # open http://localhost:8000
   ```

3. **Branch & build**
   ```bash
   git checkout -b feature/csv-support  # or fix/scroll-bug
   ```

## What We're Looking For
- **New parsers**: CSV, TSV, XML (keep them tiny)
- **UI polish**: dark-mode tweaks, mobile layout, keyboard shortcuts
- **Performance**: faster rendering for 50 k+ rows
- **Accessibility**: ARIA labels, focus traps, screen-reader hints
- **Bug squashes**: edge-case files, browser quirks, typos

## Single-File Rules (important!)
- Everything lives inside `index.html`—no new files or folders
- No external CDNs or npm packages
- Keep the minified HTML < 500 KB
- Test in Chrome, Firefox, Safari, Edge (latest two versions)

## Submitting Your Work
1. Open an issue first so we can coordinate
2. Test with the sample datasets in `/data` plus your own nasty edge-cases
3. Push your branch and open a PR; use clear titles:
   ```
   feat: add CSV drag-and-drop
   fix: preserve scroll position on sort
   docs: update browser support table
   ```
4. We'll review, suggest tweaks, and merge fast

## Need Help?
- Stuck? Comment on the issue—we're friendly
- Unsure if an idea fits? Open a discussion
- First PR? Label it `good first issue` and we'll guide you

Thanks for keeping Spector small, private, and powerful. Let's ship! 🚀
