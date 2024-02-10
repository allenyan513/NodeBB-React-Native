export interface NodeBBResponse<T> {
  status: NodeBBStatus;
  response: T;
}

export interface NodeBBStatus {
  code: number;
  message: string;
}

export interface CategoriesPostsResponse {
  posts: Post[];
}

export interface TopicsResponse {
  topics: Topic[];
  nextStart: 0;
  topicCount: 0;
}

export interface CategoriesTopicsResponse {
  topics: Topic[];
  nextStart: 0;
  privileges: any;
}

export interface CategoriesResponse {
  categories: Category[];
}

export interface User {
  uid: number;
  username: string;
  userslug: string;
  email: string;
  emailConfirmed: number;
  joinDate: number;
  lastOnline: number;
  picture: string;
  fullname: string;
  displayName: string;
  location: string;
  birthday: string;
  website: string;
  aboutMe: string;
  signature: string;
  uploadedPicture: string;
  profileViews: number;
  reputation: number;
  postCount: number;
  topicCount: number;
  lastPostTime: number;
  banned: number;
  bannedExpire: number;
  status: string;
  flags: number;
  followerCount: number;
  followingCount: number;
  coverUrl: string;
  coverPosition: string;
  groupTitle: string;
  groupTitleArray: string[];
  iconText: string;
  iconBgColor: string;
  joinDateISO: string;
  lastOnlineISO: string;
  bannedUntil: number;
  bannedUntilReadable: string;
  verifyToken: string; //重要 用于api请求
}

export interface Category {
  cid: number;
  name: string;
  description: string;
  descriptionParsed: string;
  icon: string;
  bgColor: string;
  color: string;
  slug: string;
  parentCid: number;
  topic_count: number;
  post_count: number;
  disabled: boolean;
  order: number;
  link: string;
  numRecentReplies: number;
  class: string;
  isSection: boolean;
  minTags: number;
  maxTags: number;
  postQueue: number;
  totalPostCount: number;
  totalTopicCount: number;
  subCategoriesPerPage: number;
  backgroundImage: string;
}

export interface PostTopicRequest {
  cid: number;
  title: string;
  content: string;
  timestamp?: number;
  tags?: string[];
  multimedia?: MultiMedia;
}

export interface MultiMedia {
  images: string[];
  videos: string[];
  audios: string[];
}

export interface Topic {
  tid: number;
  uid: number;
  cid: number;
  title: string;
  content: string; //帖子内容前200
  slug: string;
  mainPid: number;
  postcount: number;
  viewcount: number;
  postercount: number;
  scheduled: number;
  deleted: number;
  deleterUid: number;
  titleRaw: string;
  locked: number;
  pinned: number;
  timestamp: number;
  timestampISO: string;
  lastposttime: number;
  lastposttimeISO: string;
  pinExpiry: number;
  pinExpiryISO: string;
  upvotes: number;
  downvotes: number;
  votes: number;
  teaserPid: number;
  thumbs: [];
  numThumbs: number;
  posts: Post[];
  category: Category;
  user: User;
  author: User;
  teaser: Post;
  tags: [];
  isOwner: boolean;
  ignored: boolean;
  unread: boolean;
  bookmark: number;
  unreplied: boolean;
  icons: [];
  thumb: string;
  index: number;
  topicThumb: string; //主题首张图
  multimedia: MultiMedia; //多媒体资源
}

export interface Post {
  pid: number;
  tid: number;
  content: string;
  uid: number;
  timestamp: number;
  deleted: boolean;
  upvotes: number;
  downvotes: number;
  votes: number;
  timestampISO: string;
  user: User;
  topic: Topic;
  category: Category;
  isMainPost: boolean;
  replies: number;

  title: string; //当第一个帖子是主题帖时，title为主题帖标题
  multimedia: MultiMedia; //多媒体资源
}

export interface Tag {
  value: string;
  valueEscaped: string;
  color: string;
  bgColor: string;
  score: number;
}

export interface GetNotificationsResponse {
  notifications: Notification[];
}

export interface Notification {
  bodyShort: string;
  path: string;
  nid: string;
  from: number;
  importance: number;
  datetime: number;
  datetimeISO: string;
  user: User;
  image: string;
  read: boolean;
  readClass: string;
}

export interface ExchangeVerifyTokenResponse {
  uid: number;
  verifyToken: string;
}

export interface TopicState {
  topics: Topic[];
}

export type TopicAction =
  | {
      type: 'SET_TOPICS';
      payload: Topic[];
    }
  | {
      type: 'UPVOTE';
      payload: {
        tid: number;
        delta: number;
      };
    }
  | {
      type: 'DOWNVOTE';
      payload: {
        tid: number;
        delta: number;
      };
    }
  | {type: 'UNVOTE'};

export interface ReplyTopicRequest {
  content: string;
  toPid?: number;
}

export interface HomeTopTab {
  cid: string | number;
  name: string;
  selected: boolean;
}
