import { resolve } from 'path';
import { defineConfig } from 'vite';

const __dirname = import.meta.dirname;

export default defineConfig({
  base: '/',
  publicDir: 'public',
  appType: 'mpa',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        notFound: resolve(__dirname, '404.html'),
        salud: resolve(__dirname, 'pages/salud.html'),
        accesorios: resolve(__dirname, 'pages/accesorios.html'),
        accesoriosHombres: resolve(__dirname, 'pages/accesorios-hombres.html'),
        accesoriosMujeres: resolve(__dirname, 'pages/accesorios-mujeres.html'),
        clientes: resolve(__dirname, 'pages/clientes.html'),
        checkout: resolve(__dirname, 'pages/checkout.html'),
      },
    },
  }
});