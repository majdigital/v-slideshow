import commonjs from 'rollup-plugin-commonjs';
import vue from 'rollup-plugin-vue';
import nodent from 'rollup-plugin-nodent';
import buble from 'rollup-plugin-buble';
import { terser } from 'rollup-plugin-terser';

import utils from './utils';
import banner from './banner';

const pkg = require('../package.json');

export default {
  input: 'src/wrapper.js',
  output: { banner, name: utils.toPascalCase(pkg.name), exports: 'named' },
  plugins: [
    commonjs(),
    vue({ css: true, compileTemplate: true }),
    nodent(),
    buble({ objectAssign: true }),
    terser({ include: [/^.+\.min\.js$/] }),
  ],
};
