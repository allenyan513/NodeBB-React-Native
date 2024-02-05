import axiosInstance from './axiosInstance.tsx';
import { NodeBBResponse, Post, PostTopicRequest, ReplyTopicRequest, Topic } from "../types.tsx";

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

  getRecentTopics: async function () {
    const res = await axiosInstance.get('/api/v3/topics/recent');
    return res.data as NodeBBResponse<Topic[]>;
  },
  getPopularTopics: async function () {
    const res = await axiosInstance.get('/api/v3/topics/popular');
    return res.data as NodeBBResponse<Topic[]>;
  },

  postTopic: async function (topic: PostTopicRequest) {
    const res = await axiosInstance.post('/api/v3/topics', topic);
    return res.data as NodeBBResponse<Topic>;
  },

  getTopic: async function (tid: string) {
    const res = await axiosInstance.get(`/api/topic/${tid}`);
    return res.data as Topic;
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
