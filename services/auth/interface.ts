export interface ILoginRequest {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export interface IRegisterRequest {
    email: string;
    password: string;
    name: string;
}

export interface IAuthResponse {
    accessToken: string; 
    user: {
        id: string;
        email: string;
        name: string;
    };
}