const { build } = require("esbuild");
const { dependencies } = require('./package.json');
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
  external: Object.keys(dependencies || {}),
  platform: 'node', // for CJS
  outfile: "dist/index.js",
});
