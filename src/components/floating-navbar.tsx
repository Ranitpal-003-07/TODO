import { ReactNode } from "react";
import styles from "@/app/page.module.css";
import { ThemeMode } from "./task-manager.types";

interface FloatingNavbarProps {
  themeMode: ThemeMode;
  onThemeChange: (mode: ThemeMode) => void;
}

const themeOptions: Array<{
  label: ThemeMode;
  title: string;
  icon: ReactNode;
}> = [
  {
    label: "light",
    title: "Light theme",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2.5v2.2M12 19.3v2.2M21.5 12h-2.2M4.7 12H2.5M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6M18.7 18.7l-1.6-1.6M6.9 6.9L5.3 5.3" />
      </svg>
    ),
  },
  {
    label: "system",
    title: "System theme",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="5" width="16" height="11" rx="2" />
        <path d="M9 19h6M12 16v3" />
      </svg>
    ),
  },
  {
    label: "dark",
    title: "Dark theme",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19 14.8A7.8 7.8 0 0 1 9.2 5a8.5 8.5 0 1 0 9.8 9.8Z" />
      </svg>
    ),
  },
];

export function FloatingNavbar({
  themeMode,
  onThemeChange,
}: FloatingNavbarProps) {
  return (
    <header className={styles.navbarWrap}>
      <div className={styles.navbar}>
        <div className={styles.brandBlock}>
          <div className={styles.brandMark}>OO</div>
          <div className={styles.brandText}>
            <p className={styles.brandName}>Orbit Ops</p>
            <span className={styles.brandTag}>task grid</span>
          </div>
        </div>

        <div
          className={styles.themeSwitcher}
          role="tablist"
          aria-label="Theme selector"
        >
          {themeOptions.map((option) => (
            <button
              key={option.label}
              type="button"
              title={option.title}
              aria-label={option.title}
              aria-pressed={themeMode === option.label}
              className={`${styles.themeButton} ${
                themeMode === option.label ? styles.themeButtonActive : ""
              }`}
              onClick={() => onThemeChange(option.label)}
            >
              {option.icon}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
