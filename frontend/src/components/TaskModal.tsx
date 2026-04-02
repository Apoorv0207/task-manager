'use client'

import { useState, useEffect } from 'react'
import { Task } from '@/types'
import styles from './TaskModal.module.css'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { title: string; description: string }) => void
  editTask?: Task | null
  loading: boolean
}

export default function TaskModal({ isOpen, onClose, onSubmit, editTask, loading }: Props) {
  const [form, setForm] = useState({ title: '', description: '' })

  useEffect(() => {
    if (editTask) {
      setForm({ title: editTask.title, description: editTask.description || '' })
    } else {
      setForm({ title: '', description: '' })
    }
  }, [editTask, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) return
    onSubmit(form)
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalGlow} />

        <div className={styles.header}>
          <h2 className={styles.modalTitle}>
            {editTask ? 'Edit task' : 'New task'}
          </h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="What needs to be done?"
              className={styles.input}
              autoFocus
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              Description{' '}
              <span className={styles.optional}>(optional)</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Add more details..."
              className={styles.textarea}
              rows={3}
            />
          </div>

          <div className={styles.modalActions}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? (
                <span className={styles.spinner} />
              ) : editTask ? (
                'Save changes'
              ) : (
                'Create task'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}