import axios from 'axios'
import qs from "qs"
// 使用element-ui Message做消息提醒
import { Message } from 'element-ui';
// 超时
axios.defaults.timeout = 5000;
//设置访问的域名前缀
axios.defaults.baseURL = 'http://localhost:3000/api';
//请求拦截器
axios.interceptors.request.use(config => {
    //发请求前做的一些处理，数据转化，配置请求头，设置token,设置loading等，根据需求去添加
    // config.data = qs.stringify(config.data); //数据转化,也可以使用qs转换
    config.headers = {
        'Content-Type': 'application/x-www-form-urlencoded' //配置请求头
    }
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
}, error => {
    Promise.reject(error)
})

axios.interceptors.response.use(function (response) {
    // 处理响应数据
    return response
}, function (error) {
    // 处理响应失败
    return Promise.reject(error)
})
export function get(url, params = {}) {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params: params
        })
            .then(response => {
                resolve(response.data);
            })
            .catch(err => {
                reject(err)
            })
    })
}

export function post(url, params) {
    return new Promise((resolve, reject) => {
        axios.post(url, qs.stringify(params))
            .then(response => {

                resolve(response.data);

            })
            .catch(err => {
                reject(err)
            })
    });
}
