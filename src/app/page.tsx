"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import styles from "./page.module.css";
import { TaskBoard } from "@/components/task-board";
import { TaskComposer } from "@/components/task-composer";
import { FloatingNavbar } from "@/components/floating-navbar";
import {
  initialDraft,
  statusMeta,
  STORAGE_KEY,
} from "@/components/task-manager.constants";
import { TaskManagerHero } from "@/components/task-manager-hero";
import {
  Task,
  TaskAttachment,
  TaskDraft,
  ThemeMode,
  TaskStatus,
} from "@/components/task-manager.types";
import { readFileAsDataUrl } from "@/components/task-manager.utils";

const THEME_STORAGE_KEY = "orbit-ops-theme";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window === "undefined") return [];

    const savedTasks = window.localStorage.getItem(STORAGE_KEY);
    if (!savedTasks) return [];

    try {
      return JSON.parse(savedTasks) as Task[];
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
      return [];
    }
  });
  const [draft, setDraft] = useState<TaskDraft>(initialDraft);
  const [isUploading, setIsUploading] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return "dark";

    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

    return savedTheme === "light" ||
      savedTheme === "dark" ||
      savedTheme === "system"
      ? savedTheme
      : "dark";
  });
  const hasPersistedRef = useRef(false);

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      const resolvedTheme =
        themeMode === "system"
          ? mediaQuery.matches
            ? "dark"
            : "light"
          : themeMode;

      root.dataset.theme = resolvedTheme;
      root.style.colorScheme = resolvedTheme;
    };

    applyTheme();

    if (themeMode !== "system") {
      window.localStorage.setItem(THEME_STORAGE_KEY, themeMode);
      return;
    }

    window.localStorage.setItem(THEME_STORAGE_KEY, "system");
    mediaQuery.addEventListener("change", applyTheme);

    return () => mediaQuery.removeEventListener("change", applyTheme);
  }, [themeMode]);

  useEffect(() => {
    if (!hasPersistedRef.current) {
      hasPersistedRef.current = true;
      return;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const statusCounts = useMemo(() => {
    return statusMeta.reduce<Record<TaskStatus, number>>(
      (acc, column) => {
        acc[column.key] = tasks.filter((task) => task.status === column.key).length;
        return acc;
      },
      {
        todo: 0,
        "in-progress": 0,
        testing: 0,
        done: 0,
      }
    );
  }, [tasks]);

  const handleDraftChange = (
    field: keyof Omit<TaskDraft, "attachments">,
    value: string
  ) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const handleAttachmentChange = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    setIsUploading(true);

    try {
      const attachments = await Promise.all(
        files.map(async (file) => {
          const attachment: TaskAttachment = {
            id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
            name: file.name,
            type: file.type || "application/octet-stream",
            size: file.size,
            dataUrl: await readFileAsDataUrl(file),
          };

          return attachment;
        })
      );

      setDraft((current) => ({
        ...current,
        attachments: [...current.attachments, ...attachments],
      }));
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const removeAttachment = (attachmentId: string) => {
    setDraft((current) => ({
      ...current,
      attachments: current.attachments.filter(
        (attachment) => attachment.id !== attachmentId
      ),
    }));
  };

  const createTask = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!draft.title.trim() || !draft.description.trim()) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: draft.title.trim(),
      description: draft.description.trim(),
      severity: draft.severity,
      deadline: draft.deadline,
      status: "todo",
      attachments: draft.attachments,
      createdAt: new Date().toISOString(),
    };

    setTasks((current) => [newTask, ...current]);
    setDraft(initialDraft);
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    setTasks((current) =>
      current.map((task) => (task.id === taskId ? { ...task, status } : task))
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks((current) => current.filter((task) => task.id !== taskId));
  };

  return (
    <main className={styles.page}>
      <FloatingNavbar themeMode={themeMode} onThemeChange={setThemeMode} />
      <section className={styles.topStage}>
        <TaskManagerHero statusCounts={statusCounts} statusMeta={statusMeta} />
        <TaskComposer
          draft={draft}
          isUploading={isUploading}
          onAttachmentChange={handleAttachmentChange}
          onDraftChange={handleDraftChange}
          onRemoveAttachment={removeAttachment}
          onSubmit={createTask}
        />
      </section>

      <section className={styles.workspace}>
        <TaskBoard
          statusMeta={statusMeta}
          tasks={tasks}
          onDeleteTask={deleteTask}
          onUpdateTaskStatus={updateTaskStatus}
        />
      </section>
    </main>
  );
}
