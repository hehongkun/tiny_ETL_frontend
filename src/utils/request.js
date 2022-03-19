import axios from 'axios'

let apiBaseUrl = '/api'

// 创建 axios 实例
const service = axios.create({
  // baseURL: '/jeecg-boot',
  headers: {'Content-Type': 'application/json;charset=utf-8'},
  withCredentials: true, // 指定某个请求应该发送凭据
  baseURL: apiBaseUrl, // api base_url
  timeout: 5000 // 请求超时时间
})

export {
  service as axios
}
