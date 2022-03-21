// 为了发布 cvue-router 时不将 Vue 整个包打包进来，因此需要将 Vue 的实例进行传入并存储
// 而不适用 import Vue 的形式
let Vue = null;

// vue插件编写
// 实现一个install方法
export default class VueRouter {
  constructor(options) {
    this.$options = options;

    // 保存当前hash到current
    // current应该是响应式的
    // 给指定对象定义响应式属性
    Vue.util.defineReactive(
      this,
      "current",
      window.location.hash.slice(1) || "/"
    );
    // this.current = "/";

    // 监控hashchange
    window.addEventListener("hashchange", () => {
      // #/about => /about
      this.current = window.location.hash.slice(1);
    });
  }
}

VueRouter.install = function (_Vue) {
  Vue = _Vue;

  // 1. 将 $router 注册一下，方便在后续的页面中会使用到 this.$router 等形式进行路由跳转，在组件中使用 this 即指向 Vue 实例
  // 此时 VueRouter 注册的时候并没有执行 new Vue({})，也就拿不到 Vue 的实例，需要等到合适的时机进行，源码比较巧
  Vue.mixin({
    beforeCreate() {
      // this 是 Vue 实例，其 this.$options 及 new Vue({ router }) 传入的 router 参数
      // beforeCreate 不管是在根实例还是组件执行时都会触发，但是它只需要根实例触发一次即可，因此需要通过 this.$options.router 判断
      if (this.$options.router) {
        // 添加到 Vue 的原型链上，其他任何组件都可以在组件内通过 this.$router 进行访问
        Vue.prototype.$router = this.$options.router;
      }
    },
  });

  // 2. 注册两个全局组件：router-Link, router-view
  Vue.component("router-link", {
    // template: "<a href="#/">router link</a>"
    // 这里不能使用 template 的原因是通过 cli 安装的版本它是运行时版本（运行时版本比完整版少了一个编译器），因此不支持 template 解析
    props: {
      to: {
        type: String,
        require: true,
      },
    },
    render(h) {
      return h("a", { attrs: { href: `#${this.to}` } }, this.$slots.default);
    },
  });
  Vue.component("router-view", {
    // vue.runtime.js
    // vue.js compiler -> template -> render()
    // template: '<div>router-view</div>'
    render(h) {
      // 可以传入一个组件直接渲染
      // 思路：如果可以根据url的hash部分动态匹配这个要渲染的组件
      // window.location.hash
      // console.log(this.$router.$options.routes);
      // console.log(this.$router.current);
      let component = null;
      const route = this.$router.$options.routes.find(
        (route) => route.path === this.$router.current
      );
      if (route) {
        component = route.component;
      }
      return h(component);
    },
  });
};
