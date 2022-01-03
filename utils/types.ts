export type ViewSessions = Record<string, TodoSession>;

export interface Todo {
  completed: boolean;
  title: string;
  description: string;
  locked?: boolean;
  ownerID?: string;
  id: string;
}

export interface Collaborator {
  x: number;
  y: number;
  displayName: string;
}

export interface TodoSession {
  id: string;
  collaborators: Record<string, Collaborator>;
}

export interface UserInfo {
  email: string;
  displayName: string;
  uid: string;
}
