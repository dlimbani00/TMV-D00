export type UserRole = 'ADMIN' | 'INSTRUCTOR' | 'PARTICIPANT'

const ROLE_KEY = 'empsurvey_role'

export function getUserRole(): UserRole {
  const role = localStorage.getItem(ROLE_KEY) as UserRole | null
  return role ?? 'ADMIN'
}

export function setUserRole(role: UserRole): void {
  localStorage.setItem(ROLE_KEY, role)
}

export function canAuthorSurveys(role: UserRole): boolean {
  return role === 'ADMIN'
}
