import { Role } from '../../types/types'

export interface User {
    id: number,
    first_name: string,
    last_name: string,
    username: string,
    password: string,
    email: string,
    role_id: Role
}