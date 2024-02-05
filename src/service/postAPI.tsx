import axiosInstance from './axiosInstance.tsx';
import {NodeBBResponse} from '../types.tsx';

const PostAPI = {
  /**
   * @param pid
   * @param delta 1: upvote, -1: downvote 0: cancel vote
   */
  vote: async function (pid: number, delta: number) {
    const res = await axiosInstance.put(`/api/v3/posts/${pid}/vote`, {
      delta: delta,
    });
    return res.data as NodeBBResponse<any>;
  },
};

export default PostAPI;
