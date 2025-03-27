import { UsersDao } from "./UsersDao";

export interface DaoFactory {
    createUsersDao(): UsersDao; 
}