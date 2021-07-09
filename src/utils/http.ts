import axios from 'axios'

const service = axios.create({
  baseURL:
    process.env.NODE_ENV === 'development' ? '/api' : 'http://localhost:3000',
  timeout: 20000,
})

service.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'

const errHandler = (err: any) => {
  if (err.response) {
    const data = err.response.data
  }

  return Promise.reject(err)
}

// 请求拦截器
service.interceptors.request.use((config: any) => {
  // console.log('config', config);
  return config
}, errHandler)

// 响应拦截器
service.interceptors.response.use((response: any) => {
  // console.log('response', response);
  return response.data
}, errHandler)

const $post = (url: string, data: any, config = {}): Promise<any> => {
  return new Promise((resolve, reject) => {
    service({
      method: 'post',
      url,
      data,
      ...config,
    })
      .then((res: any) => {
        resolve(res)
      })
      .catch((err: any) => {
        reject(err)
      })
  })
}

const $get = (url: string, params: any, config = {}): Promise<any> => {
  return new Promise((resolve, reject) => {
    service({
      method: 'get',
      url,
      params,
      ...config,
    })
      .then((res: any) => {
        resolve(res)
      })
      .catch((err: any) => {
        reject(err)
      })
  })
}

export { $post, $get }
