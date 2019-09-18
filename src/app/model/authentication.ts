export class LoginRequest {
    userName: string;
    passWord: string;
}

export class LoginResponse {
    token: string;
}

export class Authenticate {
    userName: string;
    passWord: string;
    token?: string;
    role?: string;
    errorMsg?: string;
    fullName?: string;
}