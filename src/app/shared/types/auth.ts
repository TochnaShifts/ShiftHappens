import { Gender } from "./enums"

export interface UserLogin {
    username: string
    password: string
}

export interface UserRegister {
    username: string
    password: string,
    confirmPassword: string,
    fullName: string
    gender: Gender
    userCategories: string[]
    selectedGroups: string[]
}