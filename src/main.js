/* eslint-disable */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/reset.css'
//插件使用
import MyHttp from './plugins/http.js'

//原型导入axios
// import axios from 'axios'
// Vue.prototype.$http=axios;npm

// vue框架自带的生产模式信息提示
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(MyHttp)


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  // 注册组件
  components: { App },
  // 注册模板
  template: '<App/>'
})
