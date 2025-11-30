export interface InfographicRequest {
  topic: string;
  subject: string;
  grade: string;
  contextText: string;
  contextImages: File[];
}

export interface GeneratedImage {
  id: string;
  url: string;
  type: 'horizontal' | 'vertical' | 'lineart';
  description: string;
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  GENERATING = 'GENERATING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}