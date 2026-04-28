import type { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { HttpError } from '../utils/http-error';

export const handleValidation = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new HttpError(400, errors.array().map((error) => error.msg).join(', '));
  }

  next();
};
