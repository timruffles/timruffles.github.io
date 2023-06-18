const { build } = require("esbuild");
const { Generator } = require('npm-dts');

new Generator({
  entry: 'index.ts',
  output: 'dist/index.d.ts',
}).generate();


build({
  entryPoints: ["index.ts"],
  bundle: true,
  minify: false,
  target: "node16",
  sourcemap: "inline",
  platform: 'node', // for CJS
  outfile: "dist/index.js",
});
