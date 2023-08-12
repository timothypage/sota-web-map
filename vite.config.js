import { defineConfig, splitVendorChunkPlugin } from 'vite'

export default defineConfig({
  plugins: [splitVendorChunkPlugin()],
})

// export default {
//   build: {
//     sourcemap: true,
//     minify: false
//   }
// }
