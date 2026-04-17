import styles from "@/app/page.module.css";
import { StatusMeta, TaskStatus } from "./task-manager.types";

interface TaskManagerHeroProps {
  statusCounts: Record<TaskStatus, number>;
  statusMeta: StatusMeta[];
}

export function TaskManagerHero({
  statusCounts,
  statusMeta,
}: TaskManagerHeroProps) {
  const totalTasks = Object.values(statusCounts).reduce(
    (total, count) => total + count,
    0
  );

  return (
    <section className={styles.hero}>
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}>Orbit Ops / board runtime</p>
        <h1>Build. Track. Ship.</h1>
        <p className={styles.heroText}>
          A vivid control surface for tasks, bugs, and launch-day chaos.
        </p>

        <div className={styles.heroChips}>
          <span>kanban</span>
          <span>drag-drop</span>
          <span>local-first</span>
          <span>dev mode</span>
        </div>

        <div className={styles.heroPulseRow}>
          <div className={styles.heroPulseCard}>
            <span>runtime</span>
            <strong>{totalTasks === 0 ? "idle" : "tracking"}</strong>
          </div>
          <div className={styles.heroPulseCard}>
            <span>theme</span>
            <strong>adaptive</strong>
          </div>
        </div>

        <div className={styles.metrics}>
          <article className={`${styles.metricCard} ${styles.metricCardWide}`}>
            <span>Active tasks</span>
            <strong>{totalTasks}</strong>
          </article>

          {statusMeta.map((column) => (
            <article key={column.key} className={styles.metricCard}>
              <span>{column.label}</span>
              <strong>{statusCounts[column.key]}</strong>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
