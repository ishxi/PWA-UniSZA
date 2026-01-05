import { User, UserRole, AvailabilityStatus, ApplicationStatus } from '../../types';
import { getDemoUserByUsername } from './demoDataService';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

class AuthService {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'user_data';

  // Generate mock JWT tokens (in production, this would be done server-side)
  private generateToken(payload: any, expiresIn: string = '1h'): string {
    const header = { alg: 'HS256', typ: 'JWT' };
    const now = Math.floor(Date.now() / 1000);
    
    const tokenPayload = {
      ...payload,
      iat: now,
      exp: now + this.getExpirationTime(expiresIn),
    };

    // This is a mock implementation - in production, use a proper JWT library
    return btoa(JSON.stringify(header)) + '.' + btoa(JSON.stringify(tokenPayload)) + '.mock_signature';
  }

  private getExpirationTime(expiresIn: string): number {
    const time = parseInt(expiresIn);
    const unit = expiresIn.slice(-1);
    
    switch (unit) {
      case 's': return time;
      case 'm': return time * 60;
      case 'h': return time * 3600;
      case 'd': return time * 86400;
      default: return 3600; // Default to 1 hour
    }
  }

  private parseToken(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      
      return JSON.parse(atob(parts[1]));
    } catch {
      return null;
    }
  }

  public async login(username: string, password: string): Promise<AuthResponse> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Load demo user from demo.database.json
    const demoUser = getDemoUserByUsername(username);
    
    if (!demoUser || demoUser.password !== password) {
      throw new Error('Invalid credentials');
    }

    const user = { ...demoUser };
    delete (user as any).password;

    // Generate tokens
    const accessToken = this.generateToken({ 
      userId: user.id, 
      username: user.username, 
      role: user.role 
    }, '1h');
    
    const refreshToken = this.generateToken({ 
      userId: user.id 
    }, '7d');

    const expiresAt = Date.now() + (60 * 60 * 1000);

    // Store tokens securely
    this.setTokens({ accessToken, refreshToken, expiresAt });
    this.setUser(user);

    return {
      user: this.sanitizeUser(user),
      tokens: { accessToken, refreshToken, expiresAt },
    };
  }

  public async register(userData: Partial<User>): Promise<AuthResponse> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock user creation (in production, this would be server-side)
    const newUser: User = {
      id: Date.now().toString(),
      username: userData.username!,
      password: userData.password,
      role: userData.role || UserRole.JOB_SEEKER,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      avatar: userData.avatar || `https://ui-avatars.com/api/?name=${userData.firstName}+${userData.lastName}&background=6366f1&color=fff`,
      profile: userData.role === UserRole.JOB_SEEKER ? userData.profile : undefined,
      employerProfile: userData.role === UserRole.EMPLOYER ? userData.employerProfile : undefined,
    };

    // Auto-login after registration
    return this.login(userData.username!, userData.password!);
  }

  public async refreshToken(): Promise<AuthTokens> {
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    // Parse refresh token to get user ID
    const payload = this.parseToken(refreshToken);
    if (!payload || !payload.userId) {
      throw new Error('Invalid refresh token');
    }

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Generate new access token (in production, this would be server-side)
    const newAccessToken = this.generateToken({ 
      userId: payload.userId,
      // In production, you'd fetch fresh user data from database
    }, '1h');

    const newExpiresAt = Date.now() + (60 * 60 * 1000); // 1 hour from now

    const newTokens: AuthTokens = {
      accessToken: newAccessToken,
      refreshToken: refreshToken,
      expiresAt: newExpiresAt,
    };

    this.setTokens(newTokens);
    return newTokens;
  }

  public logout(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem(this.ACCESS_TOKEN_KEY);
    if (!token) return false;

    const payload = this.parseToken(token);
    if (!payload || !payload.exp) return false;

    return Date.now() < payload.exp * 1000;
  }

  public getCurrentUser(): User | null {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  public getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  public async ensureValidToken(): Promise<string | null> {
    if (this.isAuthenticated()) {
      return this.getAccessToken();
    }

    try {
      const tokens = await this.refreshToken();
      return tokens.accessToken;
    } catch {
      this.logout();
      return null;
    }
  }

  public hasRole(role: UserRole): boolean {
    const token = localStorage.getItem(this.ACCESS_TOKEN_KEY);
    if (!token) return false;

    const payload = this.parseToken(token);
    return payload?.role === role;
  }

  private setTokens(tokens: AuthTokens): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refreshToken);
  }

  private setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(this.sanitizeUser(user)));
  }

  private sanitizeUser(user: User): User {
    // Remove sensitive data like password before storing
    const { password, ...sanitizedUser } = user;
    return sanitizedUser as User;
  }

  // Password validation helper
  public validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Email validation helper
  public validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Phone number validation helper (Malaysian format)
  public validatePhoneNumber(phone: string): boolean {
    const phoneRegex = /^(\+?60|0)[1-9]\d{7,9}$/;
    return phoneRegex.test(phone.replace(/[\s-]/g, ''));
  }
}

export const authService = new AuthService();