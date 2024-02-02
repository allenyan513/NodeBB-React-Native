import axiosInstance from './axiosInstance.tsx';
import Config from 'react-native-config';
import EventSource from 'react-native-sse';
import auth from '@react-native-firebase/auth';
import {KnowledgeEntity, StreamMessage} from '../types.tsx';
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
