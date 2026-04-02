'use client'

import { Task } from '@/types'
import styles from './TaskCard.module.css'

interface Props {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onToggle: (id: string) => void
}

export default function TaskCard({ task, onEdit, onDelete, onToggle }: Props) {
  const isCompleted = task.status === 'completed'

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className={`${styles.card} ${isCompleted ? styles.completed : ''}`}>

      {/* Top accent line */}
      <div className={`${styles.accentLine} ${isCompleted ? styles.accentGreen : styles.accentPurple}`} />

      {/* Header row — badge + action buttons */}
      <div className={styles.topRow}>
        <span className={`${styles.badge} ${isCompleted ? styles.badgeDone : styles.badgePending}`}>
          {isCompleted ? '✓ Completed' : '● Pending'}
        </span>

        <div className={styles.actions}>
          <button
            className={styles.toggleBtn}
            onClick={() => onToggle(task.id)}
            title={isCompleted ? 'Mark pending' : 'Mark complete'}
          >
            {isCompleted ? '↩ Undo' : '✓ Done'}
          </button>
          <button
            className={styles.editBtn}
            onClick={() => onEdit(task)}
            title="Edit task"
          >
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path d="M9.5 2.5L11.5 4.5L5 11H3V9L9.5 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button
            className={styles.deleteBtn}
            onClick={() => onDelete(task.id)}
            title="Delete task"
          >
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path d="M2 3.5H12M5 3.5V2.5H9V3.5M5.5 6V10M8.5 6V10M3 3.5L3.5 11.5H10.5L11 3.5H3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Title */}
      <h3 className={`${styles.title} ${isCompleted ? styles.titleDone : ''}`}>
        {task.title}
      </h3>

      {/* Description */}
      {task.description && (
        <p className={styles.description}>{task.description}</p>
      )}

      {/* Footer — date */}
      <div className={styles.footer}>
        <span className={styles.date}>{formatDate(task.createdAt)}</span>
      </div>

    </div>
  )
}