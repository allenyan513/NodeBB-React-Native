import axios from 'axios';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import Config from 'react-native-config';
import {MMKV} from 'react-native-mmkv';

const storage = new MMKV();

const axiosInstance = axios.create({
  baseURL: 'http://192.168.0.130:4567',
  // baseURL: 'https://nodebb-halifax-legxqdbi3q-uc.a.run.app',
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
