//noderesolve and commonjs are needed for prism.js
import noderesolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
//Server and live reload
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
//JS
import babel from '@rollup/plugin-babel'
import { terser } from 'rollup-plugin-terser'
//CSS
import cssPlugin from 'rollup-plugin-postcss-amstramgram'
import postcssImport from 'postcss-import'
import postcssPresetEnv from 'postcss-preset-env'
import cssnano from 'cssnano'
//HTML
import htmlPlugin from 'rollup-plugin-posthtml-amstramgram'
import htmlinclude from 'posthtml-include'
import htmlnano from 'htmlnano'
//Assets
//Watch changes in assets and plugins folders
import watcher from 'rollup-plugin-watcher-amstramgram'
import fsExtra from 'fs-extra'//To empty prod folder when building for production
import copy from 'rollup-plugin-copy'//Copy assets folder from dev to prod folder


const
  src = 'docs_src/',
  dev = 'docs_dev/',
  prod = 'docs/',
  dest = process.env.BUILD === 'development' ? dev : prod,
  //Babel basic configuration
  babelModule = {
    babelHelpers: 'bundled',
    plugins: [
      ['prismjs', {
        'languages': ['html', 'javascript', 'js-extras', 'json'],
      }]
    ]
  },
  //Babel configuration to support old browsers
  babelNoModule = Object.assign({
    exclude: [/\/core-js\//],
    presets: [
      [
        '@babel/preset-env',
        {
          'useBuiltIns': 'usage',
          'corejs': '3.8'
        }
      ]
    ],
  }, babelModule)

//Clean production directory before production build
if (process.env.BUILD === 'production') fsExtra.emptyDirSync(prod)

//FIRST ROLLUP TASK :
//- bundle js in a module
//- watch assets and rollupPlugins folders
//- compile css with minification if in production
//- compile html with minification if in production
//- launch server with livereload if in development
//- copy assets and minify js if in production
const moduleExport = {
  input: `${src}js/index.js`,
  output: {
    file: `${dest}js/index.js`,
    format: 'esm',
    sourcemap: process.env.BUILD === 'development',
  },
  plugins: [
    //noderesolve and commonjs are needed for prism.js
    noderesolve(),
    commonjs(),
    cssPlugin({
      from: `${src}css/`,
      to: `${dest}css`,
      sourceMap: process.env.BUILD === 'development',
      plugins: [
        postcssImport(),
        postcssPresetEnv({
          stage: 1,
          importFrom: [
            `${src}css/common/const.css`//Needed for css custom properties
          ]
        }),
        ...(process.env.BUILD === 'production' ? [cssnano()] : [])
      ]
    }),
    htmlPlugin({
      from: src,
      to: dest,
      plugins: [
        htmlinclude({
          root: `${src}html/`
        }),
        ...(process.env.BUILD === 'production' ? [htmlnano()] : [])
      ]
    }),
    ...(Object.keys(babelModule).length > 0 ? [babel(babelModule)] : []),
    ...(process.env.BUILD === 'development' ?
      [//Server and livereload for development
        serve({
          open: true,
          contentBase: dev,
          port: 8000
        }),
        livereload(),
        watcher({
          files: [`${dev}assets`],
          verbose: true
        }),
      ]
      :
      [//Copy assets folder
        copy({
          targets: [
            { src: `${dev}assets`, dest: prod }
          ]
        }),
        //and minify
        terser()
      ]
    )
  ],
  //Comment/Uncomment if you need
  watch: {
    clearScreen: process.env.BUILD === 'production',
  },
}

//SECOND ROLLUP TASK : bundle js in IIFE format
const noModuleExport = {
  input: `${src}js/index.js`,
  output: {
    file: `${dest}js/noModule/index.js`,
    format: 'iife'
  },
  plugins: [
    //noderesolve and commonjs are needed for prism.js
    noderesolve(),
    commonjs(),
    babel(babelNoModule),
    ...(process.env.BUILD === 'production' ? [terser()] : [])
  ]
}

//THIRD ROLLUP TASK : bundle polyfills
const polyfillExport = {
  input: `${src}js/polyfills/polyfill.js`,
  output: {
    file: `${dest}js/polyfills/polyfill.js`,
    format: 'iife'
  },
  plugins: [
    ...(process.env.BUILD === 'production' ? [terser()] : [])
  ]
}

//Export rollup tasks
export default [moduleExport, noModuleExport, polyfillExport]