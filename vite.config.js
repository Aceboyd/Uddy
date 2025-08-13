// vite.config.js
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss({
      theme: {
        extend: {},
        screens: {
          sm: '640px',   // mobile
          md: '768px',   // tablet
          lg: '1024px',  // laptop
          xl: '1280px',  // desktop
        },
      },
    }),
  ],
})
