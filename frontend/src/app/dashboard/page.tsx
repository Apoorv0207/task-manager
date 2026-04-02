'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import api from '@/lib/axios'
import { useAuth } from '@/context/AuthContext'
import { Task, TasksResponse } from '@/types'
import Navbar from '@/components/Navbar'
import TaskCard from '@/components/TaskCard'
import TaskModal from '@/components/TaskModal'
import styles from './dashboard.module.css'

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  const [tasks, setTasks] = useState<Task[]>([])
  const [totalTasks, setTotalTasks] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [fetching, setFetching] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editTask, setEditTask] = useState<Task | null>(null)
  const [modalLoading, setModalLoading] = useState(false)

  const completedCount = tasks.filter((t) => t.status === 'completed').length
  const pendingCount = tasks.filter((t) => t.status === 'pending').length

  const fetchTasks = useCallback(async () => {
    setFetching(true)
    try {
      const params: Record<string, string> = {
        page: String(currentPage),
        limit: '9',
      }
      if (search) params.search = search
      if (statusFilter) params.status = statusFilter

      const res = await api.get<TasksResponse>('/tasks', { params })
      setTasks(res.data.tasks)
      setTotalTasks(res.data.pagination.total)
      setTotalPages(res.data.pagination.totalPages)
    } catch {
      toast.error('Failed to load tasks')
    } finally {
      setFetching(false)
    }
  }, [currentPage, search, statusFilter])

  useEffect(() => {
    if (!isLoading && !user) router.push('/login')
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) fetchTasks()
  }, [fetchTasks, user])

  const handleCreate = async (data: { title: string; description: string }) => {
    setModalLoading(true)
    try {
      await api.post('/tasks', data)
      toast.success('Task created!')
      setIsModalOpen(false)
      fetchTasks()
    } catch {
      toast.error('Failed to create task')
    } finally {
      setModalLoading(false)
    }
  }

  const handleEdit = async (data: { title: string; description: string }) => {
    if (!editTask) return
    setModalLoading(true)
    try {
      await api.patch(`/tasks/${editTask.id}`, data)
      toast.success('Task updated!')
      setEditTask(null)
      setIsModalOpen(false)
      fetchTasks()
    } catch {
      toast.error('Failed to update task')
    } finally {
      setModalLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this task?')) return
    try {
      await api.delete(`/tasks/${id}`)
      toast.success('Task deleted')
      fetchTasks()
    } catch {
      toast.error('Failed to delete task')
    }
  }

  const handleToggle = async (id: string) => {
    try {
      await api.patch(`/tasks/${id}/toggle`)
      fetchTasks()
    } catch {
      toast.error('Failed to update task')
    }
  }

  const openEdit = (task: Task) => {
    setEditTask(task)
    setIsModalOpen(true)
  }

  const openCreate = () => {
    setEditTask(null)
    setIsModalOpen(true)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setCurrentPage(1)
  }

  const handleFilter = (filter: string) => {
    setStatusFilter(filter === statusFilter ? '' : filter)
    setCurrentPage(1)
  }

  const getGreeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  if (isLoading) return null

  return (
    <div className={styles.page}>
      <div className={styles.bgOrb1} />
      <div className={styles.bgOrb2} />

      <Navbar />

      <main className={styles.main}>

        {/* Header */}
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>
              {getGreeting()},{' '}
              <span className={styles.gradientText}>
                {user?.name?.split(' ')[0]}
              </span>{' '}
              👋
            </h1>
            <p className={styles.pageSubtitle}>
              {totalTasks === 0
                ? 'No tasks yet — create your first one!'
                : `You have ${pendingCount} pending and ${completedCount} completed tasks`}
            </p>
          </div>
          <button className={styles.newTaskBtn} onClick={openCreate}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 2V14M2 8H14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            New task
          </button>
        </div>

        {/* Stats */}
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <div
              className={styles.statIcon}
              style={{ background: 'rgba(124, 58, 237, 0.15)', color: '#a78bfa' }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="2" y="2" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M5.5 9H12.5M5.5 6H12.5M5.5 12H9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <p className={styles.statValue}>{totalTasks}</p>
              <p className={styles.statLabel}>Total tasks</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div
              className={styles.statIcon}
              style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M9 5V9L11.5 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <p className={styles.statValue}>{pendingCount}</p>
              <p className={styles.statLabel}>Pending</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div
              className={styles.statIcon}
              style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M5.5 9L7.5 11L12.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <p className={styles.statValue}>{completedCount}</p>
              <p className={styles.statLabel}>Completed</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div
              className={styles.statIcon}
              style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee' }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 2L11 7H16L12 10.5L13.5 16L9 13L4.5 16L6 10.5L2 7H7L9 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <p className={styles.statValue}>
                {totalTasks > 0
                  ? Math.round((completedCount / totalTasks) * 100)
                  : 0}%
              </p>
              <p className={styles.statLabel}>Completion</p>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className={styles.controls}>
          <div className={styles.searchWrap}>
            <svg
              className={styles.searchIcon}
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M10.5 10.5L13.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={handleSearch}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filters}>
            <button
              className={`${styles.filterBtn} ${statusFilter === '' ? styles.filterActive : ''}`}
              onClick={() => handleFilter('')}
            >
              All
            </button>
            <button
              className={`${styles.filterBtn} ${statusFilter === 'pending' ? styles.filterActivePending : ''}`}
              onClick={() => handleFilter('pending')}
            >
              Pending
            </button>
            <button
              className={`${styles.filterBtn} ${statusFilter === 'completed' ? styles.filterActiveDone : ''}`}
              onClick={() => handleFilter('completed')}
            >
              Completed
            </button>
          </div>
        </div>

        {/* Tasks Grid */}
        {fetching ? (
          <div className={styles.loadingWrap}>
            <div className={styles.loadingSpinner} />
            <p className={styles.loadingText}>Loading tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📋</div>
            <h3 className={styles.emptyTitle}>No tasks found</h3>
            <p className={styles.emptySubtitle}>
              {search || statusFilter
                ? 'Try changing your filters'
                : 'Create your first task to get started'}
            </p>
            {!search && !statusFilter && (
              <button className={styles.emptyBtn} onClick={openCreate}>
                Create task
              </button>
            )}
          </div>
        ) : (
          <div className={styles.grid}>
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={openEdit}
                onDelete={handleDelete}
                onToggle={handleToggle}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              className={styles.pageBtn}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              ← Prev
            </button>
            <div className={styles.pageNumbers}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={`${styles.pageNum} ${p === currentPage ? styles.pageNumActive : ''}`}
                  onClick={() => setCurrentPage(p)}
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              className={styles.pageBtn}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next →
            </button>
          </div>
        )}
      </main>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditTask(null)
        }}
        onSubmit={editTask ? handleEdit : handleCreate}
        editTask={editTask}
        loading={modalLoading}
      />
    </div>
  )
}