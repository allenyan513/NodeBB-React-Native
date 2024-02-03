import axiosInstance from './axiosInstance.tsx';
import Config from 'react-native-config';
import EventSource from 'react-native-sse';
import auth from '@react-native-firebase/auth';
import {
  CategoriesPostsResponse,
  Category,
  KnowledgeEntity,
  NodeBBResponse,
  PostTopicRequest,
  StreamMessage,
  Topic,
  Post,
  CategoriesResponse,
  CategoriesTopicsResponse,
} from '../types.tsx';

export function createThread() {
  return axiosInstance.post('/api/thread/createThread');
}

export function addQuestion(threadId: string | null, question: string | null) {
  return axiosInstance.post('/api/thread/addQuestion', {
    threadId: threadId,
    question: question,
  });
}

export function callStream(
  url: string,
  idToken: string,
  onMessage: (streamMessage: StreamMessage) => void,
) {
  const eventSource = new EventSource(url, {
    headers: {
      idToken: idToken,
    },
  });
  const listener = (event: any) => {
    if (event.type === 'message') {
      if (event.data === '[DONE]') {
        console.log('Close SSE connection.');
        eventSource.removeAllEventListeners();
        eventSource.close();
      } else {
        console.log('Message:', event.data);
        const streamMessage = JSON.parse(event.data) as StreamMessage;
        onMessage(streamMessage);
      }
    } else if (event.type === 'open') {
    } else if (event.type === 'error') {
    } else if (event.type === 'exception') {
    }
  };
  eventSource.addEventListener('open', listener);
  eventSource.addEventListener('message', listener);
  eventSource.addEventListener('error', listener);
}

export function getThread(threadId: string) {
  return axiosInstance.get(`/api/thread/${threadId}`);
}

export function getThreadList() {
  return axiosInstance.get('/api/thread');
}

export function getKnowledgeList() {
  return axiosInstance.get('/api/knowledge');
}

export function getKnowledgeDetail(knowledgeId: string) {
  return axiosInstance.get(`/api/knowledge/${knowledgeId}`);
}

export function updateKnowledge(
  knowledgeId: string,
  title: string | null,
  content: string | null,
) {
  return axiosInstance.put(`/api/knowledge/${knowledgeId}`, {
    title: title,
    content: content,
  });
}

export function createKnowledge(threadId: string) {
  return axiosInstance.post('/api/knowledge', {
    threadId: threadId,
  });
}

/**
 * Get topic posts
 * @param cid
 */
export async function getTopicPosts(cid: number) {
  const res = await axiosInstance.get(`/api/v3/categories/${cid}/posts`);
  return res.data as NodeBBResponse<CategoriesPostsResponse>;
}

/**
 *
 * @param cid
 */
export async function getTopics(cid: string) {
  const res = await axiosInstance.get(`/api/v3/categories/${cid}/topics`);
  return res.data as NodeBBResponse<CategoriesTopicsResponse>;
}

export async function getRecentTopics() {
  const res = await axiosInstance.get('/api/v3/topics/recent');
  return res.data as NodeBBResponse<Topic[]>;
}
export async function getPopularTopics() {
  const res = await axiosInstance.get('/api/v3/topics/popular');
  return res.data as NodeBBResponse<Topic[]>;
}

export async function getCategories() {
  const response = await axiosInstance.get('/api/v3/categories');
  return response.data as NodeBBResponse<CategoriesResponse>;
}

export async function getCategoryByCid(cid: number) {
  const res = await axiosInstance.get(`/api/v3/categories/${cid}`);
  return res.data as NodeBBResponse<Category>;
}

export async function postTopic(topic: PostTopicRequest) {
  const res = await axiosInstance.post('/api/v3/topics', topic);
  return res.data as NodeBBResponse<Topic>;
}

export async function getTopic(tid: string) {
  const res = await axiosInstance.get(`/api/topic/${tid}`);
  return res.data as Topic;
}

/**
 * 回复topic
 * @param tid
 * @param content
 * @param toPid
 */
export async function replyToTopic(
  tid: string,
  content: string,
  toPid: number,
) {
  const res = await axiosInstance.post(`/api/v3/topics/${tid}`, {
    content: content,
    toPid: toPid,
  });
  return res.data as NodeBBResponse<Post>;
}

export function exchangeVerifyToken() {
  return axiosInstance.get('/api/v3/exchangeVerifyToken');
}
