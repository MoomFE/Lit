import { render } from 'lit-html';
import { renderStack, bindWatchesMap } from './const';


export default function( result, container, options ){

  // 当前渲染元素属性监听解绑方法集
  const bindWatches = bindWatchesMap.get( container );

  if( bindWatches ){
    // 解绑上次渲染时收集到的属性监听
    for( const unWatch of bindWatches ){
      unWatch();
    }
    // 清空属性监听, 重新进行收集
    bindWatches.length = 0;
  }

  renderStack.push( container );

  render( result, container, options );

  renderStack.pop();
}