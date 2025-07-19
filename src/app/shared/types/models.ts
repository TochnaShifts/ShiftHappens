import { AssignmentType, Gender, MultiplierType, RequestType, ShiftStatus } from "./enums"

// UserGroupRole is a helper type for group membership with role info
export type UserGroupRole = {
    groupId: string
    isAdmin: boolean,
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
    gender: Gender,
    createdAt: Date 
  }
  
  export interface Group {
    id: string
    displayName: string
    hasPointsTracking: boolean
    type: string // e.g., "guard", "logistics", etc.,
    createdAt: Date
  }
  
  export interface UserGroupPoints {
    id: string
    userId: string
    groupId: string
    count: number
    lastDate: Date // ISO date string,
  }
  
  export interface Shift {
    id: string
    groupId: string
    displayName: string
    startDate: Date
    endDate: Date
    includedUserCategories: string[]
    excludedUserCategories: string[]
    users: string[] // assigned user IDs
    points: number
    status: ShiftStatus
    createdAt: Date
  }
  
  export interface ShiftAssignment {
    id: string
    shiftId: string
    userId: string
    assignedBy: AssignmentType
    assignedAt: Date
  }
  
  export interface Request {
    id: string
    userId: string
    startDate: Date
    endDate: Date
    type: RequestType
    description: string
    createdAt: Date
  }
  
  
  export interface Template {
    id: string
    displayName: string
    includedUserCategories: string[]
    excludedUserCategories: string[]
    points: number
    createdAt: Date
  }
  
  export interface UserCategory {
    id: string
    displayName: string
    pointsMultiplier: number
    multiplierType: MultiplierType
    createdAt: Date
  }