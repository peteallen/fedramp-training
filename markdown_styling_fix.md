# Markdown Styling Fix

Enhanced the prose classes in `ModuleViewer.tsx` to properly style the rendered Markdown content:

## Changes Made:

1. **Added `prose-gray`** - Sets the base gray color scheme
2. **Added `dark:prose-invert`** - Enables proper dark mode support for prose content
3. **Added specific color classes**:
   - `prose-headings:text-gray-800 dark:prose-headings:text-gray-100` - Styles headings
   - `prose-p:text-gray-700 dark:prose-p:text-gray-300` - Styles paragraphs
   - `prose-strong:text-gray-900 dark:prose-strong:text-gray-100` - Styles bold text
   - `prose-a:text-blue-600 dark:prose-a:text-blue-400` - Styles links

## Result:

The ReactMarkdown content now properly inherits the application's color scheme and provides:
- Better contrast and readability
- Proper dark mode support
- Consistent styling with the rest of the application
- Professional typography for headings, paragraphs, links, and emphasized text