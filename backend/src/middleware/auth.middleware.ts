import type { NextFunction, Request, Response } from 'express';
import { HttpError } from '../utils/http-error';
import { verifyToken } from '../utils/jwt';

export const requireAuth = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw new HttpError(401, 'Authorization token missing or invalid');
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);
  req.user = payload;
  next();
};
