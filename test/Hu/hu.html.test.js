describe( 'Hu.html', () => {

  let div = document.createElement('div');
  beforeEach(() => {
    div.$remove();
    div = document.createElement('div');
  });

  let marker;
  !function(){
    const templateResult = Hu.html`<!--${ null }-->`;
    const template = templateResult.getTemplateElement();
    marker = template.content.firstChild.data.trim();
  }();





  it( '同时渲染文本节点及注释节点', () => {
    Hu.render( div )`
      <!--${ 1 }-->2<!--${ 3 }-->
    `;
    expect( div.textContent ).is.equals(`
      2
    `);

    Hu.render( div )`
      1<!--${ 2 }-->3<!--${ 4 }-->5
    `;
    expect( div.textContent ).is.equals(`
      135
    `);
  });

  it( '同时渲染文本节点及元素节点', () => {
    Hu.render( div )`
      ${ 1 }2${ 3 }<div>${ 4 }5${ 6 }</div>${ 7 }8${ 9 }
    `;

    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      123<div>456</div>789
    `);

    Hu.render( div )`
      1${ 2 }3<div>4${ 5 }6</div>7${ 8 }9
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      123<div>456</div>789
    `);
  });

  it( '同时渲染元素节点及注释节点', () => {
    Hu.render( div )`
      <!-- comment -->
      <div>div</div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <!-- comment -->
      <div>div</div>
    `);

    Hu.render( div )`
      <!-- comment -->
      <div class=${ 'div' }>${ 'div' }</div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <!-- comment -->
      <div class="div">div</div>
    `);
    
    Hu.render( div )`
      <!-- <div class=${ 'div' }>${ 'div' }</div> -->
      <div class=${ 'div' }>${ 'div' }</div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <!-- <div class$hu$=${ marker }>${ marker }</div> -->
      <div class="div">div</div>
    `);
  });

  it( '同时渲染文本节点及元素节点及注释节点', () => {
    Hu.render( div )`
      <div>A<!-- ${ 'B' } ${ 'C' } -->D</div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div>A<!-- ${ marker } ${ marker } -->D</div>
    `);

    Hu.render( div )`
      <div>A<!-- ${ 'B' } <div>${ 'C' }</div> ${ 'D' } -->E</div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div>A<!-- ${ marker } <div>${ marker }</div> ${ marker } -->E</div>
    `);

    Hu.render( div )`
      <div>A<!--${ 'B' }<div>${ 'C' }</div>${ 'D' }-->E</div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div>A<!--${ marker }<div>${ marker }</div>${ marker }-->E</div>
    `);

    Hu.render( div )`
      <div>A<!--${ 'B' }<div>${ 'C' }</div>${ 'D' }-->E</div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div>A<!--${ marker }<div>${ marker }</div>${ marker }-->E</div>
    `);

    Hu.render( div )`
      A${ 123 }B${ 456 }C${ 789 }D
      <!--class=${ 123 }${ 789 }${ 10 }-->
      <!--${ 123 } ${ 456 }-->
    `;

    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      A123B456C789D
      <!--class$hu$=${ marker }${ marker }${ marker }-->
      <!--${ marker } ${ marker }-->
    `);
  });

  it( '渲染 template 元素节点内的内容', () => {
    Hu.render( div )`
      <div>'123'</div>
      <template>
        <div>${ 123 }-${ 456 }-${ 789 }</div>
      </template>
      <div>'123'</div>
    `;

    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div>'123'</div>
      <template>
        <div>123-456-789</div>
      </template>
      <div>'123'</div>
    `);
  });

  it( '在插值绑定中使用 null 或 undefined 将会转为空字符串', () => {
    Hu.render( div )`${ null }`
    expect( div.innerHTML ).is.equals(`<!----><!----><!----><!---->`);

    Hu.render( div )`${ undefined }`
    expect( div.innerHTML ).is.equals(`<!----><!----><!----><!---->`);

    Hu.render( div )`
      <div class=${ null }></div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div class=""></div>
    `);

    Hu.render( div )`
      <div class=${ undefined }></div>
    `;
    expect( stripExpressionMarkers( div.innerHTML ) ).is.equals(`
      <div class=""></div>
    `);
  });

  it( '在插值绑定中使用 JSON 将会使用 JSON.stringify 进行格式化输出', () => {
    Hu.render( div )`${
      {}
    }`
    expect( div.innerHTML ).is.equals(`<!----><!---->{}<!----><!---->`);

    Hu.render( div )`${
      { asd: 123 }
    }`
    expect( div.innerHTML ).is.equals(`<!----><!---->{\n  "asd": 123\n}<!----><!---->`);

    Hu.render( div )`${
      { asd: [ 123 ] }
    }`
    expect( div.innerHTML ).is.equals(`<!----><!---->{\n  "asd": [\n    123\n  ]\n}<!----><!---->`);
  });

});