import bcrypt from 'bcrypt'
import { User } from '../types/models'
import { getUserByUsername } from '../firebase/CRUD/users'

const SALT_ROUNDS = 10

export const hashPassword = async (plainPassword: string): Promise<string> => {
  return bcrypt.hash(plainPassword, SALT_ROUNDS)
}

export const isPasswordValid = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hashedPassword)
}

export const authenticateUser = async (
  username: string,
  password: string
): Promise<User | null> => {
  const user = await getUserByUsername(username)
  if (!user) return null

  const isValid = await isPasswordValid(password, user.password)
  return isValid ? user : null
}