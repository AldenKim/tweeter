import { User, UserDto } from "tweeter-shared";

export interface UsersDao {
    getUser(handle: string): Promise<UserDto | null>;
    addUser(newUser: User, password: string): Promise<UserDto | null>;
    getPassword(handle: string): Promise<string | null>;
}