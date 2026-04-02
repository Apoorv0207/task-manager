export interface User {
  id: string
  name: string
  email: string
}

export interface Task {
  id: string
  title: string
  description: string | null
  status: string
  userId: string
  createdAt: string
  updatedAt: string
}

export interface PaginationInfo {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface TasksResponse {
  tasks: Task[]
  pagination: PaginationInfo
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
  message: string
}