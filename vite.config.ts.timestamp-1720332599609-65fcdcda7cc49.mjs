// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import UnoCSS from "file:///C:/Users/Vitrual/Desktop/dev/Suqucom-eCommerce-Platform/client/node_modules/.pnpm/unocss@0.60.4_postcss@8.4.38_vite@5.3.1/node_modules/unocss/dist/vite.mjs";
import { defineConfig } from "file:///C:/Users/Vitrual/Desktop/dev/Suqucom-eCommerce-Platform/client/node_modules/.pnpm/vite@5.3.1_@types+node@20.14.5/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Users/Vitrual/Desktop/dev/Suqucom-eCommerce-Platform/client/node_modules/.pnpm/@vitejs+plugin-vue@5.0.5_vite@5.3.1_vue@3.4.29/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import VueRouter from "file:///C:/Users/Vitrual/Desktop/dev/Suqucom-eCommerce-Platform/client/node_modules/.pnpm/unplugin-vue-router@0.8.8_vue-router@4.3.3_vue@3.4.29/node_modules/unplugin-vue-router/dist/vite.mjs";
import AutoImport from "file:///C:/Users/Vitrual/Desktop/dev/Suqucom-eCommerce-Platform/client/node_modules/.pnpm/unplugin-auto-import@0.17.6/node_modules/unplugin-auto-import/dist/vite.js";
import Layouts from "file:///C:/Users/Vitrual/Desktop/dev/Suqucom-eCommerce-Platform/client/node_modules/.pnpm/vite-plugin-vue-layouts@0.11.0_vite@5.3.1_vue-router@4.3.3_vue@3.4.29/node_modules/vite-plugin-vue-layouts/dist/index.mjs";
import Components from "file:///C:/Users/Vitrual/Desktop/dev/Suqucom-eCommerce-Platform/client/node_modules/.pnpm/unplugin-vue-components@0.27.0_vue@3.4.29/node_modules/unplugin-vue-components/dist/vite.js";
import {
  AntDesignVueResolver,
  ElementPlusResolver,
  VantResolver
} from "file:///C:/Users/Vitrual/Desktop/dev/Suqucom-eCommerce-Platform/client/node_modules/.pnpm/unplugin-vue-components@0.27.0_vue@3.4.29/node_modules/unplugin-vue-components/dist/resolvers.js";
import { VueRouterAutoImports } from "file:///C:/Users/Vitrual/Desktop/dev/Suqucom-eCommerce-Platform/client/node_modules/.pnpm/unplugin-vue-router@0.8.8_vue-router@4.3.3_vue@3.4.29/node_modules/unplugin-vue-router/dist/index.mjs";
import { PrimeVueResolver } from "file:///C:/Users/Vitrual/Desktop/dev/Suqucom-eCommerce-Platform/client/node_modules/.pnpm/unplugin-vue-components@0.27.0_vue@3.4.29/node_modules/unplugin-vue-components/dist/resolvers.js";
var __vite_injected_original_import_meta_url = "file:///C:/Users/Vitrual/Desktop/dev/Suqucom-eCommerce-Platform/client/vite.config.ts";
var vite_config_default = defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        secure: false
        // rewrite: (path) => path.replace(/^\/api/, ''),
      }
    }
  },
  plugins: [
    VueRouter({
      extensions: [".vue", ".md"],
      dts: "src/typed-router.d.ts"
    }),
    vue(),
    UnoCSS(),
    AutoImport({
      imports: [
        "vue",
        VueRouterAutoImports,
        {
          // add any other imports you were relying on
          "vue-router/auto": ["useLink"]
        }
      ],
      dts: "src/auto-imports.d.ts",
      dirs: [
        "src/composables",
        "src/stores"
      ],
      vueTemplate: true
    }),
    Components({
      resolvers: [
        AntDesignVueResolver(),
        ElementPlusResolver(),
        VantResolver(),
        PrimeVueResolver()
      ]
    }),
    Layouts()
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxWaXRydWFsXFxcXERlc2t0b3BcXFxcZGV2XFxcXFN1cXVjb20tZUNvbW1lcmNlLVBsYXRmb3JtXFxcXGNsaWVudFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcVml0cnVhbFxcXFxEZXNrdG9wXFxcXGRldlxcXFxTdXF1Y29tLWVDb21tZXJjZS1QbGF0Zm9ybVxcXFxjbGllbnRcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL1ZpdHJ1YWwvRGVza3RvcC9kZXYvU3VxdWNvbS1lQ29tbWVyY2UtUGxhdGZvcm0vY2xpZW50L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSAnbm9kZTp1cmwnXHJcblxyXG5cclxuaW1wb3J0IFVub0NTUyBmcm9tICd1bm9jc3Mvdml0ZSdcclxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXHJcbmltcG9ydCBWdWVSb3V0ZXIgZnJvbSAndW5wbHVnaW4tdnVlLXJvdXRlci92aXRlJ1xyXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJ1xyXG5pbXBvcnQgTGF5b3V0cyBmcm9tICd2aXRlLXBsdWdpbi12dWUtbGF5b3V0cyc7XHJcbmltcG9ydCBDb21wb25lbnRzIGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGUnXHJcbmltcG9ydCB7XHJcbiAgQW50RGVzaWduVnVlUmVzb2x2ZXIsXHJcbiAgRWxlbWVudFBsdXNSZXNvbHZlcixcclxuICBWYW50UmVzb2x2ZXIsXHJcbn0gZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvcmVzb2x2ZXJzJ1xyXG5cclxuaW1wb3J0IHsgVnVlUm91dGVyQXV0b0ltcG9ydHMgfSBmcm9tICd1bnBsdWdpbi12dWUtcm91dGVyJ1xyXG5pbXBvcnQgeyBQcmltZVZ1ZVJlc29sdmVyIH0gZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvcmVzb2x2ZXJzJztcclxuXHJcblxyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBzZXJ2ZXI6IHtcclxuXHJcbiAgICBwcm94eToge1xyXG4gICAgICBcclxuICAgICAgXCIvYXBpXCI6IHtcclxuICAgICAgICB0YXJnZXQ6IFwiaHR0cDovLzEyNy4wLjAuMTo4MDAwXCIsXHJcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgIHNlY3VyZTpmYWxzZVxyXG4gICAgICAgIC8vIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9hcGkvLCAnJyksXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG4gIHBsdWdpbnM6IFtcclxuICAgIFZ1ZVJvdXRlcih7XHJcbiAgICAgIGV4dGVuc2lvbnM6IFsnLnZ1ZScsICcubWQnXSxcclxuICAgICAgZHRzOiAnc3JjL3R5cGVkLXJvdXRlci5kLnRzJyxcclxuICAgIH0pLFxyXG4gICAgdnVlKCksXHJcbiAgICBVbm9DU1MoKSxcclxuICAgIEF1dG9JbXBvcnQoe1xyXG4gICAgICBpbXBvcnRzOiBbXHJcbiAgICAgICAgJ3Z1ZScsXHJcblxyXG4gICAgICAgIFZ1ZVJvdXRlckF1dG9JbXBvcnRzLFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIC8vIGFkZCBhbnkgb3RoZXIgaW1wb3J0cyB5b3Ugd2VyZSByZWx5aW5nIG9uXHJcbiAgICAgICAgICAndnVlLXJvdXRlci9hdXRvJzogWyd1c2VMaW5rJ10sXHJcbiAgICAgICAgfSxcclxuICAgICAgXSxcclxuICAgICAgZHRzOiAnc3JjL2F1dG8taW1wb3J0cy5kLnRzJyxcclxuICAgICAgZGlyczogW1xyXG4gICAgICAgICdzcmMvY29tcG9zYWJsZXMnLFxyXG4gICAgICAgICdzcmMvc3RvcmVzJyxcclxuICAgICAgXSxcclxuICAgICAgdnVlVGVtcGxhdGU6IHRydWUsXHJcbiAgICB9KSxcclxuICAgIENvbXBvbmVudHMoe1xyXG4gICAgICByZXNvbHZlcnM6IFtcclxuICAgICAgICBBbnREZXNpZ25WdWVSZXNvbHZlcigpLFxyXG4gICAgICAgIEVsZW1lbnRQbHVzUmVzb2x2ZXIoKSxcclxuICAgICAgICBWYW50UmVzb2x2ZXIoKSwgUHJpbWVWdWVSZXNvbHZlcigpXHJcbiAgICAgIF0sXHJcbiAgICB9KSxcclxuICAgIExheW91dHMoKVxyXG4gIF0sXHJcblxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgICdAJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYycsIGltcG9ydC5tZXRhLnVybCkpXHJcbiAgICB9XHJcbiAgfVxyXG59KSJdLAogICJtYXBwaW5ncyI6ICI7QUFBMFgsU0FBUyxlQUFlLFdBQVc7QUFHN1osT0FBTyxZQUFZO0FBQ25CLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sU0FBUztBQUNoQixPQUFPLGVBQWU7QUFDdEIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxhQUFhO0FBQ3BCLE9BQU8sZ0JBQWdCO0FBQ3ZCO0FBQUEsRUFDRTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsT0FDSztBQUVQLFNBQVMsNEJBQTRCO0FBQ3JDLFNBQVMsd0JBQXdCO0FBakJnTixJQUFNLDJDQUEyQztBQXNCbFMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsUUFBUTtBQUFBLElBRU4sT0FBTztBQUFBLE1BRUwsUUFBUTtBQUFBLFFBQ04sUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsUUFBTztBQUFBO0FBQUEsTUFFVDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxVQUFVO0FBQUEsTUFDUixZQUFZLENBQUMsUUFBUSxLQUFLO0FBQUEsTUFDMUIsS0FBSztBQUFBLElBQ1AsQ0FBQztBQUFBLElBQ0QsSUFBSTtBQUFBLElBQ0osT0FBTztBQUFBLElBQ1AsV0FBVztBQUFBLE1BQ1QsU0FBUztBQUFBLFFBQ1A7QUFBQSxRQUVBO0FBQUEsUUFDQTtBQUFBO0FBQUEsVUFFRSxtQkFBbUIsQ0FBQyxTQUFTO0FBQUEsUUFDL0I7QUFBQSxNQUNGO0FBQUEsTUFDQSxLQUFLO0FBQUEsTUFDTCxNQUFNO0FBQUEsUUFDSjtBQUFBLFFBQ0E7QUFBQSxNQUNGO0FBQUEsTUFDQSxhQUFhO0FBQUEsSUFDZixDQUFDO0FBQUEsSUFDRCxXQUFXO0FBQUEsTUFDVCxXQUFXO0FBQUEsUUFDVCxxQkFBcUI7QUFBQSxRQUNyQixvQkFBb0I7QUFBQSxRQUNwQixhQUFhO0FBQUEsUUFBRyxpQkFBaUI7QUFBQSxNQUNuQztBQUFBLElBQ0YsQ0FBQztBQUFBLElBQ0QsUUFBUTtBQUFBLEVBQ1Y7QUFBQSxFQUVBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssY0FBYyxJQUFJLElBQUksU0FBUyx3Q0FBZSxDQUFDO0FBQUEsSUFDdEQ7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
