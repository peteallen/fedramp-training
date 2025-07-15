# Typography and Formatting Improvements

To enhance readability in the module content:

1. Installed `react-markdown` and `remark-gfm` via pnpm.
2. Updated `ModuleViewer.tsx` to render content using ReactMarkdown with GFM support, replacing the simple paragraph splitting.
3. Edited `src/data/modules/1.json` to incorporate Markdown syntax:
   - Used `##` for subsection headings.
   - Applied **bold** for emphasis on key names and terms.
   - Used *italic* for emails.
   - Ensured proper paragraph breaks with double newlines.

These changes allow for richer formatting, better hierarchy, and improved overall readability in the training modules.