# Markdown Styling Improvements

To improve the styling of rendered Markdown content:

1. Installed `@tailwindcss/typography` as a dev dependency using pnpm.
2. Updated `tailwind.config.js` to include the typography plugin.
3. The existing `prose prose-lg max-w-none` classes in `ModuleViewer.tsx` will now apply professional typography styles to the Markdown content, including better handling of headings, lists, code blocks, and more.

This enhances the visual appeal and readability of the module content.