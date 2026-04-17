import { DragEvent, useState } from "react";
import styles from "@/app/page.module.css";
import { StatusMeta, Task, TaskStatus } from "./task-manager.types";
import { TaskCard } from "./task-card";

interface TaskBoardProps {
  statusMeta: StatusMeta[];
  tasks: Task[];
  onDeleteTask: (taskId: string) => void;
  onUpdateTaskStatus: (taskId: string, status: TaskStatus) => void;
}

export function TaskBoard({
  statusMeta,
  tasks,
  onDeleteTask,
  onUpdateTaskStatus,
}: TaskBoardProps) {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dropTargetStatus, setDropTargetStatus] = useState<TaskStatus | null>(null);

  const handleDragOver = (
    event: DragEvent<HTMLElement>,
    status: TaskStatus
  ) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setDropTargetStatus(status);
  };

  const handleDrop = (status: TaskStatus) => {
    if (draggedTaskId) {
      onUpdateTaskStatus(draggedTaskId, status);
    }

    setDraggedTaskId(null);
    setDropTargetStatus(null);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setDropTargetStatus(null);
  };

  return (
    <section className={styles.board}>
      {statusMeta.map((column) => {
        const columnTasks = tasks.filter((task) => task.status === column.key);
        const isDropTarget = dropTargetStatus === column.key;

        return (
          <section
            key={column.key}
            className={`${styles.column} ${isDropTarget ? styles.columnDropTarget : ""}`}
            onDragOver={(event) => handleDragOver(event, column.key)}
            onDragEnter={() => setDropTargetStatus(column.key)}
            onDragLeave={(event) => {
              const nextTarget = event.relatedTarget as Node | null;

              if (!event.currentTarget.contains(nextTarget)) {
                setDropTargetStatus((current) =>
                  current === column.key ? null : current
                );
              }
            }}
            onDrop={() => handleDrop(column.key)}
          >
            <header className={styles.columnHeader}>
              <div>
                <h2>{column.label}</h2>
                <p>{columnTasks.length} tasks</p>
              </div>
            </header>

            <div className={styles.cardStack}>
              {columnTasks.length === 0 ? (
                <div className={styles.emptyCard}>
                  No tasks here yet. New items will appear in this lane as work
                  moves forward.
                </div>
              ) : (
                columnTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    isDragging={draggedTaskId === task.id}
                    task={task}
                    onDelete={onDeleteTask}
                    onDragEnd={handleDragEnd}
                    onDragStart={setDraggedTaskId}
                    onStatusChange={onUpdateTaskStatus}
                  />
                ))
              )}
            </div>
          </section>
        );
      })}
    </section>
  );
}
