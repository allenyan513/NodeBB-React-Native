import {createContext, useContext, useReducer} from 'react';
import {Category, Post, Topic} from '../types.tsx';

interface GlobalContextProps {
  globalState: any;
  dispatch: any;
}
interface GlobalState {
  /**
   * 分类
   */
  categories: Category[];
  /**
   * cid -> topics
   */
  topicsMap: Map<number, Topic[]>;
  /**
   * tid -> posts
   */
  postsMap: Map<number, Post[]>;
}

export type GlobalAction =
  | {
      type: 'SET_TOPICS';
      payload: {
        cid: number;
        topics: Topic[];
      };
    }
  | {
      type: 'UPVOTE_TOPIC';
      payload: {
        tid: number;
      };
    }
  | {
      type: 'DOWNVOTE_TOPIC';
      payload: {
        tid: number;
      };
    }
  | {
      type: 'UPVOTE_POST';
      payload: {
        pid: number;
      };
    }
  | {
      type: 'DOWNVOTE_POST';
      payload: {
        pid: number;
      };
    };

const GlobalContext = createContext<GlobalContextProps | null>(null);

export function GlobalProvider({children}: {children: any}) {
  const globalReducer = (
    state: GlobalState,
    action: GlobalAction,
  ): GlobalState => {
    switch (action.type) {
      case 'SET_TOPICS':
        const {cid, topics} = action.payload;
        return {
          ...state,
          topicsMap: new Map(state.topicsMap.set(cid, topics)),
        };
      case 'UPVOTE_TOPIC':
      case 'DOWNVOTE_TOPIC':
        const delta = action.type === 'UPVOTE_TOPIC' ? 1 : -1;
        const {tid} = action.payload;
        return {
          ...state,
          topicsMap: new Map(
            Array.from(state.topicsMap).map(([cid, topics]) => {
              return [
                cid,
                topics.map(topic => {
                  if (topic.tid === tid) {
                    return {...topic, upvotes: topic.upvotes + delta};
                  }
                  return topic;
                }),
              ];
            }),
          ),
        };
      case 'UPVOTE_POST':
      case 'DOWNVOTE_POST':
        const delta2 = action.type === 'UPVOTE_POST' ? 1 : -1;
        const {pid} = action.payload;
        return {
          ...state,
          topicsMap: new Map(
            Array.from(state.topicsMap).map(([cid, topics]) => {
              return [
                cid,
                topics.map(topic => {
                  if (topic.mainPid === pid) {
                    return {...topic, upvotes: topic.upvotes + delta};
                  }
                  return topic;
                }),
              ];
            }),
          ),
        };
      default:
        return state;
    }
  };
  const initialGlobalState: GlobalState = {
    categories: [],
    topicsMap: new Map<number, Topic[]>(),
    postsMap: new Map<number, Post[]>(),
  };

  const [globalState, dispatch] = useReducer(globalReducer, initialGlobalState);

  return (
    <GlobalContext.Provider
      value={{
        globalState: globalState,
        dispatch: dispatch,
      }}>
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobalState() {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
