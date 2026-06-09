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

export interface PlacementResultBody {
  goal: 'ielts' | 'toeic' | 'business' | 'daily';
  dailyTarget: 5 | 7 | 10;
  level: 'A1' | 'A2' | 'B1' | 'B2';
}
