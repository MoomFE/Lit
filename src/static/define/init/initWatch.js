import each from "../../../shared/util/each";
import isPlainObject from "../../../shared/util/isPlainObject";
import isFunction from "../../../shared/util/isFunction";
import { isArray } from "../../../shared/global/Array/index";
import isString from "../../../shared/util/isString";
import { apply } from "../../../shared/global/Reflect/index";


export default function initWatch( options, target, targetProxy ){
  // 添加监听方法
  each( options.watch, function createWatcher( expOrFn, options ){
    if( isArray( options ) ){
      for( const handler of options ){
        createWatcher( expOrFn, handler );
      }
    }else if( isPlainObject( options ) || isFunction( options ) ){
      targetProxy.$watch( expOrFn, options );
    }else if( isString( options ) ){
      targetProxy.$watch( expOrFn, function(){
        return apply( this[ options ], this, arguments );
      });
    }
  });
}