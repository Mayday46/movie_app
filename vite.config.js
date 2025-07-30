// import tailwindcss from '@tailwindcss/vite'
// import react from '@vitejs/plugin-react'
// import { defineConfig } from 'vite'


// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(), tailwindcss()],
// })
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // Expose to local & external networks
    allowedHosts: [
      '0404-74-72-0-203.ngrok-free.app' // 👈 your current ngrok subdomain
    ]
  }
})
