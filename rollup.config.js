import minify from 'rollup-plugin-babel-minify';

export default {
  input: './src/index.js',
  plugins: [
    minify(),
  ],
  output: {
    name: 'ferpReact',
    file: 'index.js',
    format: 'umd',
  },
};
