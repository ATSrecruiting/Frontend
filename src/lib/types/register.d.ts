export interface RegisterForm {
    username: string;
    email: string;
    password: string;
}


export interface RegisterResponse {
    success: boolean;
    data?: {
      user_id: string;
      email?: string;
      username?: string;
    };
    error?: string;
  }