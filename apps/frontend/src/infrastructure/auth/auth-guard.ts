import { getSession } from "./auth-session"

export async function isAuthenticated() {
  try {
    await getSession()
    return true
  } catch (error) {
    return false
  }
}