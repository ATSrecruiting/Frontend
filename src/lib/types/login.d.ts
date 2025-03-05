export interface LoginRequest {
    username: string;
    password: string;
}
export interface LoginResponse {
    success: boolean;
    error?: string;
    data?: {
        access_token: string;
        refresh_token: string;
    };
}