/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const TIMEOUT_RIME = 60;
axios.defaults.headers['Content-Type'] = 'application/json';
axios.defaults.timeout = TIMEOUT_RIME * 1000;

axios.interceptors.request.use(
  (config: AxiosRequestConfig) => config,
  (err: any) => Promise.reject(err),
);

axios.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.data.ret === 200) {
      /**
       * do something
       */
      return response;
    } else if (response.data.ret === 304) {
      /**
       * do something
       */
      return Promise.reject(response);
    } else {
      /**
       * do something
       */
      return Promise.reject(response);
    }
  },
  (err: any) => {
    console.log(err);
    if (err.code === 'ECONNABORTED' && err.message.indexOf('timeout') !== -1) {
      /**
       * do something
       */
      // console.log('请求超时，请联系管理员');
    }
    if (err.response) {
      /**
       * do something
       */
      // alert(decodeURI(err.response.data.msg || err.response.data.message));
    }
    return Promise.reject(err);
  },
);
