/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.700'),
            a: {
              color: theme('colors.blue.600'),
              fontWeight: '500',
              '&:hover': {
                color: theme('colors.blue.800'),
              },
            },
            h1: {
              fontWeight: '700',
              color: theme('colors.gray.900'),
              letterSpacing: theme('letterSpacing.tight'),
              marginTop: '0',
              marginBottom: '0.8em',
            },
            h2: {
              fontWeight: '600',
              color: theme('colors.gray.800'),
              letterSpacing: theme('letterSpacing.tight'),
              marginTop: '1.5em',
              marginBottom: '0.6em',
            },
            h3: {
              fontWeight: '600',
              color: theme('colors.gray.800'),
              letterSpacing: theme('letterSpacing.tight'),
              marginTop: '1.2em',
              marginBottom: '0.4em',
            },
            p: {
              marginTop: '1em',
              marginBottom: '1em',
              lineHeight: theme('lineHeight.relaxed'),
            },
            ul: {
              paddingLeft: '1.25em',
              marginBottom: '1em',
            },
            ol: {
              paddingLeft: '1.25em',
              marginBottom: '1em',
            },
            'ul > li::marker': {
              color: theme('colors.blue.600'),
              fontWeight: '600',
            },
            'ol > li::marker': {
              color: theme('colors.blue.600'),
              fontWeight: '600',
            },
            strong: { color: theme('colors.gray.900') },
            blockquote: {
              borderLeftColor: theme('colors.blue.600'),
              fontStyle: 'italic',
              color: theme('colors.gray.600'),
            },
            code: {
              backgroundColor: theme('colors.gray.100'),
              color: theme('colors.pink.600'),
              padding: '0.2rem 0.4rem',
              borderRadius: theme('borderRadius.sm'),
              fontWeight: '500',
            },
            pre: {
              backgroundColor: theme('colors.gray.800'),
              color: theme('colors.gray.100'),
              borderRadius: theme('borderRadius.lg'),
              padding: '1rem 1.25rem',
            },
          },
        },
        invert: {
          css: {
            color: theme('colors.gray.300'),
            a: {
              color: theme('colors.blue.400'),
              '&:hover': {
                color: theme('colors.blue.300'),
              },
            },
            h1: { color: theme('colors.gray.100') },
            h2: { color: theme('colors.gray.100') },
            h3: { color: theme('colors.gray.100') },
            strong: { color: theme('colors.gray.100') },
            'ul > li::marker': { color: theme('colors.blue.400') },
            'ol > li::marker': { color: theme('colors.blue.400') },
            blockquote: {
              borderLeftColor: theme('colors.blue.400'),
              color: theme('colors.gray.300'),
            },
            code: {
              backgroundColor: theme('colors.gray.700'),
              color: theme('colors.pink.400'),
            },
            pre: {
              backgroundColor: theme('colors.gray.700'),
              color: theme('colors.gray.100'),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} 