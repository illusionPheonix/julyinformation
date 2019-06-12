import { resolve } from 'path';
import { rejects } from 'assert';

// 封装axios
// 引入axios
const axios = require('axios');
const qs = require('qs');
import local from '@/utils/local/local';
import { error } from 'util';

// 配置基本地址
axios.defaults.baseURL = "http://172.16.11.177:666";

// axios请求拦截器
axios.interceptors.request.use(config => {
    // 获取token
    const token = local.get('qike_2019_system');
    config.headers.authorization = `Bearer ${token}` 
    return config;
})

// axios响应拦截器
// 响应拦截（配置请求回来的信息）
axios.interceptors.response.use(response=>{
    return response;
    },error=>{
        if(error.response.status===401){
            //退出登录
                // 清除token
                local.remove('qike_2019_system');               
                // 跳转路由
                window.location.href='/login';            
        }
        return Promise.reject(error.response.data);  // 返回接口返回的错误信息
        }
    )


export default{
    get( url,params={} ){
        return new Promise((resolve,rejects)=>{
            axios.get(url,{params})
                 .then( response =>{
                    resolve(response.data);
                 })
                 .catch(err=>{
                     rejects(err);
                 })
        })
    },
    post( url,params={} ){
        return new Promise((resolve,rejects)=>{
            axios.post(url,qs.stringify(params))
                 .then( response =>{
                    resolve(response.data);
                 })
                 .catch(err=>{
                     rejects(err);
                 })
        })
    }
}