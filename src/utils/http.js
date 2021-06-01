import axios from 'axios';

const service = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 20000
});

service.defaults.headers.post['Content-Type'] =
  'application/json;charset=UTF-8';

const errHandler = err => {
  if (err.response) {
    const data = err.response.data;
  }

  return Promise.reject(err);
};

// 请求拦截器
service.interceptors.request.use(config => {
  // console.log('config', config);
  return config;
}, errHandler);

// 响应拦截器
service.interceptors.response.use(config => {
  console.log('config', config);
  return config;
}, errHandler);

const $post = (url, data, config = {}) => {
  return new Promise((resolve, reject) => {
    service({
      method: 'post',
      url,
      data,
      ...config,
    })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
};

const $get = (url, params, config = {}) => {
  return new Promise((resolve, reject) => {
    service({
      method: 'get',
      url,
      params,
      ...config,
    })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export { $post, $get };
