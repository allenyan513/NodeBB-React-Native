import axiosInstance from './axiosInstance.tsx';
import {
  NodeBBResponse,
  GetNotificationsResponse,
  User,
  ExchangeVerifyTokenResponse,
} from '../types.tsx';

const UserAPI = {
  updateUserName: async function (uid: number, username: string) {
    const res = await axiosInstance.put(`/api/v3/users/${uid}`, {
      username: username,
    });
    return res.data as NodeBBResponse<any>;
  },
  updateUserPicture: async function (uid: number, url: string) {
    const res = await axiosInstance.put(`/api/v3/users/${uid}/picture`, {
      url: url,
      type: 'external',
    });
    return res.data as NodeBBResponse<any>;
  },
  /**
   * idToken交换verifyToken
   */
  exchangeVerifyToken: async function () {
    const res = await axiosInstance.get('/api/v3/exchangeVerifyToken');
    return res.data as NodeBBResponse<ExchangeVerifyTokenResponse>;
  },
  getUserByUid: async function (uid: number) {
    const res = await axiosInstance.get(`/api/user/uid/${uid}`);
    return res.data as User;
  },
  getNotifications: async function () {
    const res = await axiosInstance.get('/api/notifications');
    return res.data as GetNotificationsResponse;
  },
};
export default UserAPI;
