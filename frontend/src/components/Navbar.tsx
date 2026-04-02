'use client'

import { useAuth } from '@/context/AuthContext'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { user, logout } = useAuth()

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '??'

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <div className={styles.brandIcon}>⚡</div>
          <span className={styles.brandName}>TaskFlow</span>
        </div>

        <div className={styles.right}>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user?.name}</span>
            <span className={styles.userEmail}>{user?.email}</span>
          </div>
          <div className={styles.avatar}>{initials}</div>
          <button onClick={logout} className={styles.logoutBtn}>
            Sign out
          </button>
        </div>
      </div>
    </nav>
  )
}