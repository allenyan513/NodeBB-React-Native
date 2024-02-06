import axiosInstance from './axiosInstance.tsx';
import {
  CategoriesPostsResponse,
  CategoriesResponse,
  CategoriesTopicsResponse,
  Category,
  NodeBBResponse,
} from '../types.tsx';

const CategoryAPI = {
  /**
   *
   * @param cid
   */
  getTopics: async function (cid: string | number) {
    const res = await axiosInstance.get(`/api/v3/categories/${cid}/topics`);
    return res.data as NodeBBResponse<CategoriesTopicsResponse>;
  },

  getTopicPosts: async function (cid: number) {
    const res = await axiosInstance.get(`/api/v3/categories/${cid}/posts`);
    return res.data as NodeBBResponse<CategoriesPostsResponse>;
  },

  getCategories: async function () {
    const response = await axiosInstance.get('/api/v3/categories');
    return response.data as NodeBBResponse<CategoriesResponse>;
  },

  getCategoryByCid: async function (cid: number) {
    const res = await axiosInstance.get(`/api/v3/categories/${cid}`);
    return res.data as NodeBBResponse<Category>;
  },
};

export default CategoryAPI;
