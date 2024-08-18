import commonjs    from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import typescript  from '@rollup/plugin-typescript'
import terser      from '@rollup/plugin-terser';


const treeshake = {
	moduleSideEffects       : false,
	propertyReadSideEffects : false,
	tryCatchDeoptimization  : false
}

const onwarn = (warning) => {
  if (
    warning.code === 'INVALID_ANNOTATION' && 
    warning.message.includes('@__PURE__')
  ) {
    return
  }
  throw new Error(warning)
}

export default {
  plugins: [ typescript(), nodeResolve(), commonjs() ],
  input: 'ts_src/index.ts',
  onwarn,
  output: [
    {
      file: 'src/cjs/index.cjs',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'src/esm/index.js',
      format: 'es',
      sourcemap: true,
      minifyInternalExports: false
    }
  ],
  strictDeprecations: true,
  treeshake
}