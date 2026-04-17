export type TaskStatus = "todo" | "in-progress" | "testing" | "done";
export type TaskSeverity = "low" | "medium" | "high" | "critical";

export interface TaskAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  dataUrl: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  severity: TaskSeverity;
  deadline: string;
  status: TaskStatus;
  attachments: TaskAttachment[];
  createdAt: string;
}

export interface TaskDraft {
  title: string;
  description: string;
  severity: TaskSeverity;
  deadline: string;
  attachments: TaskAttachment[];
}

export interface StatusMeta {
  key: TaskStatus;
  label: string;
}

export type ThemeMode = "light" | "dark" | "system";
