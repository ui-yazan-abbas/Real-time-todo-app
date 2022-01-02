export type ViewSessions = Record<string, TodoSession>;

export interface Todo {
  completed: boolean;
  title: string;
  description: string;
  locked?: boolean;
  ownerID?: string;
  id: string;
}

export interface TodoSession {
  collaborators: Record<string, { x: number; y: number }>;
}

export interface UserInfo {
  email: string;
  displayName: string;
  uid: string;
}
