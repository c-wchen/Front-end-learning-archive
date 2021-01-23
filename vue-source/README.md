## Vue源码解析
Vue采用数据劫持配合发布者-订阅者模式的方式，通过Object.defineProperty来配置getter和setter来劫持数据的变化，在数据变动时，发布消息给依赖收集器，去通知观察者做出对应的回调函数，去更新视图。
MVVM 作为绑定的入口，整合Observer,Compile和Watcher三者，通过Observer来监听model数据变化，通过Compile来解析编译模板指令，最终利用Watcher搭起Observer,Compile之间的通信桥梁，达到数据数据变化 => 视图更新，视图的交互变化 => 数据model变更的双向绑定效果
## 实现
- 数据劫持
- 视图解析
	- 数据的双向绑定
	- 文本解析
	- html解析

## 技术栈
设计模式 
* 观察者-订阅者模式

数据劫持 
* Object.defineProperty

EMCAScript6

## 目录结构
```linux
│  .gitignore
│  README.md
│  vtest.html       
│  vue.js          
│  Vue源码解析.docx  文档参考
└─custom-vue        自定义vue
        ctest.html
        cvue.js
        Observer.js
```
## 参考文献
> [learnVueVue源码分析](https://github.com/answershuto/learnVue/blob/master/docs/%E5%93%8D%E5%BA%94%E5%BC%8F%E5%8E%9F%E7%90%86.MarkDown)

> [bilibili小马哥老师视频](https://www.bilibili.com/video/BV1qJ411W7YR?from=search&seid=2770849016914037011)
