import { ChangeEvent, FormEvent } from "react";
import styles from "@/app/page.module.css";
import { severityOptions } from "./task-manager.constants";
import { TaskDraft, TaskSeverity } from "./task-manager.types";

interface TaskComposerProps {
  draft: TaskDraft;
  isUploading: boolean;
  onAttachmentChange: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
  onDraftChange: (
    field: keyof Omit<TaskDraft, "attachments">,
    value: string
  ) => void;
  onRemoveAttachment: (attachmentId: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function TaskComposer({
  draft,
  isUploading,
  onAttachmentChange,
  onDraftChange,
  onRemoveAttachment,
  onSubmit,
}: TaskComposerProps) {
  return (
    <form className={styles.composer} onSubmit={onSubmit}>
      <div className={styles.sectionHeading}>
        <p className={styles.composerEyebrow}>Quick create</p>
        <h2>New task</h2>
      </div>

      <label className={styles.field}>
        <span>Title</span>
        <input
          type="text"
          placeholder="Sprint planning polish"
          value={draft.title}
          onChange={(event) => onDraftChange("title", event.target.value)}
        />
      </label>

      <label className={styles.field}>
        <span>Details</span>
        <textarea
          rows={4}
          placeholder="Acceptance criteria, blockers, links..."
          value={draft.description}
          onChange={(event) => onDraftChange("description", event.target.value)}
        />
      </label>

      <div className={styles.splitFields}>
        <label className={styles.field}>
          <span>Severity</span>
          <select
            value={draft.severity}
            onChange={(event) =>
              onDraftChange("severity", event.target.value as TaskSeverity)
            }
          >
            {severityOptions.map((severity) => (
              <option key={severity} value={severity}>
                {severity}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span>Deadline</span>
          <input
            type="date"
            value={draft.deadline}
            onChange={(event) => onDraftChange("deadline", event.target.value)}
          />
        </label>
      </div>

      <div className={styles.field}>
        <span>Files</span>
        <label className={styles.uploadBox}>
          <input
            type="file"
            multiple
            onChange={onAttachmentChange}
            className={styles.fileInput}
          />
          <strong>{isUploading ? "Uploading..." : "Add attachments"}</strong>
        </label>
      </div>

      {draft.attachments.length > 0 ? (
        <div className={styles.attachmentList}>
          {draft.attachments.map((attachment) => (
            <div key={attachment.id} className={styles.attachmentChip}>
              <div>
                <strong>{attachment.name}</strong>
                <span>{Math.ceil(attachment.size / 1024)} KB</span>
              </div>
              <button
                type="button"
                onClick={() => onRemoveAttachment(attachment.id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : null}

      <button type="submit" className={styles.createButton}>
        Create task
      </button>
    </form>
  );
}
