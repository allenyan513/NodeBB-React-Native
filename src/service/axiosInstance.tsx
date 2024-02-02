import axios from 'axios';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import Config from 'react-native-config';

console.log('BASE_URL', Config.REACT_APP_API_URL);
const axiosInstance = axios.create({
  baseURL: Config.REACT_APP_API_URL,
  timeout: 30000,
});

// 请求拦截器，自动添加 token 到 headers 中
axiosInstance.interceptors.request.use(
  async function (config) {
    if (auth().currentUser != null) {
      const idToken = await auth().currentUser?.getIdToken();
      config.headers.idToken = idToken;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

export default axiosInstance;

// interface HttpRequestOptions {
//   url: string;
//   params?: {};
// }
//
// export default class HttpRequest {
//   static post(options: HttpRequestOptions) {
//     return new Promise((resolve, reject) => {
//       instance
//         .post(options.url, options.params)
//         .then(response => {
//           if (response.status === 200) {
//             let res = response.data;
//             if (res.code === 200) {
//               resolve(res);
//             } else {
//               this.handleServerError(res.code, res.msg);
//               reject(response.data);
//             }
//           } else {
//             reject(response.data);
//           }
//         })
//         .catch(error => {
//           //处理http错误
//           this.handleHttpError(error.response.status);
//           reject(error);
//         });
//     });
//   }
//
//   static get(options: HttpRequestOptions): Promise<any> {
//     return new Promise((resolve, reject) => {
//       instance
//         .get(options.url)
//         .then(response => {
//           if (response.status === 200) {
//             let res = response.data;
//             if (res.code === 200) {
//               resolve(res);
//             } else {
//               this.handleServerError(res.code, res.msg);
//               reject(response.data);
//             }
//           } else {
//             // console.log('!200' + response);
//             reject(response.data);
//           }
//         })
//         .catch(error => {
//           //处理http错误
//           console.error(error);
//           this.handleHttpError(error.response.status);
//           reject(error);
//         });
//     });
//   }
//
//   static handleHttpError(status: number) {
//     console.log('handle http error', status);
//     switch (status) {
//       case 401:
//         break;
//       case 403:
//         break;
//       default:
//         break;
//     }
//   }
//
//   /**
//    * 通用错误提示
//    * @param code
//    * @param msg
//    */
//   static handleServerError(code: number, msg: string) {
//     if (code >= 600 && code <= 900) {
//       message.error(msg);
//     }
//   }
// }
