import axios from 'axios'
import config from './config'
//项目中引用了 ElementUI，用加载和提示两个组件，在请求数据时，后返回状态码后的行为
import { Loading } from 'element-ui'
let loading;
// 添加请求拦截器，在请求时，显示 ElementUI 的加载组件
axios.interceptors.request.use(function (config) {
  loading = Loading.service({ fullscreen: true ,text:'疯狂加载中'});
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
  loading.close();
});

// 添加响应拦截器 ，请求结束后，关闭 加载组件
axios.interceptors.response.use(function (response) {
  loading.close();
  return response;
}, function (error) {
  // 对响应错误做点什么
  if (error && error.response) {
    switch (error.response.status) {
      case 400:
        console.log('错误请求')
        break;
      case 401:
        console.log('未授权，请重新登录')
        break;
      case 403:
        console.log('拒绝访问')
        break;
      case 404:
        console.log('请求错误,未找到该资源')
        break;
      case 405:
        console.log('请求方法未允许')
        break;
      case 408:
        console.log('请求超时')
        break;
      case 500:
        console.log('服务器端出错')
        break;
      case 501:
        console.log('网络未实现')
        break;
      case 502:
        console.log('网络错误')
        break;
      case 503:
        console.log('服务不可用')
        break;
      case 504:
        console.log('网络超时')
        break;
      case 505:
        console.log('http版本不支持该请求')
        break;
      default:
        console.log(`连接错误${error.response.status}`)
    }
  } else {
    console.log('连接到服务器失败')
  }
  loading.close();
  return Promise.reject(error);
});
class httpService {
  setConfig(){
    const token=sessionStorage.getItem("token");
    const username=sessionStorage.getItem("username");
    config.headers={
      token:token,
      username:username,
    };
  }
  //get请求 返回response.data
  get(url,data = {},configs={}){
    try {
      config.params=data;
      var arr = Object.keys(configs);
      if(arr.length!==0){
        config.headers=configs.headers;
      }
    } catch (error) {
      
    }
    this.setConfig();
    return new Promise((resolve,reject) => {
      axios.get(config.baseURL+url,data,config)
        .then(response => {
          resolve(response.data);
        },err => {
          reject(err)
        })
    })
  }
  //post请求 返回response.data
  post(url,data = {},configs={}){
    config.params=data;
    var arr = Object.keys(configs);
    if(arr.length!==0){
      config.headers=configs.headers;
    }
    this.setConfig();
    return new Promise((resolve,reject) => {
      // debugger;
      axios.post(url,data,config)
        .then(response => {
          resolve(response.data);
        },err => {
          reject(err)
        })
    })
  }
  //post请求 返回response
  postToRes(url,data = {},configs={}){
    config.params=data;
    var arr = Object.keys(configs);
    if(arr.length!==0){
      config.headers=configs.headers;
    }
    this.setConfig();
    return new Promise((resolve,reject) => {
      axios.post(url,data,config)
        .then(response => {
          resolve(response);
        },err => {
          reject(err)
        })
    })
  }
  //put 请求返回response.data
  put(url,data = {},configs={}){
    config.params=data;
    var arr = Object.keys(configs);
    if(arr.length!==0){
      config.headers=configs.headers;
    }
    this.setConfig();
    return new Promise((resolve,reject) => {
      axios.put(url,data,config)
        .then(response => {
          resolve(response.data);
        },err => {
          reject(err)
        })
    })
  }
  //返回get请求集合
  funGetParam(url,config) {
    return axios.get(url,config);
  }
  //返回post请求集合
  funPostParam(url,data) {
    const token=sessionStorage.getItem("token");
    const username=sessionStorage.getItem("username");
    axios.defaults.headers.common['token'] = token;
    axios.defaults.headers.common['username'] = username;
    return axios.post("http://192.168.1.13:8084/api"+url,data);
  }
  //并发
  all(param){
    this.setConfig();
    return new Promise((resolve,reject) => {
      axios.all(param)
        .then(axios.spread(function (...res) {
          // 多个请求现在都执行完成 回调所有获取到的数据
          resolve(...res);
        }).catch(error => {
          console.log(...error);
          reject(...error);
        }));
    });
  }
}
export default httpService;

