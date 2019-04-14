import 'colors';
import '@moomfe/zenjs';
import fs from 'fs-extra';
import path from 'path';
import zlib from 'zlib';
import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import { terser } from 'rollup-plugin-terser';


const packages = require('./package.json');
const READMEPATH = path.resolve( __dirname, 'README.md' );

function getSize( size ){
  if( size < 1024 ) return size + 'B';
  else return ( size / 1024 ).toFixed( 2 ) + 'KB';
}

// 基础配置
const basic = {
  input: 'src/build/index.js',
  output: {
    file: 'dist/hu.js',
    format: 'umd',
    name: 'Hu',
    banner: `/*!\n * ${ packages.title } v${ packages.version }\n * ${ packages.homepage }\n * \n * (c) 2018-present ${ packages.author }\n * Released under the MIT License.\n */\n`
  },
  plugins: [
    {
      name: 'Fix SyntaxError error in Firefox 51 and below',
      renderChunk( code, chunk, outputOptions ){
        return code.replace(
          /for\s*\(\s*const\s*([^\s]+)\s*of/g,
          'for( let $1 of'
        );
      }
    },
    {
      name: 'fix lit-html: window is not defined',
      async load( id ){
        if( /\\node_modules\\lit-html\\lib\\dom\.js$/i.test( id ) ){
          const source = ( await fs.readFile( id, 'utf-8' ) ).replace(
            'window.customElements !== undefined &&',
            'inBrowser && window.customElements !== undefined &&'
          );

          return `
            import { inBrowser } from '../../../src/shared/const/env';
            ${ source }
          `;
        }else if( /\\node_modules\\lit-html\\lit-html\.js$/i.test( id ) ){
          const source = ( await fs.readFile( id, 'utf-8' ) ).replace(
            `(window['litHtmlVersions']`,
            `inBrowser && (window['litHtmlVersions']`
          );

          return `
            import { inBrowser } from '../../src/shared/const/env';
            ${ source }
          `;
        }

        return null;
      }
    },
    {
      name: 'console',
      buildStart( inputOptions ){
        const input = path.resolve( __dirname, inputOptions.input );

        this.time = Date.$valueOf();

        console.log(`------------------------------------`);
        console.log(`- Input   : ${ input.green }`);
      },
      generateBundle( outputOptions, bundle ){
        const date = ( new Date ).$format('YYYY-MM-DD HH:mm:ss Z');
        const time = Date.$valueOf() - this.time + 'ms';
        const [ name, options ] = Object.entries( bundle )[0];
        const output = path.resolve( __dirname, `dist/${ name }` );
        const size = getSize( options.code.length );
        const gzipSize = getSize( zlib.gzipSync( options.code ).length );

        console.log(`- Output  : ${ output.green } - ( ${ size.green } / ${ gzipSize.green } )`);
        console.log(`- Built at: ${ date.green }`);
        console.log(`- Time    : ${ time.green }`);
        console.log(`------------------------------------\n`);
      }
    },
    resolve(),
    {
      name: 'update-readme',
      writeBundle( bundle ){
        Object.entries( bundle ).$each(([ name, options ]) => {
          const size = ( options.code.length / 1024 ).toFixed( 2 );
          const gzipSize = ( zlib.gzipSync( options.code ).length / 1024 ).toFixed( 2 );
          const rSearch = new RegExp(`(\\|\\s+\\*\\*${ name }\\*\\*<br>\\*)[0-9\\.]+(KB\\s+/\\s+)[0-9\\.]+(KB\\*\\s+\\|)`);
          const readmeContent = fs.readFileSync( READMEPATH, 'utf-8' );

          rSearch.test( readmeContent ) && fs.writeFileSync(
            READMEPATH,
            readmeContent.replace(
              rSearch,
              `$1${ size }$2${ gzipSize }$3`
            )
          );
        });
      }
    }
  ]
};

const configs = [];

// 使用 build 指令构建
if( process.env.build ){

  const terserOptions = terser({
    ecma: 6,
    warnings: true,
    output: {
      comments: false
    },
    compress: {
      /** 压缩代码次数 */
      passes: 3,
      /**
       * 不安全的转换
       * 
       * new Array( 1, 2, 3 )                         -> [ 1, 2, 3 ]
       * Array( 1, 2, 3 )                             -> [ 1, 2, 3 ]
       * new Object()                                 -> {}
       * String( exp )                                -> "" + exp
       * exp.toString()                               -> "" + exp
       * new Object/RegExp/Function/Error/Array (...) -> Object/RegExp/Function/Error/Array (...)
       * "foo bar".substr( 4 )                        -> "bar"
       */
      unsafe: true,
      /**
       * 优化表达式
       * 
       * Array.prototype.slice.call( a )              ->  [].slice.call(a)
       */
      unsafe_proto: true,
      /**
       * 优化匿名函数
       * 
       * (function(){})()                             -> (() => {})()
       */
      unsafe_arrows: true,
      /**
       * 简短写法
       * 
       * { a: function(){} }                          -> { a(){} }
       */
      unsafe_methods: true
    }
  });

  // UMD
  configs.$concat([
    basic,
    Object.$assign( null, basic, {
      input: 'src/build/polyfill.js',
      output: {
        file: 'dist/hu.polyfill.js'
      }
    }),
    Object.$assign( null, basic, {
      input: 'src/build/polyfill.async.js',
      output: {
        file: 'dist/hu.polyfill.async.js'
      }
    })
  ]);

  // UMD Minify
  configs.$each( config => {
    const newConfig = Object.$assign( null, config, {
      output: {
        file: config.output.file.replace( /\.js$/, '.min.js' )
      }
    });

    newConfig.plugins.push( terserOptions );

    configs.push( newConfig );
  });

  [ ...configs ]
    // CommonJS + CommonJS Minify
    .$each( config => {
      const isMinify = /\.min\.js$/.test( config.output.file );
      const newConfig = Object.$assign( null, config, {
        output: {
          format: 'cjs',
          file: isMinify ? config.output.file.replace( /\.min\.js$/, '.common.min.js' )
                         : config.output.file.replace( /\.js$/, '.common.js' )
        }
      });

      configs.push( newConfig );
    })
    // ES Module + ES Module Minify
    .$each( config => {
      const isMinify = /\.min\.js$/.test( config.output.file );
      const newConfig = Object.$assign( null, config, {
        output: {
          format: 'es',
          file: isMinify ? config.output.file.replace( /\.min\.js$/, '.esm.min.js' )
                         : config.output.file.replace( /\.js$/, '.esm.js' )
        }
      });

      configs.push( newConfig );
    });

}
// 使用 watch 指令构建
else if( process.env.watch ){
  configs.push( basic );
}

// 修复 webcomponentsjs polyfill 的 "window is not defined" 错误
if( configs.length ){
  configs.$each( config => {
    const isPolyfill = /\.polyfill\./.test( config.output.file );

    if( isPolyfill ){
      config.plugins.push({
        name: 'fix webcomponentsjs: window is not defined',
        async load( id ){
          if( /\\node_modules\\@webcomponents\\webcomponentsjs\\webcomponents-(bundle|loader)\.js$/.test( id ) ){
            const source = ( await fs.readFile( id, 'utf-8' ) );

            return `
              import { inBrowser } from '../../../src/shared/const/env';
              inBrowser && (() => {
                ${ source }
              })();
            `;
          }
          return null;
        }
      })
    }
  });
}

// 字符串替换
if( configs.length ){
  let productionReplace, developmentReplace;

  configs.$each( config => {
    const isProduction = /\.min\.js$/.test( config.output.file );
    let myReplace;

    if( isProduction ){
      myReplace = productionReplace || ( productionReplace = replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
        '__VERSION__': packages.version
      }));
    }else{
      myReplace = developmentReplace || ( developmentReplace = replace({
        'process.env.NODE_ENV': JSON.stringify('development'),
        '__VERSION__': packages.version
      }));
    }

    config.plugins.push( myReplace );
  });
}

if( configs.length ){
  configs
    .filter( config => config.output.file === basic.output.file )
    .forEach( config => {
      config.plugins.push({
        name: 'copy to test',
        writeBundle( bundle ){
          fs.writeFileSync( 'test/Lib/hu.js', bundle['hu.js'].code, 'utf-8' )
        }
      });
    });
}

{
  const from = 'node_modules/@webcomponents/webcomponentsjs';
  const to = 'test/Lib';

  // 拷贝最新的 polyfill 加载器到测试文件夹中
  fs.copy( `${ from }/webcomponents-loader.js`, `${ to }/webcomponents-loader.js`, {
    overwrite: true
  });

  // 拷贝最新的 polyfill 到测试文件夹中
  fs.readdir( `${ from }/bundles`, ( err, files ) => {
    files.forEach( name => {
      /\.js$/.test( name ) && fs.copy( `${ from }/bundles/${ name }`, `${ to }/bundles/${ name }`, {
        overwrite: true
      });
    });
  });
}

module.exports = configs;