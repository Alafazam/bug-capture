import { Session } from 'next-auth';

// User role types
export type UserRole = 'USER' | 'ADMIN' | 'MODERATOR';

// User profile interface
export interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: UserRole;
  bio?: string;
  location?: string;
  website?: string;
  company?: string;
  jobTitle?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  lastActiveAt?: Date;
}

// Extended session interface
export interface ExtendedSession extends Session {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    role: UserRole;
  };
}

// Authentication state
export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Login credentials
export interface LoginCredentials {
  email: string;
  password: string;
}

// Registration data
export interface RegistrationData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Password change data
export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

// Profile update data
export interface ProfileUpdateData {
  name?: string;
  email?: string;
  bio?: string;
  location?: string;
  website?: string;
  company?: string;
  jobTitle?: string;
  image?: string;
}

// User preferences
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    marketing: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends';
    showEmail: boolean;
    showLocation: boolean;
  };
}

// Authentication response
export interface AuthResponse {
  success: boolean;
  user?: UserProfile;
  error?: string;
  message?: string;
}

// Password reset request
export interface PasswordResetRequest {
  email: string;
}

// Password reset data
export interface PasswordResetData {
  token: string;
  password: string;
  confirmPassword: string;
}

// Email verification
export interface EmailVerification {
  token: string;
}

// OAuth provider types
export type OAuthProvider = 'google' | 'github' | 'facebook' | 'twitter';

// OAuth account data
export interface OAuthAccount {
  provider: OAuthProvider;
  providerAccountId: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
}

// Session data
export interface SessionData {
  id: string;
  sessionToken: string;
  userId: string;
  expires: Date;
  user: UserProfile;
}

// Account data
export interface AccountData {
  id: string;
  userId: string;
  type: string;
  provider: OAuthProvider;
  providerAccountId: string;
  refreshToken?: string;
  accessToken?: string;
  expiresAt?: number;
  tokenType?: string;
  scope?: string;
  idToken?: string;
  sessionState?: string;
}

// Verification token
export interface VerificationToken {
  identifier: string;
  token: string;
  expires: Date;
}

// Authentication error types
export type AuthErrorType = 
  | 'INVALID_CREDENTIALS'
  | 'EMAIL_NOT_VERIFIED'
  | 'ACCOUNT_DISABLED'
  | 'TOO_MANY_ATTEMPTS'
  | 'PASSWORD_EXPIRED'
  | 'ACCOUNT_LOCKED'
  | 'INVALID_TOKEN'
  | 'TOKEN_EXPIRED'
  | 'EMAIL_ALREADY_EXISTS'
  | 'WEAK_PASSWORD'
  | 'INVALID_EMAIL'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR';

// Authentication error
export interface AuthError {
  type: AuthErrorType;
  message: string;
  code?: string;
  details?: Record<string, any>;
}

// Permission types
export type Permission = 
  | 'read:users'
  | 'write:users'
  | 'delete:users'
  | 'read:posts'
  | 'write:posts'
  | 'delete:posts'
  | 'read:files'
  | 'write:files'
  | 'delete:files'
  | 'admin:all';

// Role permissions mapping
export interface RolePermissions {
  USER: Permission[];
  MODERATOR: Permission[];
  ADMIN: Permission[];
}

// Permission check result
export interface PermissionCheck {
  hasPermission: boolean;
  requiredRole?: UserRole;
  userRole: UserRole;
}

// Authentication middleware options
export interface AuthMiddlewareOptions {
  requireAuth?: boolean;
  requiredRole?: UserRole;
  requiredPermissions?: Permission[];
  redirectTo?: string;
  callbackUrl?: string;
}

// Session configuration
export interface SessionConfig {
  strategy: 'jwt' | 'database';
  maxAge?: number;
  updateAge?: number;
  generateSessionToken?: () => string;
}

// JWT configuration
export interface JWTConfig {
  secret: string;
  maxAge?: number;
  encode?: (payload: any) => string;
  decode?: (token: string) => any;
}

// Database adapter configuration
export interface DatabaseAdapterConfig {
  url: string;
  type: 'postgresql' | 'mysql' | 'sqlite' | 'mongodb';
  pool?: {
    min?: number;
    max?: number;
  };
}
