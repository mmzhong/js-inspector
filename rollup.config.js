import typescript from 'rollup-plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

const plugins = [
  resolve(),
  commonjs({
    include: 'node_modules/**',
    namedExports: {
      'node_modules/react/index.js': ['Component', 'createElement', 'PropTypes'],
      'node_modules/react-dom/index.js': ['render']
    }
  }),
  typescript({
    typescript: require('typescript')
  }),
];

export default [
  {
    input: "src/main.tsx",
    external: ['react', 'react-dom', 'acorn', 'walk'],
    output: {
      file: 'dist/main.js',
      format: 'iife'
    },
    plugins
  },
  {
    input: "src/worker.ts",
    output: {
      file: 'dist/worker.js',
      format: 'iife'
    },
    plugins
  }
]