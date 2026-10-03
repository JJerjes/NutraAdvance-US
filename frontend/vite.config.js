import { resolve } from 'path';
import { defineConfig } from 'vite';

const __dirname = import.meta.dirname;

export default defineConfig({
  base: '/',
  publicDir: 'public',
  appType: 'mpa',
  css: {
    transformer: 'postcss',
  },
  build: {
    outDir: 'dist',
    cssMinify: false,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        // notFound: resolve(__dirname, '404.html'),
        // salud: resolve(__dirname, 'pages/salud.html'),
        // accesorios: resolve(__dirname, 'pages/accesorios.html'),
        // accesoriosHombres: resolve(__dirname, 'pages/accesorios-hombres.html'),
        // accesoriosMujeres: resolve(__dirname, 'pages/accesorios-mujeres.html'),
        // clientes: resolve(__dirname, 'pages/clientes.html'),
        // checkout: resolve(__dirname, 'pages/checkout.html'),
      },
    },
  },
});
