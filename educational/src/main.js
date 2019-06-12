import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 引入element ui
import ElementUI from 'element-ui';
// 引入request
import request from "./utils/request/request";
// 引入本地存储localStorage函数
import local from '@/utils/local/local';
// 将request挂载在vue的原型方法上
Vue.prototype.request = request;
// 引入echarts，并挂载在vue原型上
import echarts from 'echarts';
Vue.prototype.echarts=echarts;

// css的引入
import 'element-ui/lib/theme-chalk/index.css';
// 引入样式重置表
import "./assets/css/reset.css";
// 引入字体图标
import "./assets/css/iconfont/iconfont.css";

// 注册element ui
Vue.use(ElementUI);

// 阻止生产提示
Vue.config.productionTip = false;
// 路由守卫，拦截所有路由
router.beforeEach((to,from,next)=>{
  // 获得浏览器中的token
  const token = local.get('qike_2019_system');
  // 如果有token，就放行
  if(token){
    next()
  }else{//没有token
    // 如果要去登录，放行
    if(to.path==='/login'){
      next()
    }else{
      // 想去其他界面，调到登录
      next('/login');
    }
  }
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
