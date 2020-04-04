import filesize from 'rollup-plugin-filesize'
import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import pkg from './package.json'

const extensions = [
  '.js', '.jsx', '.ts', '.tsx'
]

module.exports = {
  input: './src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs'
    },
    {
      file: pkg.module,
      format: 'esm'
    }
  ],
  external: [
    'react',
    'react-dom',
    'prop-types'
  ],
  plugins: [
    resolve({
      extensions
    }),
    babel({
      extensions,
      include: ['src/**/*'],
      plugins: [
        'babel-plugin-typescript-to-proptypes'
      ]
    }),
    filesize()
  ]
}
