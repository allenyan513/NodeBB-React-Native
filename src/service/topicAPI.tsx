import axiosInstance from './axiosInstance.tsx';
import {
  NodeBBResponse,
  Post,
  PostTopicRequest,
  ReplyTopicRequest,
  Topic,
  TopicsResponse,
} from '../types.tsx';

const TopicAPI = {
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

  getRecentTopics: async function (page: number = 1, pageSize: number = 10) {
    const res = await axiosInstance.get(
      `/api/recent?page=${page}&pageSize=${pageSize}`,
    );
    return res.data as TopicsResponse;
  },
  getPopularTopics: async function (page: number = 1, pageSize: number = 10) {
    const res = await axiosInstance.get(
      `/api/popular?page=${page}&pageSize=${pageSize}`,
    );
    return res.data as TopicsResponse;
  },

  getTopic: async function (tid: string, page: number = 1) {
    const res = await axiosInstance.get(`/api/topic/${tid}?page=${page}`);
    return res.data as Topic;
  },

  postTopic: async function (topic: PostTopicRequest) {
    const res = await axiosInstance.post('/api/v3/topics', topic);
    return res.data as NodeBBResponse<Topic>;
  },

  replyTopic: async function (
    tid: number,
    content: string,
    toPid: number | null,
  ) {
    const data: ReplyTopicRequest = {
      content: content,
    };
    if (toPid) {
      data.toPid = toPid;
    }
    const res = await axiosInstance.post(`/api/v3/topics/${tid}`, data);
    return res.data as NodeBBResponse<Post>;
  },
};

export default TopicAPI;
