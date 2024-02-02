export interface ThreadEntity {
  id: string;
  userId: string;
  title: string;
  questions: QuestionEntity[];
  knowledgeId: string;
  created: number;
  updated: number;
}

export interface QuestionEntity {
  question: string;
  answer: string | null;
  sources: SourceEntity[] | null;
  relatedQuestions: RelatedQuestionEntity | null;
  extra: [];
}

export interface RelatedQuestionEntity {
  question1: string;
  question2: string;
  question3: string;
}

export interface KnowledgeEntity {
  id: string;
  userId?: string;
  threadId?: string;
  title?: string;
  content?: string;
  classification?: string[];
  created: number;
  updated: number;
}

export interface SourceEntity {
  title: string;
  url: string;
}

export interface StreamMessage {
  type: string; // 'source' | 'answer' | 'relatedQuestion'
  data: any;
}
