# 1.0.0-bata.20
  - 📅 2020-04-01
  - 🌟 移除指令的提交更改方法 `Hu.directive.commit`
  - 🌟 移除指令的注销方法 `Hu.directive.destroy`
  - 🌟 `render` 方法的首个参数支持传入 `null` 或 `undefined` 来销某个已渲染的节点
  - 🌟 支持使用 `bind` 指令方法绑定另一个指令方法 ( [#20](https://github.com/MoomFE/Hu/issues/20) )
  - 💄 允许指令方法向指令提交另一个指令方法, 例如 `bind` 指令方法
  - 🐞 修复 $info 内的变量更改后不会触发监听的问题 ( [#24](https://github.com/MoomFE/Hu/issues/24) )
  - 🐞 修复在非浏览器环境下使用会报 `Hu is not defined` 错误的问题
  - 🐞 修复在某些情况下删除或修改只读对象时报错的问题
  - 🐞 修复在某些情况下切换插值内对象报错的问题
  - 🐞 修复 `Hu.util.toString` 判断无原型对象时报错的问题
  - ⚠️ 默认不再打包包含 `Web Components` Polyfill 的版本

# 1.0.0-bata.19
  - 📅 2019-09-26
  - 🌟 新增 `$info.props` 来存储当前实例 props 的赋值状态 ( [#9](https://github.com/MoomFE/Hu/issues/9) )
  - 💄 实例选项 watch 的 deep 选项支持传入数字, 用于指定深度监听几层对象 ( [#17](https://github.com/MoomFE/Hu/issues/17) )

# 1.0.0-bata.18
  - 📅 2019-09-20
  - 🌟 指令方法注册时可定义 `proxy` 静态方法用于代理指令方法的使用步骤
  - 🌟 新增 `safety` 工具方法, 用于防止方法执行时被依赖收集
  - 💄 bind 指令方法支持只传入观察者对象时返回值可以用于批量使用 bind 创建对象绑定 ( [#14](https://github.com/MoomFE/Hu/issues/14) )
  - 💄 bind 指令方法支持返回值可以用于批量使用 bind 创建对象绑定 ( [#14](https://github.com/MoomFE/Hu/issues/14#issuecomment-527061535) )
  - 🐞 修复在 watch 回调中使用观察者对象可能会被 watch 的监听函数依赖收集的问题 ( [#23](https://github.com/MoomFE/Hu/issues/23) )

# 1.0.0-bata.17
  - 📅 2019-09-18
  - 💄 事件监听修饰符新增按键码修饰符 `esc,tab,enter,space,up,left,right,down,delete`
  - 💄 model 指令可以使用 bind 指令方法的结果进行绑定 ( [#15](https://github.com/MoomFE/Hu/issues/15) )
  - 🐞 修复 .native 事件修饰符失效的问题 ( [#22](https://github.com/MoomFE/Hu/issues/22) )

# 1.0.0-bata.16
  - 📅 2019-09-16
  - 🌟 新增 `Hu.use` 方法用于安装插件, 提供了一些内部使用的变量 ( [#8](https://github.com/MoomFE/Hu/issues/8) )
  - 💄 将实例的 $on, $off 方法覆盖自定义元素本身的 事件绑定 ( addEventListener ) / 事件解除 ( removeEventListener ) 方法 ( [#11](https://github.com/MoomFE/Hu/issues/11) )
  - 💄 自定义元素 Shadow DOM 的内容应该在自定义元素从文档流移除时进行清除 ( [#12](https://github.com/MoomFE/Hu/issues/12) )
  - 💄 自定义元素创建的实例中, 会将实例上观察者对象的属性注入到自定义元素本身 ( [#6](https://github.com/MoomFE/Hu/issues/6) )
  - 💄 添加 `create` 工具方法
  - ⚠️ 使用 `Hu.directive` 注册自定义指令, 不再向 constructor 传入 name 参数
  - ⚠️ 完全重构 `Hu.directiveFn` 方法, 将使用类来创建指令方法, 以更好的管理指令方法的生命周期
  - ⚠️ 移除 `Hu.noConflict` 方法, 不再强制将 Hu 对象注入到 window, 更加规范化
  - ⚠️ 实例选项移除 globalMethods 选项 ( [#6](https://github.com/MoomFE/Hu/issues/6#issuecomment-528181482) )
  - 🐞 修复工具方法 `isIterable` 判定空字符串为不可迭代的问题 ( [#16](https://github.com/MoomFE/Hu/issues/16) )
  - 🐞 修复两次渲染时使用了同一个指令方法, 前一个指令方法不会被销毁的问题 ( [#19](https://github.com/MoomFE/Hu/issues/19) )

# 1.0.0-bata.15
  - 📅 2019-09-07
  - 🙁 重写全部单元测试
  - 💄 更改 `model` 指令的内部逻辑, 不再依赖 `triggerEvent` 工具方法
  - 💄 使 styles 选项在使用 new 创建的实例中也可用 ( [#7](https://github.com/MoomFE/Hu/issues/7) )
  - 💄 美化注释中插值绑定的渲染结果
  - 💄 添加 `toString`, `isIterable`, `isNotEqual` 工具方法
  - ⚠️ 移除 `triggerEvent`, `cached` 工具方法
  - 🐞 修复在使用 polyfill 的情况下, 内部方法 toString 不能正确判断对象是否可以被 JSON.stringify 转换 ( [#2](https://github.com/MoomFE/Hu/issues/2) )
  - 🐞 修复渲染时可能导致的插槽混乱的问题 ( [#3](https://github.com/MoomFE/Hu/issues/3) )
  - 🐞 修复组件的 prop 类型为 Boolean 时传入了字符串类型的 false 时, 会解析成 true 的问题

# 1.0.0-bata.14
  - 📅 2019-06-06
  - 🐞 修复在低版本火狐上的 `SyntaxError` 问题
  - 🐞 修复在低版本火狐上使用 `@event` 绑定事件时的异常
  - 🐞 修复在使用 polyfill 的低版本浏览器下, 某些情况下自定义元素初始化滞后的问题
  - 🐞 修复在某些环境下使用 `@event` 给自定义元素绑定事件出错的问题

# 1.0.0-bata.13
  - 📅 2019-06-04
  - 🌟 ~~新增指令的提交更改方法 `Hu.directive.commit`, 供指令方法使用~~ ( v1.0.0-bata.20 移除 )
  - 🌟 ~~新增指令的注销方法 `Hu.directive.destroy`, 供指令方法使用~~ ( v1.0.0-bata.20 移除 )

# 1.0.0-bata.12
  - 📅 2019-06-04
  - 🌟 新增全局方法 `Hu.directive`, 用于注册新的指令或者获取已定义的指令
  - 🌟 新增全局方法 `Hu.directiveFn`, 用于注册指令方法
  - 💄 文本节点使用插值绑定时传入 null 或 undefined 将会输出空字符串, 而不是 'null' 或 'undefined'
  - 💄 文本节点使用插值绑定时传入 JSON 时将会输出使用 JSON.stringify 处理后的字符串, 而不是 '[object Object]'
  - 💄 使用 :text 指令时传入 JSON 或数组时将会输出使用 JSON.stringify 处理后的字符串, 而不是 '[object Object]'
  - 💄 使用 :html 指令时传入 JSON 或数组时将会输出使用 JSON.stringify 处理后的字符串, 而不是 '[object Object]'
  - 💄 使用 :html 指令时传入 null 或 undefined 将会输出空字符串, 而不是 'null' 或 'undefined'
  - 🐞 修复使用某些不存在的指令时会报错的问题
  - 🐞 修复使用 :text 指令时, 首次传入的值是 undefined 时, 内容不会被清除的问题
  - 🐞 修复使用 :html 指令时, 首次传入的值是 undefined 时, 内容不会被清除的问题

# 1.0.0-bata.11
  - 📅 2019-05-23
  - 💄 更改 `$globalMethods` 实例属性的一些实现细节及表现形式
    - 实例属性会在实例上添加属性内方法的映射 ( 之前添加的是方法的副本, 和 $methods 表现一致 )
    - 实例属性会在自定义元素上添加属性内方法的映射 ( 之前添加的是方法的副本, 和 $methods 表现一致 )
    - 实例属性是响应式的了 ( 当用于渲染或计算相关的方法被用户更改后, 可以自动触发更新 )
  - 🐞 修复在某些情况下会将注释渲染为普通文本的问题
  - 🐞 修复在某些情况下渲染时出错的问题

# 1.0.0-bata.10
  - 📅 2019-05-15
  - 🐞 修复因疏忽导致的实例在非浏览器环境下无法运行的问题

# 1.0.0-bata.9
  - 📅 2019-05-15
  - 🌟 实例 $info 选项新增 uid 字段, 为当前实例的 UID 且始终是唯一的
  - 🌟 实例新增 $root 选项, 为当前实例的根实例, 若当前实例没有父实例, $root 选项会是自己
  - 🌟 实例新增 $parent 选项, 为当前实例的父实例
  - 🌟 实例新增 $children 选项, 为当前实例的直接子组件
  - 💄 :text 功能指令由操作 innerText 改为 textContent

# 1.0.0-bata.8
  - 📅 2019-05-14
  - 💄 html.repeat 的回调新增第三个参数, 是当前遍历对象的映射
  - 🐞 修复 :show 指令方法在首次传入的值是 undefined 的时候, 不会将元素隐藏的问题
  - 🐞 修复在渲染 html 注释的内容时内容错误的问题

# 1.0.0-bata.7
  - 📅 2019-05-09
  - 🐞 修复在使用 polyfill 时自定义元素的样式表可能会被初始化多次的问题

# 1.0.0-bata.6
  - 📅 2019-05-09
  - 🌟 实例选项新增 `styles` 选项, 用于指定自定义元素的样式, 只在自定义元素创建的实例下可用
  - 🌟 实例选项新增 `globalMethods` 选项和 `$globalMethods` 实例属性
    - 由自定义元素创建的实例会将属性内的方法混入到自定义元素本身, 可以直接调用
    - 和 `methods` 选项类似, 实例创建后会将选项内的方法混入到当前实例中, 并且会将所有方法存储到当前实例的 `$globalMethods` 实例属性中
  - 💄 不再根据 `render` 实例选项而生成不同的 `$forceUpdate`
  - 🐞 修复在使用 polyfill 时自定义元素的样式无法生效的问题, 目前只对 `styles` 实例选项传入的样式进行兼容

# 1.0.0-bata.5
  - 📅 2019-05-06
  - 🌟 自定义元素本身新增 $on, $once, $off 事件处理方法, 是实例本身的相应方法的映射, 用于从外部给自定义元素绑定及移除事件
  - 🌟 使用 @event 指令给自定义元素绑定事件时, 会用于监听自定义元素对应的实例中的自定义事件
  - 🌟 使用 @event 指令给自定义元素绑定事件时, 可使用 .native 修饰符监听自定义元素的原生事件
  - 🌟 bind 指令方法可以用于文本区域的绑定

# 1.0.0-bata.4
  - 📅 2019-04-26
  - 🌟 将部分内置方法共享到 Hu.util 中
  - 🌟 新增 html.svg 方法, 弥补 html 方法创建的 `<svg>` 标签内部元素无用的问题
  - 🌟 新增 :show 功能指令
  - 🐞 修复当一个 Watcher 在收集依赖时注销了另一个 watch 时, 被注销的 watch 依旧还会执行的问题
  - 🐞 修复使用 :model 功能指令在绑定 Select, Radio, Checkbox 时在某些情况下报错的问题

# 1.0.0-bata.3
  - 📅 2019-04-17
  - 🌟 新增 :text 功能指令
  - 🌟 新增 :html 功能指令
  - 🐞 修复 polyfill 的版本运行出错的问题

# 1.0.0-bata.1
  - 📅 2019-04-15
  - 🌟 基本功能已完成

<br>
<hr>
<br>
🌟: 新增的功能 / 重要更新<br>
💄: 已有功能优化 / 一般更新<br>
⚠️: 与上一版本可能不兼容的更新<br>
🐞: BUG 修复<br>
📅: 版本发布日期