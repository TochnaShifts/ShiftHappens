import { AssignmentType, Gender, MultiplierType, RequestType } from "./enums"

// UserGroupRole is a helper type for group membership with role info
export type UserGroupRole = {
    groupId: string
    isAdmin: boolean
  }
  
  export interface User {
    id: string,
    username: string,
    password: string,
    name: string,
    isActive: boolean
    isGlobalAdmin?: boolean
    userCategories: string[] // IDs or slugs of categories
    groups: UserGroupRole[] // groups with admin flags
    gender: Gender
  }
  
  export interface Group {
    id: string
    displayName: string
    hasPointsTracking: boolean
    type: string // e.g., "guard", "logistics", etc.
  }
  
  export interface UserGroupPoints {
    id: string
    userId: string
    groupId: string
    count: number
    lastDate: string // ISO date string
  }
  
  export interface Shift {
    id: string
    groupId: string
    displayName: string
    startDate: string
    endDate: string
    includedUserCategories: string[]
    excludedUserCategories: string[]
    users: string[] // assigned user IDs
    points: number
    isFinished: boolean
  }
  
  export interface ShiftAssignment {
    id: string
    shiftId: string
    userId: string
    assignedBy: AssignmentType
    assignedAt: string
  }
  
  export interface Request {
    id: string
    userId: string
    startDate: string
    endDate: string
    type: RequestType
    description: string
  }
  
  export interface Template {
    id: string
    displayName: string
    includedUserCategories: string[]
    excludedUserCategories: string[]
    points: number
  }
  
  export interface UserCategory {
    id: string
    displayName: string
    pointsMultiplier: number
    multiplierType: MultiplierType
  }