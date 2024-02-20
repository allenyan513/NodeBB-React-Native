import axios from 'axios';
import auth from '@react-native-firebase/auth';
import {MMKV} from 'react-native-mmkv';
import Config from 'react-native-config';
const storage = new MMKV();

console.log('Config.API_URL', Config.API_URL);
const axiosInstance = axios.create({
  baseURL: Config.API_URL,
  timeout: 30000,
});

// 请求拦截器，自动添加 token 到 headers 中
axiosInstance.interceptors.request.use(
  async function (config) {
    if (auth().currentUser != null) {
      const idToken = await auth().currentUser?.getIdToken();
      config.headers.idToken = idToken;
    }
    const verifyToken = storage.getString('user.verifyToken');
    // console.log('verifyToken', verifyToken);
    if (verifyToken) {
      config.headers.Authorization = `Bearer ${verifyToken}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

export default axiosInstance;
