import { AuthTokenDto } from "tweeter-shared";

export interface SessionsDao {
    createSession(): Promise<AuthTokenDto | null>;
    getSession(token: string): Promise<AuthTokenDto | null>;
    deleteSession(token: string): Promise<void>;
    updateSession(token: string, currentTime: number): Promise<void>;
    checkTimeStampAndUpdate(auth_token: AuthTokenDto): Promise<boolean>;
}