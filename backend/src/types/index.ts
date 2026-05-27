import { Request } from 'express';

// JWT

export interface JwtPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

//Request

export interface AuthRequest extends Request {
  user?: {
    userId: string;
  };
}

// Auth Bodies

export interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

export interface LoginBody {
  email: string;
  password: string;
}
