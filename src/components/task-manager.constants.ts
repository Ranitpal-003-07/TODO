import { StatusMeta, TaskDraft, TaskSeverity } from "./task-manager.types";

export const STORAGE_KEY = "jira-spa-task-manager";

export const statusMeta: StatusMeta[] = [
  { key: "todo", label: "Todo" },
  { key: "in-progress", label: "In Progress" },
  { key: "testing", label: "Testing" },
  { key: "done", label: "Done" },
];

export const severityOptions: TaskSeverity[] = [
  "low",
  "medium",
  "high",
  "critical",
];

export const initialDraft: TaskDraft = {
  title: "",
  description: "",
  severity: "medium",
  deadline: "",
  attachments: [],
};
