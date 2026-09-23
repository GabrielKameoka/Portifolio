import { defineConfig } from "vite";
import { resolve } from "node:path";
import { readFileSync } from "node:fs";
export default defineConfig({
  plugins: [
    {
      name: "inline-initial-theme",
      // Apply the shared theme before first paint without an extra network request.
      transformIndexHtml: {
        order: "pre",
        handler(html) {
          return html.replace(
            /<script src="(?:\.\/|\.\.\/)js\/theme\.js"><\/script>/,
            () => `<script>${readFileSync("src/js/theme.js", "utf8")}</script>`,
          );
        },
      },
    },
  ],
  root: "src",
  base: "./",
  publicDir: false,
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve("src/index.html"),
        sinalvortex: resolve("src/projetos/sinalvortex.html"),
        repcortex: resolve("src/projetos/repcortex.html"),
      },
    },
  },
});
