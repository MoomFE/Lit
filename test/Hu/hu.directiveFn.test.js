describe( 'Hu.directiveFn', () => {

  let div = document.createElement('div');
  beforeEach(() => {
    div.$remove();
    div = document.createElement('div');
  });


  it( '注册的指令方法可以被正确调用 ( 在 render 方法中使用 )', () => {
    let result;
    const fn = Hu.directiveFn(( value ) => part => {
      result = value;
    });

    Hu.render(
      fn( 123 ),
      div
    );
    expect( result ).is.equals( 123 );
  });

  it( '注册的指令方法可以被正确调用 ( 在指令中使用 )', () => {
    let result;
    const fn = Hu.directiveFn(( value ) => part => {
      result = value;
    });

    Hu.render( div )`
      <div :text=${ fn( 123 ) }></div>
    `;
    expect( result ).is.equals( 123 );
  });

  it( '注册的指令方法可以被正确调用 ( 在 NodePart 中使用 )', () => {
    let result;
    const fn = Hu.directiveFn(( value ) => part => {
      result = value;
    });

    Hu.render( div )`
      <div>${ fn( 123 ) }</div>
    `;
    expect( result ).is.equals( 123 );
  });

  it( '注册的指令方法可以被正确调用 ( 在 NodePart 数组方式中使用 )', () => {
    let result;
    const fn = Hu.directiveFn(( value ) => part => {
      result = value;
    });

    Hu.render( div )`
      <div>${[ fn( 123 ) ]}</div>
    `;
    expect( result ).is.equals( 123 );
  });

  it( '注册的指令方法可以被正确调用 ( 在 repeat 指令方法中使用 )', () => {
    let result;
    const fn = Hu.directiveFn(( value ) => part => {
      result = value;
    });

    Hu.render( div )`
      <div>${
        Hu.html.repeat( [ 123 ], val => val, val => {
          return fn( val );
        })
      }</div>
    `;
    expect( result ).is.equals( 123 );
  });

  it( '注册的指令方法在被弃用时会触发对应 destroy 方法 ( 在 render 方法中使用 )', () => {
    let commitPart;
    let destroyPart;
    const fn = Hu.directiveFn(( value ) => [
      part => commitPart = part,
      part => destroyPart = part
    ]);

    Hu.render(
      fn( 123 ),
      div
    );
    expect( commitPart ).is.not.undefined;
    expect( destroyPart ).is.undefined;

    Hu.render( '123', div );
    expect( commitPart ).is.not.undefined;
    expect( destroyPart ).is.not.undefined;
    expect( commitPart ).is.equals( destroyPart );
  });

  it( '注册的指令方法在被弃用时会触发对应 destroy 方法 ( 在指令中使用 )', () => {
    let commitPart;
    let destroyPart;
    const fn = Hu.directiveFn(( value ) => [
      part => commitPart = part,
      part => destroyPart = part
    ]);

    Hu.render( div )`
      <div :text=${ fn( 123 ) }></div>
    `;
    expect( commitPart ).is.not.undefined;
    expect( destroyPart ).is.undefined;

    Hu.render( div )`
      <div></div>
    `;
    expect( commitPart ).is.not.undefined;
    expect( destroyPart ).is.not.undefined;
    expect( commitPart ).is.equals( destroyPart );
  });

  it( '注册的指令方法在被弃用时会触发对应 destroy 方法 ( 在 NodePart 中使用 )', () => {
    let commitPart;
    let destroyPart;
    const fn = Hu.directiveFn(( value ) => [
      part => commitPart = part,
      part => destroyPart = part
    ]);

    Hu.render( div )`
      <div>${ fn( 123 ) }</div>
    `;
    expect( commitPart ).is.not.undefined;
    expect( destroyPart ).is.undefined;

    Hu.render( div )`
      <div></div>
    `;
    expect( commitPart ).is.not.undefined;
    expect( destroyPart ).is.not.undefined;
    expect( commitPart ).is.equals( destroyPart );
  });

  it( '注册的指令方法在被弃用时会触发对应 destroy 方法 ( 在 NodePart 数组方式中使用 )', () => {
    let commitPart;
    let destroyPart;
    const fn = Hu.directiveFn(( value ) => [
      part => commitPart = part,
      part => destroyPart = part
    ]);

    Hu.render( div )`
      <div>${[ fn( 123 ) ]}</div>
    `;
    expect( commitPart ).is.not.undefined;
    expect( destroyPart ).is.undefined;

    Hu.render( div )`
      <div></div>
    `;
    expect( commitPart ).is.not.undefined;
    expect( destroyPart ).is.not.undefined;
    expect( commitPart ).is.equals( destroyPart );
  });

  it( '注册的指令方法在被弃用时会触发对应 destroy 方法 ( 在 repeat 指令方法中使用 )', () => {
    let commitPart;
    let destroyPart;
    const fn = Hu.directiveFn(( value ) => [
      part => commitPart = part,
      part => destroyPart = part
    ]);

    Hu.render( div )`
      <div>${
        Hu.html.repeat( [ 123 ], val => val, val => {
          return fn( val );
        })
      }</div>
    `;
    expect( commitPart ).is.not.undefined;
    expect( destroyPart ).is.undefined;

    Hu.render( div )`
      <div></div>
    `;
    expect( commitPart ).is.not.undefined;
    expect( destroyPart ).is.not.undefined;
    expect( commitPart ).is.equals( destroyPart );
  });

  // 以下情况需要确认
  // 1. 先传入指令方法, 再传入其它值
  // 2. 先传入其它值, 再传入指令方法
  // 3. 两次传入的不是同一个指令方法

});