export interface RegisterInput {
    email: string;
    password: string;
    name: string;
}

export class AuthService {

    public async register(data: RegisterInput) {

        return {
            message: "User registered successfully",
            user: {
                id: 1,
                email: data.email,
                name: data.name
            },
            accessToken: "fake-access-token-123"
        };
    }

    public async login(email: string, password: string) {

        if (email !== "admin@example.com" || password !== "123456") {
            throw new Error("Invalid credentials");
        }

        return {
            message: "Login successful",
            user: {
                id: 1,
                email: "admin@example.com",
                name: "Admin User"
            },
            accessToken: "fake-access-token-123",
            refreshToken: "fake-refresh-token-456"
        };
    }

    public async refresh(refreshToken: string) {

        if (refreshToken !== "fake-refresh-token-456") {
            throw new Error("Invalid refresh token");
        }

        return {
            message: "Token refreshed",
            accessToken: "new-fake-access-token-789"
        };
    }

    public async logout(user: any) {

        return {
            message: "User logged out"
        };
    }
}
