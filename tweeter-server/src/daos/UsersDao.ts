import { UserDto } from "tweeter-shared";

export interface UsersDao {
    getUser(handle: string): Promise<UserDto | null>;
    //addUser(newUser: UserDto): Promise<UserDto | null>;
    getPassword(handle: string): Promise<string | null>;
}