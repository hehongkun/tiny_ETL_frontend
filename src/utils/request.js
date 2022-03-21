import axios from 'axios'
import router from '../router'

let apiBaseUrl = '/api'

// 创建 axios 实例
const service = axios.create({
  // baseURL: '/jeecg-boot',
  headers: {'Content-Type': 'application/json;charset=utf-8'},
  withCredentials: true, // 指定某个请求应该发送凭据
  baseURL: apiBaseUrl, // api base_url
  timeout: 5000 // 请求超时时间
})

// 设置axios请求头加入token
service.interceptors.request.use(config => {
  if (config.push === '/tinyETL/login') {
  } else {
    if (localStorage.getItem('token')) {
      // 在请求头加入token，名字要和后端接收请求头的token名字一样
      config.headers.token = localStorage.getItem('token')
    }
  }
  return config
},
error => {
  return Promise.reject(error)
})

// =============================
// 响应回来token是否过期
service.interceptors.response.use(response => {
  console.log('响应回来：' + response.data)
  // 和后端token失效返回码约定403
  if (response.data.code === 401) {
    // 引用elementui message提示框
    this.$message({
      message: '身份已失效',
      type: 'err'
    })
    // 清除token
    localStorage.removeItem('token ')
    // 跳转
    router.push('/login')
  } else {
    return response
  }
},
error => {
  return Promise.reject(error)
})

export {
  service as axios
}
