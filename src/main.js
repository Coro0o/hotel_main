import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import '../src/assets/gobal.css'
// import axios from 'axios'
import '../src/utils/request'
// import qs from "qs"

// axios.defaults.baseURL = 'http://localhost:3000/api'
// //请求头携带token
// axios.interceptors.request.use(config => {
//   config.headers.Authorization = window.sessionStorage.getItem('token')

//   return config
// })
// Vue.prototype.$http = axios
// Vue.prototype.$qs = qs

Vue.config.productionTip = false
import { post, get } from '../src/utils/request'
//定义全局变量
Vue.prototype.$post = post;
Vue.prototype.$get = get;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
