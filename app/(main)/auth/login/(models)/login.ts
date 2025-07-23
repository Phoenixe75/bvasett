export interface ICheckUser {
    mobile: string;
}

export interface IVerifyOtp {
    mobile: string;
    code: number;
}

export interface IAuthenticatePassword {
    mobile: string;
    password: string;
}

export interface AuthenticateResponse {
    token: string;
}
