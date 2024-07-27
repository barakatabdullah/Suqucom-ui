import { fileURLToPath, URL } from 'node:url'


import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueRouter from 'unplugin-vue-router/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Layouts from 'vite-plugin-vue-layouts';
import Components from 'unplugin-vue-components/vite'
import {
  AntDesignVueResolver,
  ElementPlusResolver,
  VantResolver,
} from 'unplugin-vue-components/resolvers'

import { VueRouterAutoImports } from 'unplugin-vue-router'
import { PrimeVueResolver } from 'unplugin-vue-components/resolvers';



// https://vitejs.dev/config/
export default defineConfig({
  server: {

    proxy: {
      
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        secure:false
        // rewrite: (path) => path.replace(/^\/api/, ''),
      }
    }
  },
  plugins: [
    VueRouter({
      extensions: ['.vue', '.md'],
      dts: 'src/typed-router.d.ts',
    }),
    vue(),
    UnoCSS(),
    AutoImport({
      imports: [
        'vue',

        VueRouterAutoImports,
        {
          // add any other imports you were relying on
          'vue-router/auto': ['useLink'],
        },
      ],
      dts: 'src/auto-imports.d.ts',
      dirs: [
        'src/composables',
        'src/stores',
      ],
      vueTemplate: true,
    }),
    Components({
      resolvers: [
        AntDesignVueResolver(),
        ElementPlusResolver(),
        VantResolver(), PrimeVueResolver()
      ],
    }),
    Layouts()
  ],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})