import { AuthTokenDto } from "tweeter-shared";

export interface SessionsDao {
    createSession(handle: string): Promise<AuthTokenDto | null>;
    getSession(token: string): Promise<AuthTokenDto | null>;
    getHandleBySession(token: string): Promise<string>;
    deleteSession(token: string): Promise<void>;
    updateSession(token: string, currentTime: number): Promise<void>;
    checkTimeStampAndUpdate(auth_token: AuthTokenDto): Promise<void>;
}