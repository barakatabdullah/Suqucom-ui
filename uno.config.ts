// uno.config.ts
import { defineConfig, presetUno, presetIcons } from 'unocss'

export default defineConfig({
  // ...UnoCSS options
  presets: [
    presetUno(),
    presetIcons({
      extraProperties: {
        display: 'inline-block',
        width: '1.2em',
        height: '1.2em'
      }
    }),
  ],
  safelist:[
      ...Array.from({ length: 8 }, (_, i) => `col-span-${i + 1}`),
  ]
})
