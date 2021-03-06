/* global triggerEvent */
/* eslint-disable no-unused-expressions */


import { expect } from 'chai';
import Hu from '../../../../src/build/index';
import { supportsPassive } from '../../../../src/shared/const/env';


describe('html.directiveBasic', () => {
  const render = Hu.render;

  /** @type {Element} */
  let div;
  beforeEach(() => {
    div = document.createElement('div').$appendTo(document.body);
  });
  afterEach(() => {
    div.$remove();
  });


  it('使用 .prop 的方式对元素属性 ( Property ) 进行绑定', () => {
    render(div)`
      <div .prop=${{ a: 1, b: 2 }}></div>
    `;
    expect(div.firstElementChild.prop).is.deep.equals({ a: 1, b: 2 });
    expect(div.firstElementChild.hasAttribute('prop')).is.false;

    render(div)`
      <div .parent=${div}></div>
    `;
    expect(div.firstElementChild.parent).is.equals(div);
    expect(div.firstElementChild.hasAttribute('parent')).is.false;

    render(div)`
      <div .prop=${123}></div>
    `;
    expect(div.firstElementChild.prop).is.equals(123);
    expect(div.firstElementChild.hasAttribute('prop')).is.false;
  });

  it('使用 ?attr 的方式对元素属性 ( Attribute ) 进行绑定', () => {
    render(div)`
      <input ?disabled=${true}>
    `;
    expect(div.firstElementChild.hasAttribute('disabled')).is.true;
    expect(div.firstElementChild.getAttribute('disabled')).is.equals('');
    expect(div.firstElementChild.disabled).is.true;

    render(div)`
      <input ?disabled=${false}>
    `;
    expect(div.firstElementChild.hasAttribute('disabled')).is.false;
    expect(div.firstElementChild.getAttribute('disabled')).is.null;
    expect(div.firstElementChild.disabled).is.false;
  });

  it('使用 @event 的方式对自定义元素绑定事件监听, 会监听由自定义元素触发的方法', () => {
    const customName = window.customName;
    let index = 0;

    Hu.define(customName);

    render(div)(
      [`<${customName} @click=`, `></${customName}>`],
      () => index++
    );

    expect(index).is.equals(0);

    div.firstElementChild.click();
    expect(index).is.equals(0);

    div.firstElementChild.click();
    div.firstElementChild.click();
    expect(index).is.equals(0);

    div.firstElementChild.$emit('click');
    expect(index).is.equals(1);

    div.firstElementChild.$emit('click');
    div.firstElementChild.$emit('click');
    expect(index).is.equals(3);
  });

  it('使用 @event 的方式对自定义元素绑定事件监听, 使用 .once 修饰符', () => {
    const customName = window.customName;
    let index = 0;

    Hu.define(customName);

    render(div)(
      [`<${customName} @click.once=`, `></${customName}>`],
      () => index++
    );

    expect(index).is.equals(0);

    div.firstElementChild.click();
    expect(index).is.equals(0);

    div.firstElementChild.click();
    div.firstElementChild.click();
    expect(index).is.equals(0);

    div.firstElementChild.$emit('click');
    expect(index).is.equals(1);

    div.firstElementChild.$emit('click');
    div.firstElementChild.$emit('click');
    expect(index).is.equals(1);
  });

  it('使用 @event 的方式对自定义元素绑定事件监听, 使用 .native 修饰符', () => {
    const customName = window.customName;
    let index = 0;

    Hu.define(customName);

    render(div)(
      [`<${customName} @click.native=`, `></${customName}>`],
      () => index++
    );

    expect(index).is.equals(0);

    div.firstElementChild.click();
    expect(index).is.equals(1);

    div.firstElementChild.click();
    div.firstElementChild.click();
    expect(index).is.equals(3);

    div.firstElementChild.$emit('click');
    expect(index).is.equals(3);

    div.firstElementChild.$emit('click');
    div.firstElementChild.$emit('click');
    expect(index).is.equals(3);
  });

  it('使用 @event 的方式对自定义元素绑定事件监听, 使用 .native 和 .once 修饰符', () => {
    const customName = window.customName;
    let index = 0;

    Hu.define(customName);

    render(div)(
      [`<${customName} @click.native.once=`, `></${customName}>`],
      () => index++
    );

    expect(index).is.equals(0);

    div.firstElementChild.click();
    expect(index).is.equals(1);

    div.firstElementChild.click();
    div.firstElementChild.click();
    expect(index).is.equals(1);

    div.firstElementChild.$emit('click');
    expect(index).is.equals(1);

    div.firstElementChild.$emit('click');
    div.firstElementChild.$emit('click');
    expect(index).is.equals(1);
  });

  it('使用 @event 的方式对元素绑定事件监听', () => {
    let index = 0;

    render(div)`
      <div @click=${() => index++}></div>
    `;

    expect(index).is.equals(0);

    div.firstElementChild.click();
    expect(index).is.equals(1);

    div.firstElementChild.click();
    div.firstElementChild.click();
    expect(index).is.equals(3);
  });

  it('使用 @event 的方式对元素绑定事件监听, 重复渲染时不会绑定多余的事件', () => {
    let index = 0;

    render(div)`
      <div @click=${() => index++}></div>
    `;
    render(div)`
      <div @click=${() => index++}></div>
    `;
    render(div)`
      <div @click=${() => index++}></div>
    `;

    expect(index).is.equals(0);

    div.firstElementChild.click();
    expect(index).is.equals(1);

    div.firstElementChild.click();
    div.firstElementChild.click();
    expect(index).is.equals(3);
  });

  it('使用 @event 的方式对元素绑定事件监听, 重复渲染时移除事件后将不会再触发', () => {
    let index = 0;

    render(div)`
      <div @click=${() => index++}></div>
    `;

    expect(index).is.equals(0);

    div.firstElementChild.click();
    expect(index).is.equals(1);

    div.firstElementChild.click();
    div.firstElementChild.click();
    expect(index).is.equals(3);

    // ------
    render(div)`
      <div @click=${undefined}></div>
    `;

    expect(index).is.equals(3);

    div.firstElementChild.click();
    expect(index).is.equals(3);

    div.firstElementChild.click();
    div.firstElementChild.click();
    expect(index).is.equals(3);
  });

  it('使用 @event 的方式对元素绑定事件监听, 使用 .stop 修饰符可以停止冒泡', () => {
    const result = [];

    render(div)`
      <div ref="none" @click=${() => result.push(1)}></div>
      <div ref="stop" @click.stop=${() => result.push(2)}></div>
    `;

    div.addEventListener('click', () => {
      result.push(0);
    });

    expect(result).is.deep.equals([]);

    div.click();
    div.click();
    expect(result).is.deep.equals([0, 0]);

    div.querySelector('[ref="none"]').click();
    div.querySelector('[ref="none"]').click();
    expect(result).is.deep.equals([0, 0, 1, 0, 1, 0]);

    div.querySelector('[ref="stop"]').click();
    div.querySelector('[ref="stop"]').click();
    expect(result).is.deep.equals([0, 0, 1, 0, 1, 0, 2, 2]);
  });

  it('使用 @event 的方式对元素绑定事件监听, 使用 .prevent 修饰符可以阻止浏览器默认事件', () => {
    let none;
    let prevent;

    render(div)`
      <div ref="none" type="checkbox" @click=${(event) => (none = event.defaultPrevented)}></div>
      <div ref="prevent" type="checkbox" @click.prevent=${(event) => (prevent = event.defaultPrevented)}></div>
    `;

    expect(none).is.undefined;
    expect(prevent).is.undefined;

    div.querySelector('[ref="none"]').click();
    div.querySelector('[ref="prevent"]').click();

    expect(none).is.false;
    expect(prevent).is.true;
  });

  it('使用 @event 的方式对元素绑定事件监听, 使用 .capture 修饰符', () => {
    const none = [];
    const capture = [];

    render(div)`
      <div ref="none" @click=${() => none.push(0)}>
        <div @click=${() => none.push(1)}></div>
      </div>
      <div ref="capture" @click.capture=${() => capture.push(0)}>
        <div @click=${() => capture.push(1)}></div>
      </div>
    `;

    expect(none).is.deep.equals([]);
    expect(capture).is.deep.equals([]);

    div.querySelector('[ref="none"]').firstElementChild.click();
    div.querySelector('[ref="capture"]').firstElementChild.click();

    expect(none).is.deep.equals([1, 0]);
    expect(capture).is.deep.equals([0, 1]);
  });

  if (supportsPassive) {
    it('使用 @event 的方式对元素绑定事件监听, 使用 .passive 修饰符', () => {
      function prevent(event) {
        event.preventDefault();
      }

      render(div)`
        <input type="checkbox" ref="none" @click=${prevent}>
        <input type="checkbox" ref="passive" @click.passive=${prevent}>
        <input type="checkbox" ref="exclusive" @click.prevent.passive=${null}>
      `;

      div.querySelector('[ref="none"]').checked = false;
      div.querySelector('[ref="passive"]').checked = false;
      div.querySelector('[ref="exclusive"]').checked = false;

      div.querySelector('[ref="none"]').click();
      div.querySelector('[ref="passive"]').click();
      div.querySelector('[ref="exclusive"]').click();
      expect(div.querySelector('[ref="none"]').checked).is.false;
      expect(div.querySelector('[ref="passive"]').checked).is.true;
      expect(div.querySelector('[ref="exclusive"]').checked).is.true;
    });
  }

  it('使用 @event 的方式对元素绑定事件监听, 使用 .once 修饰符', () => {
    let none = 0;
    let once = 0;

    render(div)`
      <div ref="none" @click=${() => none++}></div>
      <div ref="once" @click.once=${() => once++}></div>
    `;

    expect(none).is.equals(0);
    expect(once).is.equals(0);

    div.querySelector('[ref="none"]').click();
    div.querySelector('[ref="none"]').click();
    div.querySelector('[ref="none"]').click();
    expect(none).is.equals(3);
    expect(once).is.equals(0);

    div.querySelector('[ref="once"]').click();
    div.querySelector('[ref="once"]').click();
    div.querySelector('[ref="once"]').click();
    expect(none).is.equals(3);
    expect(once).is.equals(1);
  });

  it('使用 @event 的方式对元素绑定事件监听, 使用 .self 修饰符可以只在当前元素自身时触发事件时触发回调', () => {
    const result = [];

    render(div)`
      <div ref="none" @click=${() => result.push(0)}>
        <span></span>
      </div>
      <div ref="self" @click.self=${() => result.push(1)}>
        <span></span>
      </div>
    `;

    expect(result).is.deep.equals([]);

    div.querySelector('[ref="none"]').click();
    div.querySelector('[ref="self"]').click();
    div.querySelector('[ref="none"]').click();
    div.querySelector('[ref="self"]').click();
    expect(result).is.deep.equals([0, 1, 0, 1]);

    div.querySelector('[ref="none"]').firstElementChild.click();
    div.querySelector('[ref="self"]').firstElementChild.click();
    div.querySelector('[ref="none"]').firstElementChild.click();
    div.querySelector('[ref="self"]').firstElementChild.click();
    expect(result).is.deep.equals([0, 1, 0, 1, 0, 0]);
  });

  it('使用 @event 的方式对元素绑定事件监听, 使用 .left / .middle / .right 修饰符限定鼠标按键', () => {
    let left = 0;
    let middle = 0;
    let right = 0;

    render(div)`
      <div ref="left" @mousedown.left=${() => left++}>left</div>
      <div ref="middle" @mousedown.middle=${() => middle++}>middle</div>
      <div ref="right" @mousedown.right=${() => right++}>right</div>
    `;

    expect(left).is.equals(0);
    triggerEvent(div.querySelector('[ref="left"]'), 'mousedown', (event) => (event.button = 0));
    expect(left).is.equals(1);
    triggerEvent(div.querySelector('[ref="left"]'), 'mousedown', (event) => (event.button = 1));
    expect(left).is.equals(1);
    triggerEvent(div.querySelector('[ref="left"]'), 'mousedown', (event) => (event.button = 2));
    expect(left).is.equals(1);

    expect(middle).is.equals(0);
    triggerEvent(div.querySelector('[ref="middle"]'), 'mousedown', (event) => (event.button = 0));
    expect(middle).is.equals(0);
    triggerEvent(div.querySelector('[ref="middle"]'), 'mousedown', (event) => (event.button = 1));
    expect(middle).is.equals(1);
    triggerEvent(div.querySelector('[ref="middle"]'), 'mousedown', (event) => (event.button = 2));
    expect(middle).is.equals(1);

    expect(right).is.equals(0);
    triggerEvent(div.querySelector('[ref="right"]'), 'mousedown', (event) => (event.button = 0));
    expect(right).is.equals(0);
    triggerEvent(div.querySelector('[ref="right"]'), 'mousedown', (event) => (event.button = 1));
    expect(right).is.equals(0);
    triggerEvent(div.querySelector('[ref="right"]'), 'mousedown', (event) => (event.button = 2));
    expect(right).is.equals(1);
  });

  it('使用 @event 的方式对元素绑定事件监听, 使用 .ctrl / .alt / .shift / .meta 修饰符限定键盘按键', () => {
    let ctrl = 0;
    let alt = 0;
    let shift = 0;
    let meta = 0;

    render(div)`
      <div ref="ctrl" @mousedown.ctrl=${() => ctrl++}>ctrl</div>
      <div ref="alt" @mousedown.alt=${() => alt++}>alt</div>
      <div ref="shift" @mousedown.shift=${() => shift++}>shift</div>
      <div ref="meta" @mousedown.meta=${() => meta++}>meta</div>
    `;

    expect(ctrl).is.equals(0);
    triggerEvent(div.querySelector('[ref="ctrl"]'), 'mousedown', (event) => (event.ctrlKey = true));
    expect(ctrl).is.equals(1);
    triggerEvent(div.querySelector('[ref="ctrl"]'), 'mousedown', (event) => (event.altKey = true));
    expect(ctrl).is.equals(1);
    triggerEvent(div.querySelector('[ref="ctrl"]'), 'mousedown', (event) => (event.shiftKey = true));
    expect(ctrl).is.equals(1);
    triggerEvent(div.querySelector('[ref="ctrl"]'), 'mousedown', (event) => (event.metaKey = true));
    expect(ctrl).is.equals(1);

    expect(alt).is.equals(0);
    triggerEvent(div.querySelector('[ref="alt"]'), 'mousedown', (event) => (event.ctrlKey = true));
    expect(alt).is.equals(0);
    triggerEvent(div.querySelector('[ref="alt"]'), 'mousedown', (event) => (event.altKey = true));
    expect(alt).is.equals(1);
    triggerEvent(div.querySelector('[ref="alt"]'), 'mousedown', (event) => (event.shiftKey = true));
    expect(alt).is.equals(1);
    triggerEvent(div.querySelector('[ref="alt"]'), 'mousedown', (event) => (event.metaKey = true));
    expect(alt).is.equals(1);

    expect(shift).is.equals(0);
    triggerEvent(div.querySelector('[ref="shift"]'), 'mousedown', (event) => (event.ctrlKey = true));
    expect(shift).is.equals(0);
    triggerEvent(div.querySelector('[ref="shift"]'), 'mousedown', (event) => (event.altKey = true));
    expect(shift).is.equals(0);
    triggerEvent(div.querySelector('[ref="shift"]'), 'mousedown', (event) => (event.shiftKey = true));
    expect(shift).is.equals(1);
    triggerEvent(div.querySelector('[ref="shift"]'), 'mousedown', (event) => (event.metaKey = true));
    expect(shift).is.equals(1);

    expect(meta).is.equals(0);
    triggerEvent(div.querySelector('[ref="meta"]'), 'mousedown', (event) => (event.ctrlKey = true));
    expect(meta).is.equals(0);
    triggerEvent(div.querySelector('[ref="meta"]'), 'mousedown', (event) => (event.altKey = true));
    expect(meta).is.equals(0);
    triggerEvent(div.querySelector('[ref="meta"]'), 'mousedown', (event) => (event.shiftKey = true));
    expect(meta).is.equals(0);
    triggerEvent(div.querySelector('[ref="meta"]'), 'mousedown', (event) => (event.metaKey = true));
    expect(meta).is.equals(1);
  });

  it('使用 @event 的方式对元素绑定事件监听, 使用 .exact 修饰符', () => {
    const data = {
      none: 0,
      exact: 0,
      'ctrl.exact': 0,
      'alt.exact': 0,
      'shift.exact': 0,
      'meta.exact': 0,
      'ctrl.alt.exact': 0,
      'ctrl.alt.shift.exact': 0,
      'ctrl.alt.shift.meta.exact': 0,
    };

    render(div)`
      <!-- 未使用 -->
      <div ref="none" @mousedown=${() => data.none++}>exact</div>
      <!-- 单独使用 -->
      <div ref="exact" @mousedown.exact=${() => data.exact++}>exact</div>
      <!-- 单个使用 -->
      <div ref="ctrl.exact" @mousedown.ctrl.exact=${() => data['ctrl.exact']++}>ctrl.exact</div>
      <div ref="alt.exact" @mousedown.alt.exact=${() => data['alt.exact']++}>alt.exact</div>
      <div ref="shift.exact" @mousedown.shift.exact=${() => data['shift.exact']++}>shift.exact</div>
      <div ref="meta.exact" @mousedown.meta.exact=${() => data['meta.exact']++}>meta.exact</div>
      <!-- 多个使用 -->
      <div ref="ctrl.alt.exact" @mousedown.ctrl.alt.exact=${() => data['ctrl.alt.exact']++}>ctrl.alt.exact</div>
      <div ref="ctrl.alt.shift.exact" @mousedown.ctrl.alt.shift.exact=${() => data['ctrl.alt.shift.exact']++}>ctrl.alt.shift.exact</div>
      <div ref="ctrl.alt.shift.meta.exact" @mousedown.ctrl.alt.shift.meta.exact=${() => data['ctrl.alt.shift.meta.exact']++}>ctrl.alt.shift.meta.exact</div>
    `;

    // 未使用 - 始终触发
    expect(data.none).is.equals(0);
    triggerEvent(div.querySelector('[ref="none"]'), 'mousedown');
    expect(data.none).is.equals(1);
    triggerEvent(div.querySelector('[ref="none"]'), 'mousedown', (event) => (event.ctrlKey = true));
    expect(data.none).is.equals(2);
    triggerEvent(div.querySelector('[ref="none"]'), 'mousedown', (event) => (event.altKey = true));
    expect(data.none).is.equals(3);
    triggerEvent(div.querySelector('[ref="none"]'), 'mousedown', (event) => (event.shiftKey = true));
    expect(data.none).is.equals(4);
    triggerEvent(div.querySelector('[ref="none"]'), 'mousedown', (event) => (event.metaKey = true));
    expect(data.none).is.equals(5);

    // 单独使用
    expect(data.exact).is.equals(0);
    triggerEvent(div.querySelector('[ref="exact"]'), 'mousedown');
    expect(data.exact).is.equals(1);
    triggerEvent(div.querySelector('[ref="exact"]'), 'mousedown', (event) => (event.ctrlKey = true));
    expect(data.exact).is.equals(1);
    triggerEvent(div.querySelector('[ref="exact"]'), 'mousedown', (event) => (event.altKey = true));
    expect(data.exact).is.equals(1);
    triggerEvent(div.querySelector('[ref="exact"]'), 'mousedown', (event) => (event.shiftKey = true));
    expect(data.exact).is.equals(1);
    triggerEvent(div.querySelector('[ref="exact"]'), 'mousedown', (event) => (event.metaKey = true));
    expect(data.exact).is.equals(1);

    // 单个使用 - ctrl
    expect(data['ctrl.exact']).is.equals(0);
    triggerEvent(div.querySelector('[ref="ctrl.exact"]'), 'mousedown');
    expect(data['ctrl.exact']).is.equals(0);
    triggerEvent(div.querySelector('[ref="ctrl.exact"]'), 'mousedown', (event) => (event.ctrlKey = true));
    expect(data['ctrl.exact']).is.equals(1);
    triggerEvent(div.querySelector('[ref="ctrl.exact"]'), 'mousedown', (event) => (event.altKey = true));
    expect(data['ctrl.exact']).is.equals(1);
    triggerEvent(div.querySelector('[ref="ctrl.exact"]'), 'mousedown', (event) => (event.shiftKey = true));
    expect(data['ctrl.exact']).is.equals(1);
    triggerEvent(div.querySelector('[ref="ctrl.exact"]'), 'mousedown', (event) => (event.metaKey = true));
    expect(data['ctrl.exact']).is.equals(1);

    // 单个使用 - alt
    expect(data['alt.exact']).is.equals(0);
    triggerEvent(div.querySelector('[ref="alt.exact"]'), 'mousedown');
    expect(data['alt.exact']).is.equals(0);
    triggerEvent(div.querySelector('[ref="alt.exact"]'), 'mousedown', (event) => (event.ctrlKey = true));
    expect(data['alt.exact']).is.equals(0);
    triggerEvent(div.querySelector('[ref="alt.exact"]'), 'mousedown', (event) => (event.altKey = true));
    expect(data['alt.exact']).is.equals(1);
    triggerEvent(div.querySelector('[ref="alt.exact"]'), 'mousedown', (event) => (event.shiftKey = true));
    expect(data['alt.exact']).is.equals(1);
    triggerEvent(div.querySelector('[ref="alt.exact"]'), 'mousedown', (event) => (event.metaKey = true));
    expect(data['alt.exact']).is.equals(1);

    // 单个使用 - shift
    expect(data['shift.exact']).is.equals(0);
    triggerEvent(div.querySelector('[ref="shift.exact"]'), 'mousedown');
    expect(data['shift.exact']).is.equals(0);
    triggerEvent(div.querySelector('[ref="shift.exact"]'), 'mousedown', (event) => (event.ctrlKey = true));
    expect(data['shift.exact']).is.equals(0);
    triggerEvent(div.querySelector('[ref="shift.exact"]'), 'mousedown', (event) => (event.altKey = true));
    expect(data['shift.exact']).is.equals(0);
    triggerEvent(div.querySelector('[ref="shift.exact"]'), 'mousedown', (event) => (event.shiftKey = true));
    expect(data['shift.exact']).is.equals(1);
    triggerEvent(div.querySelector('[ref="shift.exact"]'), 'mousedown', (event) => (event.metaKey = true));
    expect(data['shift.exact']).is.equals(1);

    // 单个使用 - meta
    expect(data['meta.exact']).is.equals(0);
    triggerEvent(div.querySelector('[ref="meta.exact"]'), 'mousedown');
    expect(data['meta.exact']).is.equals(0);
    triggerEvent(div.querySelector('[ref="meta.exact"]'), 'mousedown', (event) => (event.ctrlKey = true));
    expect(data['meta.exact']).is.equals(0);
    triggerEvent(div.querySelector('[ref="meta.exact"]'), 'mousedown', (event) => (event.altKey = true));
    expect(data['meta.exact']).is.equals(0);
    triggerEvent(div.querySelector('[ref="meta.exact"]'), 'mousedown', (event) => (event.shiftKey = true));
    expect(data['meta.exact']).is.equals(0);
    triggerEvent(div.querySelector('[ref="meta.exact"]'), 'mousedown', (event) => (event.metaKey = true));
    expect(data['meta.exact']).is.equals(1);

    // 多个使用 - ctrl.alt.exact
    expect(data['ctrl.alt.exact']).is.equals(0);
    triggerEvent(div.querySelector('[ref="ctrl.alt.exact"]'), 'mousedown');
    expect(data['ctrl.alt.exact']).is.equals(0);
    triggerEvent(div.querySelector('[ref="ctrl.alt.exact"]'), 'mousedown', (event) => (event.ctrlKey = true));
    expect(data['ctrl.alt.exact']).is.equals(0);
    triggerEvent(div.querySelector('[ref="ctrl.alt.exact"]'), 'mousedown', (event) => (event.altKey = true));
    expect(data['ctrl.alt.exact']).is.equals(0);
    triggerEvent(div.querySelector('[ref="ctrl.alt.exact"]'), 'mousedown', (event) => (event.shiftKey = true));
    expect(data['ctrl.alt.exact']).is.equals(0);
    triggerEvent(div.querySelector('[ref="ctrl.alt.exact"]'), 'mousedown', (event) => (event.metaKey = true));
    expect(data['ctrl.alt.exact']).is.equals(0);
    triggerEvent(div.querySelector('[ref="ctrl.alt.exact"]'), 'mousedown', (event) => {
      event.ctrlKey = true;
      event.altKey = true;
      event.shiftKey = false;
      event.metaKey = false;
    });
    expect(data['ctrl.alt.exact']).is.equals(1);
    triggerEvent(div.querySelector('[ref="ctrl.alt.exact"]'), 'mousedown', (event) => {
      event.ctrlKey = true;
      event.altKey = false;
      event.shiftKey = true;
      event.metaKey = false;
    });
    expect(data['ctrl.alt.exact']).is.equals(1);
    triggerEvent(div.querySelector('[ref="ctrl.alt.exact"]'), 'mousedown', (event) => {
      event.ctrlKey = true;
      event.altKey = false;
      event.shiftKey = false;
      event.metaKey = true;
    });
    expect(data['ctrl.alt.exact']).is.equals(1);
    triggerEvent(div.querySelector('[ref="ctrl.alt.exact"]'), 'mousedown', (event) => {
      event.ctrlKey = false;
      event.altKey = true;
      event.shiftKey = true;
      event.metaKey = false;
    });
    expect(data['ctrl.alt.exact']).is.equals(1);
    triggerEvent(div.querySelector('[ref="ctrl.alt.exact"]'), 'mousedown', (event) => {
      event.ctrlKey = false;
      event.altKey = true;
      event.shiftKey = false;
      event.metaKey = true;
    });
    expect(data['ctrl.alt.exact']).is.equals(1);
    triggerEvent(div.querySelector('[ref="ctrl.alt.exact"]'), 'mousedown', (event) => {
      event.ctrlKey = false;
      event.altKey = false;
      event.shiftKey = true;
      event.metaKey = true;
    });
    expect(data['ctrl.alt.exact']).is.equals(1);

    // 多个使用 - ctrl.alt.shift.exact
    expect(data['ctrl.alt.shift.exact']).is.equals(0);
    triggerEvent(div.querySelector('[ref="ctrl.alt.shift.exact"]'), 'mousedown');
    expect(data['ctrl.alt.shift.exact']).is.equals(0);
    triggerEvent(div.querySelector('[ref="ctrl.alt.shift.exact"]'), 'mousedown', (event) => (event.ctrlKey = true));
    expect(data['ctrl.alt.shift.exact']).is.equals(0);
    triggerEvent(div.querySelector('[ref="ctrl.alt.shift.exact"]'), 'mousedown', (event) => (event.altKey = true));
    expect(data['ctrl.alt.shift.exact']).is.equals(0);
    triggerEvent(div.querySelector('[ref="ctrl.alt.shift.exact"]'), 'mousedown', (event) => (event.shiftKey = true));
    expect(data['ctrl.alt.shift.exact']).is.equals(0);
    triggerEvent(div.querySelector('[ref="ctrl.alt.shift.exact"]'), 'mousedown', (event) => (event.metaKey = true));
    expect(data['ctrl.alt.shift.exact']).is.equals(0);
    triggerEvent(div.querySelector('[ref="ctrl.alt.shift.exact"]'), 'mousedown', (event) => {
      event.ctrlKey = true;
      event.altKey = true;
      event.shiftKey = false;
      event.metaKey = false;
    });
    expect(data['ctrl.alt.shift.exact']).is.equals(0);
    triggerEvent(div.querySelector('[ref="ctrl.alt.shift.exact"]'), 'mousedown', (event) => {
      event.ctrlKey = true;
      event.altKey = false;
      event.shiftKey = true;
      event.metaKey = false;
    });
    expect(data['ctrl.alt.shift.exact']).is.equals(0);
    triggerEvent(div.querySelector('[ref="ctrl.alt.shift.exact"]'), 'mousedown', (event) => {
      event.ctrlKey = true;
      event.altKey = false;
      event.shiftKey = false;
      event.metaKey = true;
    });
    expect(data['ctrl.alt.shift.exact']).is.equals(0);
    triggerEvent(div.querySelector('[ref="ctrl.alt.shift.exact"]'), 'mousedown', (event) => {
      event.ctrlKey = false;
      event.altKey = true;
      event.shiftKey = true;
      event.metaKey = false;
    });
    expect(data['ctrl.alt.shift.exact']).is.equals(0);
    triggerEvent(div.querySelector('[ref="ctrl.alt.shift.exact"]'), 'mousedown', (event) => {
      event.ctrlKey = false;
      event.altKey = true;
      event.shiftKey = false;
      event.metaKey = true;
    });
    expect(data['ctrl.alt.shift.exact']).is.equals(0);
    triggerEvent(div.querySelector('[ref="ctrl.alt.shift.exact"]'), 'mousedown', (event) => {
      event.ctrlKey = false;
      event.altKey = false;
      event.shiftKey = true;
      event.metaKey = true;
    });
    expect(data['ctrl.alt.shift.exact']).is.equals(0);
    triggerEvent(div.querySelector('[ref="ctrl.alt.shift.exact"]'), 'mousedown', (event) => {
      event.ctrlKey = true;
      event.altKey = true;
      event.shiftKey = true;
      event.metaKey = false;
    });
    expect(data['ctrl.alt.shift.exact']).is.equals(1);
    triggerEvent(div.querySelector('[ref="ctrl.alt.shift.exact"]'), 'mousedown', (event) => {
      event.ctrlKey = true;
      event.altKey = true;
      event.shiftKey = false;
      event.metaKey = true;
    });
    expect(data['ctrl.alt.shift.exact']).is.equals(1);
    triggerEvent(div.querySelector('[ref="ctrl.alt.shift.exact"]'), 'mousedown', (event) => {
      event.ctrlKey = true;
      event.altKey = false;
      event.shiftKey = true;
      event.metaKey = true;
    });
    expect(data['ctrl.alt.shift.exact']).is.equals(1);

    // 多个使用 - ctrl.alt.shift.meta.exact
    expect(data['ctrl.alt.shift.meta.exact']).is.equals(0);
    triggerEvent(div.querySelector('[ref="ctrl.alt.shift.meta.exact"]'), 'mousedown');
    expect(data['ctrl.alt.shift.meta.exact']).is.equals(0);
    triggerEvent(div.querySelector('[ref="ctrl.alt.shift.meta.exact"]'), 'mousedown', (event) => (event.ctrlKey = true));
    expect(data['ctrl.alt.shift.meta.exact']).is.equals(0);
    triggerEvent(div.querySelector('[ref="ctrl.alt.shift.meta.exact"]'), 'mousedown', (event) => (event.altKey = true));
    expect(data['ctrl.alt.shift.meta.exact']).is.equals(0);
    triggerEvent(div.querySelector('[ref="ctrl.alt.shift.meta.exact"]'), 'mousedown', (event) => (event.shiftKey = true));
    expect(data['ctrl.alt.shift.meta.exact']).is.equals(0);
    triggerEvent(div.querySelector('[ref="ctrl.alt.shift.meta.exact"]'), 'mousedown', (event) => (event.metaKey = true));
    expect(data['ctrl.alt.shift.meta.exact']).is.equals(0);
    triggerEvent(div.querySelector('[ref="ctrl.alt.shift.meta.exact"]'), 'mousedown', (event) => {
      event.ctrlKey = true;
      event.altKey = true;
      event.shiftKey = false;
      event.metaKey = false;
    });
    expect(data['ctrl.alt.shift.meta.exact']).is.equals(0);
    triggerEvent(div.querySelector('[ref="ctrl.alt.shift.meta.exact"]'), 'mousedown', (event) => {
      event.ctrlKey = true;
      event.altKey = false;
      event.shiftKey = true;
      event.metaKey = false;
    });
    expect(data['ctrl.alt.shift.meta.exact']).is.equals(0);
    triggerEvent(div.querySelector('[ref="ctrl.alt.shift.meta.exact"]'), 'mousedown', (event) => {
      event.ctrlKey = true;
      event.altKey = false;
      event.shiftKey = false;
      event.metaKey = true;
    });
    expect(data['ctrl.alt.shift.meta.exact']).is.equals(0);
    triggerEvent(div.querySelector('[ref="ctrl.alt.shift.meta.exact"]'), 'mousedown', (event) => {
      event.ctrlKey = false;
      event.altKey = true;
      event.shiftKey = true;
      event.metaKey = false;
    });
    expect(data['ctrl.alt.shift.meta.exact']).is.equals(0);
    triggerEvent(div.querySelector('[ref="ctrl.alt.shift.meta.exact"]'), 'mousedown', (event) => {
      event.ctrlKey = false;
      event.altKey = true;
      event.shiftKey = false;
      event.metaKey = true;
    });
    expect(data['ctrl.alt.shift.meta.exact']).is.equals(0);
    triggerEvent(div.querySelector('[ref="ctrl.alt.shift.meta.exact"]'), 'mousedown', (event) => {
      event.ctrlKey = false;
      event.altKey = false;
      event.shiftKey = true;
      event.metaKey = true;
    });
    expect(data['ctrl.alt.shift.meta.exact']).is.equals(0);
    triggerEvent(div.querySelector('[ref="ctrl.alt.shift.meta.exact"]'), 'mousedown', (event) => {
      event.ctrlKey = true;
      event.altKey = true;
      event.shiftKey = true;
      event.metaKey = false;
    });
    expect(data['ctrl.alt.shift.meta.exact']).is.equals(0);
    triggerEvent(div.querySelector('[ref="ctrl.alt.shift.meta.exact"]'), 'mousedown', (event) => {
      event.ctrlKey = true;
      event.altKey = true;
      event.shiftKey = false;
      event.metaKey = true;
    });
    expect(data['ctrl.alt.shift.meta.exact']).is.equals(0);
    triggerEvent(div.querySelector('[ref="ctrl.alt.shift.meta.exact"]'), 'mousedown', (event) => {
      event.ctrlKey = true;
      event.altKey = false;
      event.shiftKey = true;
      event.metaKey = true;
    });
    expect(data['ctrl.alt.shift.meta.exact']).is.equals(0);
    triggerEvent(div.querySelector('[ref="ctrl.alt.shift.meta.exact"]'), 'mousedown', (event) => {
      event.ctrlKey = true;
      event.altKey = true;
      event.shiftKey = true;
      event.metaKey = true;
    });
    expect(data['ctrl.alt.shift.meta.exact']).is.equals(1);
  });

  it('使用 @event 的方式对元素绑定事件监听, 使用 .esc / .tab / .enter / .space / .up / .left / .right / .down / .delete', () => {
    const data = {
      esc: 0,
      tab: 0,
      enter: 0,
      space: 0,
      up: 0,
      left: 0,
      right: 0,
      down: 0,
      delete: 0
    };

    render(div)`
      <div ref="esc" @keydown.esc=${() => data.esc++}>esc</div>
      <div ref="tab" @keydown.tab=${() => data.tab++}>tab</div>
      <div ref="enter" @keydown.enter=${() => data.enter++}>enter</div>
      <div ref="space" @keydown.space=${() => data.space++}>space</div>
      <div ref="up" @keydown.up=${() => data.up++}>up</div>
      <div ref="left" @keydown.left=${() => data.left++}>left</div>
      <div ref="right" @keydown.right=${() => data.right++}>right</div>
      <div ref="down" @keydown.down=${() => data.down++}>down</div>
      <div ref="delete" @keydown.delete=${() => data.delete++}>delete</div>
    `;

    // esc
    expect(data.esc).is.equals(0);
    triggerEvent(div.querySelector('[ref="esc"]'), 'keydown', (event) => (event.key = 'Escape'));
    expect(data.esc).is.equals(1);
    triggerEvent(div.querySelector('[ref="esc"]'), 'keydown', (event) => (event.key = 'Tab'));
    expect(data.esc).is.equals(1);
    triggerEvent(div.querySelector('[ref="esc"]'), 'keydown', (event) => (event.key = 'Enter'));
    expect(data.esc).is.equals(1);
    triggerEvent(div.querySelector('[ref="esc"]'), 'keydown', (event) => (event.key = ' '));
    expect(data.esc).is.equals(1);
    triggerEvent(div.querySelector('[ref="esc"]'), 'keydown', (event) => (event.key = 'Up'));
    expect(data.esc).is.equals(1);
    triggerEvent(div.querySelector('[ref="esc"]'), 'keydown', (event) => (event.key = 'Left'));
    expect(data.esc).is.equals(1);
    triggerEvent(div.querySelector('[ref="esc"]'), 'keydown', (event) => (event.key = 'Right'));
    expect(data.esc).is.equals(1);
    triggerEvent(div.querySelector('[ref="esc"]'), 'keydown', (event) => (event.key = 'Down'));
    expect(data.esc).is.equals(1);
    triggerEvent(div.querySelector('[ref="esc"]'), 'keydown', (event) => (event.key = 'Backspace'));
    expect(data.esc).is.equals(1);
    triggerEvent(div.querySelector('[ref="esc"]'), 'keydown', (event) => (event.key = 'Delete'));
    expect(data.esc).is.equals(1);

    // tab
    expect(data.tab).is.equals(0);
    triggerEvent(div.querySelector('[ref="tab"]'), 'keydown', (event) => (event.key = 'Escape'));
    expect(data.tab).is.equals(0);
    triggerEvent(div.querySelector('[ref="tab"]'), 'keydown', (event) => (event.key = 'Tab'));
    expect(data.tab).is.equals(1);
    triggerEvent(div.querySelector('[ref="tab"]'), 'keydown', (event) => (event.key = 'Enter'));
    expect(data.tab).is.equals(1);
    triggerEvent(div.querySelector('[ref="tab"]'), 'keydown', (event) => (event.key = ' '));
    expect(data.tab).is.equals(1);
    triggerEvent(div.querySelector('[ref="tab"]'), 'keydown', (event) => (event.key = 'Up'));
    expect(data.tab).is.equals(1);
    triggerEvent(div.querySelector('[ref="tab"]'), 'keydown', (event) => (event.key = 'Left'));
    expect(data.tab).is.equals(1);
    triggerEvent(div.querySelector('[ref="tab"]'), 'keydown', (event) => (event.key = 'Right'));
    expect(data.tab).is.equals(1);
    triggerEvent(div.querySelector('[ref="tab"]'), 'keydown', (event) => (event.key = 'Down'));
    expect(data.tab).is.equals(1);
    triggerEvent(div.querySelector('[ref="tab"]'), 'keydown', (event) => (event.key = 'Backspace'));
    expect(data.tab).is.equals(1);
    triggerEvent(div.querySelector('[ref="tab"]'), 'keydown', (event) => (event.key = 'Delete'));
    expect(data.tab).is.equals(1);

    // enter
    expect(data.enter).is.equals(0);
    triggerEvent(div.querySelector('[ref="enter"]'), 'keydown', (event) => (event.key = 'Escape'));
    expect(data.enter).is.equals(0);
    triggerEvent(div.querySelector('[ref="enter"]'), 'keydown', (event) => (event.key = 'Tab'));
    expect(data.enter).is.equals(0);
    triggerEvent(div.querySelector('[ref="enter"]'), 'keydown', (event) => (event.key = 'Enter'));
    expect(data.enter).is.equals(1);
    triggerEvent(div.querySelector('[ref="enter"]'), 'keydown', (event) => (event.key = ' '));
    expect(data.enter).is.equals(1);
    triggerEvent(div.querySelector('[ref="enter"]'), 'keydown', (event) => (event.key = 'Up'));
    expect(data.enter).is.equals(1);
    triggerEvent(div.querySelector('[ref="enter"]'), 'keydown', (event) => (event.key = 'Left'));
    expect(data.enter).is.equals(1);
    triggerEvent(div.querySelector('[ref="enter"]'), 'keydown', (event) => (event.key = 'Right'));
    expect(data.enter).is.equals(1);
    triggerEvent(div.querySelector('[ref="enter"]'), 'keydown', (event) => (event.key = 'Down'));
    expect(data.enter).is.equals(1);
    triggerEvent(div.querySelector('[ref="enter"]'), 'keydown', (event) => (event.key = 'Backspace'));
    expect(data.enter).is.equals(1);
    triggerEvent(div.querySelector('[ref="enter"]'), 'keydown', (event) => (event.key = 'Delete'));
    expect(data.enter).is.equals(1);

    // space
    expect(data.space).is.equals(0);
    triggerEvent(div.querySelector('[ref="space"]'), 'keydown', (event) => (event.key = 'Escape'));
    expect(data.space).is.equals(0);
    triggerEvent(div.querySelector('[ref="space"]'), 'keydown', (event) => (event.key = 'Tab'));
    expect(data.space).is.equals(0);
    triggerEvent(div.querySelector('[ref="space"]'), 'keydown', (event) => (event.key = 'Enter'));
    expect(data.space).is.equals(0);
    triggerEvent(div.querySelector('[ref="space"]'), 'keydown', (event) => (event.key = ' '));
    expect(data.space).is.equals(1);
    triggerEvent(div.querySelector('[ref="space"]'), 'keydown', (event) => (event.key = 'Up'));
    expect(data.space).is.equals(1);
    triggerEvent(div.querySelector('[ref="space"]'), 'keydown', (event) => (event.key = 'Left'));
    expect(data.space).is.equals(1);
    triggerEvent(div.querySelector('[ref="space"]'), 'keydown', (event) => (event.key = 'Right'));
    expect(data.space).is.equals(1);
    triggerEvent(div.querySelector('[ref="space"]'), 'keydown', (event) => (event.key = 'Down'));
    expect(data.space).is.equals(1);
    triggerEvent(div.querySelector('[ref="space"]'), 'keydown', (event) => (event.key = 'Backspace'));
    expect(data.space).is.equals(1);
    triggerEvent(div.querySelector('[ref="space"]'), 'keydown', (event) => (event.key = 'Delete'));
    expect(data.space).is.equals(1);

    // up
    expect(data.up).is.equals(0);
    triggerEvent(div.querySelector('[ref="up"]'), 'keydown', (event) => (event.key = 'Escape'));
    expect(data.up).is.equals(0);
    triggerEvent(div.querySelector('[ref="up"]'), 'keydown', (event) => (event.key = 'Tab'));
    expect(data.up).is.equals(0);
    triggerEvent(div.querySelector('[ref="up"]'), 'keydown', (event) => (event.key = 'Enter'));
    expect(data.up).is.equals(0);
    triggerEvent(div.querySelector('[ref="up"]'), 'keydown', (event) => (event.key = ' '));
    expect(data.up).is.equals(0);
    triggerEvent(div.querySelector('[ref="up"]'), 'keydown', (event) => (event.key = 'Up'));
    expect(data.up).is.equals(1);
    triggerEvent(div.querySelector('[ref="up"]'), 'keydown', (event) => (event.key = 'Left'));
    expect(data.up).is.equals(1);
    triggerEvent(div.querySelector('[ref="up"]'), 'keydown', (event) => (event.key = 'Right'));
    expect(data.up).is.equals(1);
    triggerEvent(div.querySelector('[ref="up"]'), 'keydown', (event) => (event.key = 'Down'));
    expect(data.up).is.equals(1);
    triggerEvent(div.querySelector('[ref="up"]'), 'keydown', (event) => (event.key = 'Backspace'));
    expect(data.up).is.equals(1);
    triggerEvent(div.querySelector('[ref="up"]'), 'keydown', (event) => (event.key = 'Delete'));
    expect(data.up).is.equals(1);

    // left
    expect(data.left).is.equals(0);
    triggerEvent(div.querySelector('[ref="left"]'), 'keydown', (event) => (event.key = 'Escape'));
    expect(data.left).is.equals(0);
    triggerEvent(div.querySelector('[ref="left"]'), 'keydown', (event) => (event.key = 'Tab'));
    expect(data.left).is.equals(0);
    triggerEvent(div.querySelector('[ref="left"]'), 'keydown', (event) => (event.key = 'Enter'));
    expect(data.left).is.equals(0);
    triggerEvent(div.querySelector('[ref="left"]'), 'keydown', (event) => (event.key = ' '));
    expect(data.left).is.equals(0);
    triggerEvent(div.querySelector('[ref="left"]'), 'keydown', (event) => (event.key = 'Up'));
    expect(data.left).is.equals(0);
    triggerEvent(div.querySelector('[ref="left"]'), 'keydown', (event) => (event.key = 'Left'));
    expect(data.left).is.equals(1);
    triggerEvent(div.querySelector('[ref="left"]'), 'keydown', (event) => (event.key = 'Right'));
    expect(data.left).is.equals(1);
    triggerEvent(div.querySelector('[ref="left"]'), 'keydown', (event) => (event.key = 'Down'));
    expect(data.left).is.equals(1);
    triggerEvent(div.querySelector('[ref="left"]'), 'keydown', (event) => (event.key = 'Backspace'));
    expect(data.left).is.equals(1);
    triggerEvent(div.querySelector('[ref="left"]'), 'keydown', (event) => (event.key = 'Delete'));
    expect(data.left).is.equals(1);

    // right
    expect(data.right).is.equals(0);
    triggerEvent(div.querySelector('[ref="right"]'), 'keydown', (event) => (event.key = 'Escape'));
    expect(data.right).is.equals(0);
    triggerEvent(div.querySelector('[ref="right"]'), 'keydown', (event) => (event.key = 'Tab'));
    expect(data.right).is.equals(0);
    triggerEvent(div.querySelector('[ref="right"]'), 'keydown', (event) => (event.key = 'Enter'));
    expect(data.right).is.equals(0);
    triggerEvent(div.querySelector('[ref="right"]'), 'keydown', (event) => (event.key = ' '));
    expect(data.right).is.equals(0);
    triggerEvent(div.querySelector('[ref="right"]'), 'keydown', (event) => (event.key = 'Up'));
    expect(data.right).is.equals(0);
    triggerEvent(div.querySelector('[ref="right"]'), 'keydown', (event) => (event.key = 'Left'));
    expect(data.right).is.equals(0);
    triggerEvent(div.querySelector('[ref="right"]'), 'keydown', (event) => (event.key = 'Right'));
    expect(data.right).is.equals(1);
    triggerEvent(div.querySelector('[ref="right"]'), 'keydown', (event) => (event.key = 'Down'));
    expect(data.right).is.equals(1);
    triggerEvent(div.querySelector('[ref="right"]'), 'keydown', (event) => (event.key = 'Backspace'));
    expect(data.right).is.equals(1);
    triggerEvent(div.querySelector('[ref="right"]'), 'keydown', (event) => (event.key = 'Delete'));
    expect(data.right).is.equals(1);

    // down
    expect(data.down).is.equals(0);
    triggerEvent(div.querySelector('[ref="down"]'), 'keydown', (event) => (event.key = 'Escape'));
    expect(data.down).is.equals(0);
    triggerEvent(div.querySelector('[ref="down"]'), 'keydown', (event) => (event.key = 'Tab'));
    expect(data.down).is.equals(0);
    triggerEvent(div.querySelector('[ref="down"]'), 'keydown', (event) => (event.key = 'Enter'));
    expect(data.down).is.equals(0);
    triggerEvent(div.querySelector('[ref="down"]'), 'keydown', (event) => (event.key = ' '));
    expect(data.down).is.equals(0);
    triggerEvent(div.querySelector('[ref="down"]'), 'keydown', (event) => (event.key = 'Up'));
    expect(data.down).is.equals(0);
    triggerEvent(div.querySelector('[ref="down"]'), 'keydown', (event) => (event.key = 'Left'));
    expect(data.down).is.equals(0);
    triggerEvent(div.querySelector('[ref="down"]'), 'keydown', (event) => (event.key = 'Right'));
    expect(data.down).is.equals(0);
    triggerEvent(div.querySelector('[ref="down"]'), 'keydown', (event) => (event.key = 'Down'));
    expect(data.down).is.equals(1);
    triggerEvent(div.querySelector('[ref="down"]'), 'keydown', (event) => (event.key = 'Backspace'));
    expect(data.down).is.equals(1);
    triggerEvent(div.querySelector('[ref="down"]'), 'keydown', (event) => (event.key = 'Delete'));
    expect(data.down).is.equals(1);

    // delete - Backspace
    expect(data.delete).is.equals(0);
    triggerEvent(div.querySelector('[ref="delete"]'), 'keydown', (event) => (event.key = 'Escape'));
    expect(data.delete).is.equals(0);
    triggerEvent(div.querySelector('[ref="delete"]'), 'keydown', (event) => (event.key = 'Tab'));
    expect(data.delete).is.equals(0);
    triggerEvent(div.querySelector('[ref="delete"]'), 'keydown', (event) => (event.key = 'Enter'));
    expect(data.delete).is.equals(0);
    triggerEvent(div.querySelector('[ref="delete"]'), 'keydown', (event) => (event.key = ' '));
    expect(data.delete).is.equals(0);
    triggerEvent(div.querySelector('[ref="delete"]'), 'keydown', (event) => (event.key = 'Up'));
    expect(data.delete).is.equals(0);
    triggerEvent(div.querySelector('[ref="delete"]'), 'keydown', (event) => (event.key = 'Left'));
    expect(data.delete).is.equals(0);
    triggerEvent(div.querySelector('[ref="delete"]'), 'keydown', (event) => (event.key = 'Right'));
    expect(data.delete).is.equals(0);
    triggerEvent(div.querySelector('[ref="delete"]'), 'keydown', (event) => (event.key = 'Down'));
    expect(data.delete).is.equals(0);
    triggerEvent(div.querySelector('[ref="delete"]'), 'keydown', (event) => (event.key = 'Backspace'));
    expect(data.delete).is.equals(1);
    triggerEvent(div.querySelector('[ref="delete"]'), 'keydown', (event) => (event.key = 'Delete'));
    expect(data.delete).is.equals(2);
  });
});
