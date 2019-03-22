describe( 'Hu.define - watch', () => {

  it( '使用 $watch 对一个函数的返回值进行监听, 函数的 this 指向的均是当前实例', () => {
    const steps = [];
    const hu = new Hu({});

    hu.$watch(
      function(){
        steps.push('watch');
        expect( this ).is.equals( hu );
      },
      function(){
        steps.push('callback');
        expect( this ).is.equals( hu );
      },
      {
        immediate: true
      }
    );

    expect( steps ).is.deep.equals([ 'watch', 'callback' ]);
  });

  it( '使用 $watch 对一个函数的返回值进行监听, 函数的 this 指向的均是当前实例 ( Vue )', () => {
    const steps = [];
    const vm = new Vue({});

    vm.$watch(
      function(){
        steps.push('watch');
        expect( this ).is.equals( vm );
      },
      function(){
        steps.push('callback');
        expect( this ).is.equals( vm );
      },
      {
        immediate: true
      }
    );

    expect( steps ).is.deep.equals([ 'watch', 'callback' ]);
  });

  it( '使用 $watch 对一个函数的返回值进行监听, 类似于监听一个计算属性', ( done ) => {
    let result;
    const hu = new Hu({
      data: () => ({
        a: 1,
        b: 2
      })
    });

    hu.$watch(
      function(){
        return this.a + this.b;
      },
      ( value, oldValue ) => result = [ value, oldValue ]
    );

    expect( result ).is.undefined;

    hu.a = 2;

    expect( result ).is.undefined;

    hu.b = 998;

    expect( result ).is.undefined;

    hu.$nextTick(() => {
      expect( result ).is.deep.equals([ 1000, 3 ]);
      done();
    });
  });

  it( '使用 $watch 对一个函数的返回值进行监听, 类似于监听一个计算属性 ( Vue )', ( done ) => {
    let result;
    const vm = new Vue({
      data: () => ({
        a: 1,
        b: 2
      })
    });

    vm.$watch(
      function(){
        return this.a + this.b;
      },
      ( value, oldValue ) => result = [ value, oldValue ]
    );

    expect( result ).is.undefined;

    vm.a = 2;

    expect( result ).is.undefined;

    vm.b = 998;

    expect( result ).is.undefined;

    vm.$nextTick(() => {
      expect( result ).is.deep.equals([ 1000, 3 ]);
      done();
    });
  });

  it( '使用 $watch 对变量进行监听', ( done ) => {
    let result;
    const hu = new Hu({
      data: () => ({
        a: 1
      })
    });

    hu.$watch( 'a', ( value, oldValue ) => {
      result = [ value, oldValue ];
    });

    expect( result ).is.undefined;

    hu.a = 2;
    expect( result ).is.undefined;
    hu.$nextTick(() => {
      expect( result ).is.deep.equals([ 2, 1 ]);

      hu.a = 4;
      expect( result ).is.deep.equals([ 2, 1 ]);
      hu.$nextTick(() => {
        expect( result ).is.deep.equals([ 4, 2 ]);
        done();
      });
    });
  });

  it( '使用 $watch 对变量进行监听 ( Vue )', ( done ) => {
    let result;
    const vm = new Vue({
      data: () => ({
        a: 1
      })
    });

    vm.$watch( 'a', ( value, oldValue ) => {
      result = [ value, oldValue ];
    });

    expect( result ).is.undefined;

    vm.a = 2;
    expect( result ).is.undefined;
    vm.$nextTick(() => {
      expect( result ).is.deep.equals([ 2, 1 ]);

      vm.a = 4;
      expect( result ).is.deep.equals([ 2, 1 ]);
      vm.$nextTick(() => {
        expect( result ).is.deep.equals([ 4, 2 ]);
        done();
      });
    });
  });

  it( '使用 $watch 对变量的内容进行深度监听', ( done ) => {
    let result;
    const hu = new Hu({
      data: () => ({
        a: {
          b: 1,
          c: 2
        }
      })
    });

    hu.$watch( 'a.b', ( value, oldValue ) => {
      result = [ value, oldValue ];
    });

    expect( result ).is.undefined;

    hu.a.b = 2;
    expect( result ).is.undefined;
    hu.$nextTick(() => {
      expect( result ).is.deep.equals([ 2, 1 ]);

      hu.a = { b: 2 };
      expect( result ).is.deep.equals([ 2, 1 ]);
      hu.$nextTick(() => {
        expect( result ).is.deep.equals([ 2, 1 ]);
        done();
      });
    });
  });

  it( '使用 $watch 对变量的内容进行深度监听 ( Vue )', ( done ) => {
    let result;
    const vm = new Vue({
      data: () => ({
        a: {
          b: 1,
          c: 2
        }
      })
    });

    vm.$watch( 'a.b', ( value, oldValue ) => {
      result = [ value, oldValue ];
    });

    expect( result ).is.undefined;

    vm.a.b = 2;
    expect( result ).is.undefined;
    vm.$nextTick(() => {
      expect( result ).is.deep.equals([ 2, 1 ]);

      vm.a = { b: 2 };
      expect( result ).is.deep.equals([ 2, 1 ]);
      vm.$nextTick(() => {
        expect( result ).is.deep.equals([ 2, 1 ]);
        done();
      });
    });
  });

  it( '使用 $watch 对变量的内容进行深度监听 ( 二 )', ( done ) => {
    let result;
    let index = 0;
    const hu = new Hu({
      data: () => ({
        a: {
          b: undefined,
          c: 2
        }
      })
    });

    hu.$watch( 'a.b', {
      immediate: true,
      handler( value, oldValue ){
        index++;
        result = [ value, oldValue ];
      }
    });

    expect( index ).is.equals( 1 );
    expect( result ).is.deep.equals([ undefined, undefined ]);

    hu.a = { b: undefined };
    expect( index ).is.equals( 1 );
    expect( result ).is.deep.equals([ undefined, undefined ]);
    hu.$nextTick(() => {
      expect( index ).is.equals( 1 );
      expect( result ).is.deep.equals([ undefined, undefined ]);
      done();
    });
  });

  it( '使用 $watch 对变量的内容进行深度监听 ( 二 ) ( Vue )', ( done ) => {
    let result;
    let index = 0;
    const vm = new Vue({
      data: () => ({
        a: {
          b: undefined,
          c: 2
        }
      })
    });

    vm.$watch( 'a.b', {
      immediate: true,
      handler( value, oldValue ){
        index++;
        result = [ value, oldValue ];
      }
    });

    expect( index ).is.equals( 1 );
    expect( result ).is.deep.equals([ undefined, undefined ]);

    vm.a = { b: undefined };
    expect( index ).is.equals( 1 );
    expect( result ).is.deep.equals([ undefined, undefined ]);
    vm.$nextTick(() => {
      expect( index ).is.equals( 1 );
      expect( result ).is.deep.equals([ undefined, undefined ]);
      done();
    });
  });

  it( '使用 $watch 对值进行监听, 只有值被真正更改时, 回调才被触发', ( done ) => {
    let result;
    let index = 0;

    const hu = new Hu({
      data: () => ({
        a: 1
      })
    });

    hu.$watch( 'a', ( value, oldValue ) => {
      index++;
      result = [ value, oldValue ];
    });

    expect( index ).is.equals( 0 );
    expect( result ).is.undefined;

    hu.a = 1;
    expect( index ).is.equals( 0 );
    expect( result ).is.undefined;
    hu.$nextTick(() => {
      expect( index ).is.equals( 0 );
      expect( result ).is.undefined;

      hu.a = 2;
      expect( index ).is.equals( 0 );
      expect( result ).is.undefined;
      hu.$nextTick(() => {
        expect( index ).is.equals( 1 );
        expect( result ).is.deep.equals([ 2, 1 ]);

        hu.a = 2;
        expect( index ).is.equals( 1 );
        expect( result ).is.deep.equals([ 2, 1 ]);
        hu.$nextTick(() => {
          expect( index ).is.equals( 1 );
          expect( result ).is.deep.equals([ 2, 1 ]);

          hu.a = 3;
          expect( index ).is.equals( 1 );
          expect( result ).is.deep.equals([ 2, 1 ]);
          hu.$nextTick(() => {
            expect( index ).is.equals( 2 );
            expect( result ).is.deep.equals([ 3, 2 ]);

            hu.a = 4;
            expect( index ).is.equals( 2 );
            expect( result ).is.deep.equals([ 3, 2 ]);
            hu.$nextTick(() => {
              expect( index ).is.equals( 3 );
              expect( result ).is.deep.equals([ 4, 3 ]);
              done();
            });
          });
        });
      });
    });
  });

  it( '使用 $watch 对值进行监听, 只有值被真正更改时, 回调才被触发 ( Vue )', ( done ) => {
    let result;
    let index = 0;

    const vm = new Vue({
      data: () => ({
        a: 1
      })
    });

    vm.$watch( 'a', ( value, oldValue ) => {
      index++;
      result = [ value, oldValue ];
    });

    expect( index ).is.equals( 0 );
    expect( result ).is.undefined;

    vm.a = 1;
    expect( index ).is.equals( 0 );
    expect( result ).is.undefined;
    vm.$nextTick(() => {
      expect( index ).is.equals( 0 );
      expect( result ).is.undefined;

      vm.a = 2;
      expect( index ).is.equals( 0 );
      expect( result ).is.undefined;
      vm.$nextTick(() => {
        expect( index ).is.equals( 1 );
        expect( result ).is.deep.equals([ 2, 1 ]);

        vm.a = 2;
        expect( index ).is.equals( 1 );
        expect( result ).is.deep.equals([ 2, 1 ]);
        vm.$nextTick(() => {
          expect( index ).is.equals( 1 );
          expect( result ).is.deep.equals([ 2, 1 ]);

          vm.a = 3;
          expect( index ).is.equals( 1 );
          expect( result ).is.deep.equals([ 2, 1 ]);
          vm.$nextTick(() => {
            expect( index ).is.equals( 2 );
            expect( result ).is.deep.equals([ 3, 2 ]);

            vm.a = 4;
            expect( index ).is.equals( 2 );
            expect( result ).is.deep.equals([ 3, 2 ]);
            vm.$nextTick(() => {
              expect( index ).is.equals( 3 );
              expect( result ).is.deep.equals([ 4, 3 ]);
              done();
            });
          });
        });
      });
    });
  });

  it( '使用 $watch 对值进行监听, 触发回调时, 值已经被更改', ( done ) => {
    let result;
    const hu = new Hu({
      data: () => ({
        a: 1
      })
    });

    hu.$watch( 'a', function( value, oldValue ){
      result = [ this.a, value, oldValue ];
    });

    expect( result ).is.undefined;

    hu.a = 2;
    expect( result ).is.undefined;
    hu.$nextTick(() => {
      expect( result ).is.deep.equals([ 2, 2, 1 ]);
      done();
    });
  });

  it( '使用 $watch 对值进行监听, 触发回调时, 值已经被更改 ( Vue )', ( done ) => {
    let result;
    const vm = new Vue({
      data: () => ({
        a: 1
      })
    });

    vm.$watch( 'a', function( value, oldValue ){
      result = [ this.a, value, oldValue ];
    });

    expect( result ).is.undefined;

    vm.a = 2;
    expect( result ).is.undefined;
    vm.$nextTick(() => {
      expect( result ).is.deep.equals([ 2, 2, 1 ]);
      done();
    });
  });

  it( '使用 $watch 方法, 会返回取消监听的方法', () => {
    let result;
    const hu = new Hu({
      data: () => ({
        a: 1
      })
    });

    const unWatch = hu.$watch( 'a', ( value, oldValue ) => {
      result = [ value, oldValue ];
    });

    expect( result ).is.undefined;

    hu.a = 2;
    expect( result ).is.undefined;
    hu.$nextTick(() => {
      expect( result ).is.deep.equals([ 2, 1 ]);

      unWatch();
      hu.a = 3;
      expect( result ).is.deep.equals([ 2, 1 ]);
      hu.$nextTick(() => {
        expect( result ).is.deep.equals([ 2, 1 ]);
      });
    });
  });

  it( '使用 $watch 方法, 会返回取消监听的方法 ( Vue )', () => {
    let result;
    const vm = new Vue({
      data: () => ({
        a: 1
      })
    });

    const unWatch = vm.$watch( 'a', ( value, oldValue ) => {
      result = [ value, oldValue ];
    });

    expect( result ).is.undefined;

    vm.a = 2;
    expect( result ).is.undefined;
    vm.$nextTick(() => {
      expect( result ).is.deep.equals([ 2, 1 ]);

      unWatch();
      vm.a = 3;
      expect( result ).is.deep.equals([ 2, 1 ]);
      vm.$nextTick(() => {
        expect( result ).is.deep.equals([ 2, 1 ]);
      });
    });
  });

  it( '使用 $watch 时, 使用 immediate 选项可以立即触发回调', ( done ) => {
    let result;
    const hu = new Hu({
      data: () => ({
        a: 1,
        b: 2
      })
    });

    hu.$watch(
      function(){
        return this.a + this.b;
      },
      ( value, oldValue ) => result = [ value, oldValue ],
      {
        immediate: true
      }
    );

    expect( result ).is.deep.equals([ 3, undefined ]);

    hu.a = 2;

    expect( result ).is.deep.equals([ 3, undefined ]);

    hu.b = 998;

    expect( result ).is.deep.equals([ 3, undefined ]);

    hu.$nextTick(() => {
      expect( result ).is.deep.equals([ 1000, 3 ]);
      done();
    });
  });

  it( '使用 $watch 时, 使用 immediate 选项可以立即触发回调 ( Vue )', ( done ) => {
    let result;
    const vm = new Vue({
      data: () => ({
        a: 1,
        b: 2
      })
    });

    vm.$watch(
      function(){
        return this.a + this.b;
      },
      ( value, oldValue ) => result = [ value, oldValue ],
      {
        immediate: true
      }
    );

    expect( result ).is.deep.equals([ 3, undefined ]);

    vm.a = 2;

    expect( result ).is.deep.equals([ 3, undefined ]);

    vm.b = 998;

    expect( result ).is.deep.equals([ 3, undefined ]);

    vm.$nextTick(() => {
      expect( result ).is.deep.equals([ 1000, 3 ]);
      done();
    });
  });

  it( '使用 $watch 时, 使用 deep 选项可以监听对象内部值的变化', ( done ) => {
    let index = 0;
    const hu = new Hu({
      data: () => ({
        aaa: { bbb: 1, ccc: 2 },
        ddd: {
          eee: { fff: 3 }
        }
      })
    });

    hu.$watch( 'aaa', {
      deep: true,
      handler(){ index++ }
    });

    hu.aaa.bbb = 2;
    expect( index ).is.equals( 0 );
    hu.$nextTick(() => {
      expect( index ).is.equals( 1 );

      hu.aaa.ccc = 3;
      expect( index ).is.equals( 1 );
      hu.$nextTick(() => {
        expect( index ).is.equals( 2 );

        hu.aaa = null;
        expect( index ).is.equals( 2 );
        hu.$nextTick(() => {
          expect( index ).is.equals( 3 );

          hu.ddd = null;
          expect( index ).is.equals( 3 );
          hu.$nextTick(() => {
            expect( index ).is.equals( 3 );
            done();
          });
        });
      });
    });
  });

  it( '使用 $watch 时, 使用 deep 选项可以监听对象内部值的变化 ( Vue )', ( done ) => {
    let index = 0;
    const vm = new Vue({
      data: () => ({
        aaa: { bbb: 1, ccc: 2 },
        ddd: {
          eee: { fff: 3 }
        }
      })
    });

    vm.$watch( 'aaa', {
      deep: true,
      handler(){ index++ }
    });

    vm.aaa.bbb = 2;
    expect( index ).is.equals( 0 );
    vm.$nextTick(() => {
      expect( index ).is.equals( 1 );

      vm.aaa.ccc = 3;
      expect( index ).is.equals( 1 );
      vm.$nextTick(() => {
        expect( index ).is.equals( 2 );

        vm.aaa = null;
        expect( index ).is.equals( 2 );
        vm.$nextTick(() => {
          expect( index ).is.equals( 3 );

          vm.ddd = null;
          expect( index ).is.equals( 3 );
          vm.$nextTick(() => {
            expect( index ).is.equals( 3 );
            done();
          });
        });
      });
    });
  });

  it( '使用 $watch 时, 使用 deep 选项监听对象只监听最后一级', ( done ) => {
    let index = 0;
    const hu = new Hu({
      data: () => ({
        a: {
          b: {
            c: {
              d: 1,
              e: 2
            },
            cc: 1
          }
        }
      })
    });

    hu.$watch( 'a.b.c', {
      deep: true,
      handler(){ index++ }
    });

    hu.a.b.c.d = 2;
    expect( index ).is.equals( 0 );
    hu.$nextTick(() => {
      expect( index ).is.equals( 1 );

      hu.a.b.cc = 123;
      expect( index ).is.equals( 1 );
      hu.$nextTick(() => {
        expect( index ).is.equals( 1 );
        done();
      });
    });
  });

  it( '使用 $watch 时, 使用 deep 选项监听对象只监听最后一级 ( Vue )', ( done ) => {
    let index = 0;
    const vm = new Vue({
      data: () => ({
        a: {
          b: {
            c: {
              d: 1,
              e: 2
            },
            cc: 1
          }
        }
      })
    });

    vm.$watch( 'a.b.c', {
      deep: true,
      handler(){ index++ }
    });

    vm.a.b.c.d = 2;
    expect( index ).is.equals( 0 );
    vm.$nextTick(() => {
      expect( index ).is.equals( 1 );

      vm.a.b.cc = 123;
      expect( index ).is.equals( 1 );
      vm.$nextTick(() => {
        expect( index ).is.equals( 1 );
        done();
      });
    });
  });

  it( '使用 $watch 时, 在回调方法内修改监听的值会立即再收到一次回调', ( done ) => {
    const steps = [];
    const hu = new Hu({
      data: {
        a: 1
      }
    });

    hu.$watch( 'a', ( value ) => {
      steps.push( 1 );
      hu.a = 3;
    });
    hu.$watch( 'a', ( value ) => {
      steps.push( 2 );
    });
    hu.$watch( 'a', ( value ) => {
      steps.push( 3 );
    });

    hu.a = 2;
    hu.$nextTick(() => {
      expect( steps ).is.deep.equals([ 1, 1, 2, 3 ]);

      done();
    });
  });

  it( '使用 $watch 时, 在回调方法内修改监听的值会立即再收到一次回调 ( Vue )', ( done ) => {
    const steps = [];
    const vm = new Vue({
      data: {
        a: 1
      }
    });

    vm.$watch( 'a', ( value ) => {
      steps.push( 1 );
      vm.a = 3;
    });
    vm.$watch( 'a', ( value ) => {
      steps.push( 2 );
    });
    vm.$watch( 'a', ( value ) => {
      steps.push( 3 );
    });

    vm.a = 2;
    vm.$nextTick(() => {
      expect( steps ).is.deep.equals([ 1, 1, 2, 3 ]);

      done();
    });
  });

});