import { defineProperty } from "../global/Reflect/index";


export const inBrowser = typeof window !== 'undefined';
export const UA = inBrowser && window.navigator.userAgent.toLowerCase();
export const isIOS = UA && /iphone|ipad|ipod|ios/.test( UA );
export const isFirefox = UA && UA.indexOf('firefox') > -1;


export let supportsPassive = false;

try{

  const options = {};

  defineProperty( options, 'passive', {
    get: () => {
      return supportsPassive = true;
    }
  });

  window.addEventListener( 'test-passive', null, options );

}catch(e){}


export const hasShadyCss = inBrowser
                        && window.ShadyCSS !== void 0
                        && !window.ShadyCSS.nativeShadow;

export const isCEPolyfill = inBrowser
                         && window.customElements !== void 0
                         && window.customElements.polyfillWrapFlushCallback !== void 0;