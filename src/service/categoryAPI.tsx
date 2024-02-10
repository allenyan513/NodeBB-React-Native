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
  getTopics: async function (
    cid: string | number,
    page: number = 1,
    pageSize: number = 10,
  ) {
    const res = await axiosInstance.get(
      `/api/v3/categories/${cid}/topics?page=${page}&pageSize=${pageSize}`,
    );
    return res.data as NodeBBResponse<CategoriesTopicsResponse>;
  },

  getCategories: async function () {
    const response = await axiosInstance.get('/api/v3/categories');
    return response.data as NodeBBResponse<CategoriesResponse>;
  },

  getTopicPosts: async function (cid: number) {
    const res = await axiosInstance.get(`/api/v3/categories/${cid}/posts`);
    return res.data as NodeBBResponse<CategoriesPostsResponse>;
  },
  getCategoryByCid: async function (cid: number) {
    const res = await axiosInstance.get(`/api/v3/categories/${cid}`);
    return res.data as NodeBBResponse<Category>;
  },
};

export default CategoryAPI;
