export interface UserDto {
    id: string;
    email: string;
    fullName: string;
    phone: string;
    roleId: string;
    roleName: string;
    status: string;
    createdAt: Date;
}

export interface CreateUserRequest {
    email: string;
    password: string;
    fullName: string;
    phone: string;
    roleId: string;
}

export interface Role {
    id: string;
    name: string;
    description: string;
}
