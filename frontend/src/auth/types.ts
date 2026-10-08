export interface AuthUser {
  id: string;
  displayName: string;
  email: string;
  roles: string[];
  isActive: boolean;
  mustChangePassword: boolean;
}

export interface AccessTokenResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: AuthUser;
}

export interface ProblemDetails {
  status?: number;
  title?: string;
  detail?: string;
}
