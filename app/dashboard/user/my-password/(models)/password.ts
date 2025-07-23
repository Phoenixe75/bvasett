export interface IFormProps {
    oldPassword: string;
    newPassword: string;
}

export interface ISetFormProps {
    mobile: string;
    password: string;
}

export interface ISetPasswordProps {
    id: number | null;
    newPassword: string;
}

export interface IChangePasswordProps {
    id: number | null;
    oldPassword: string;
    newPassword: string;
}
