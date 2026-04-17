import { DragEvent } from "react";
import styles from "@/app/page.module.css";
import { statusMeta } from "./task-manager.constants";
import { Task, TaskStatus } from "./task-manager.types";
import { formatDate } from "./task-manager.utils";

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
  onDelete: (taskId: string) => void;
  onDragStart: (taskId: string) => void;
  onDragEnd: () => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
}

export function TaskCard({
  task,
  isDragging = false,
  onDelete,
  onDragStart,
  onDragEnd,
  onStatusChange,
}: TaskCardProps) {
  const handleDragStart = (event: DragEvent<HTMLElement>) => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", task.id);
    onDragStart(task.id);
  };

  return (
    <article
      draggable
      className={`${styles.taskCard} ${isDragging ? styles.taskCardDragging : ""}`}
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
    >
      <div className={styles.cardTop}>
        <div className={styles.cardTopLeft}>
          <span
            className={`${styles.severityBadge} ${styles[`severity-${task.severity}`]}`}
          >
            {task.severity}
          </span>
          <span className={styles.dragHint}>drag</span>
        </div>

        <button
          type="button"
          className={styles.deleteButton}
          onClick={() => onDelete(task.id)}
          aria-label="Delete task"
          title="Delete task"
        >
          ×
        </button>
      </div>

      <div className={styles.cardBody}>
        <h3>{task.title}</h3>
        <p>{task.description}</p>
      </div>

      <div className={styles.metaRow}>
        <span>{formatDate(task.deadline)}</span>
        <span>{task.attachments.length} files</span>
      </div>

      {task.attachments.length > 0 ? (
        <div className={styles.attachmentPreviewList}>
          {task.attachments.map((attachment) => (
            <a
              key={attachment.id}
              href={attachment.dataUrl}
              download={attachment.name}
              className={styles.attachmentLink}
            >
              {attachment.name}
            </a>
          ))}
        </div>
      ) : null}

      <label className={styles.statusControl}>
        <span>Lane</span>
        <select
          value={task.status}
          onChange={(event) =>
            onStatusChange(task.id, event.target.value as TaskStatus)
          }
        >
          {statusMeta.map((status) => (
            <option key={status.key} value={status.key}>
              {status.label}
            </option>
          ))}
        </select>
      </label>
    </article>
  );
}
