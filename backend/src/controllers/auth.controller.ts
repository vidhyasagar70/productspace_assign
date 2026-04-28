import type { NextFunction, Request, Response } from 'express';
import { User } from '../models';
import { HttpError } from '../utils/http-error';
import { signToken } from '../utils/jwt';
import { comparePassword, hashPassword } from '../utils/password';

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { name, email, password } = req.body as {
      name: string;
      email: string;
      password: string;
    };

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new HttpError(409, 'Email is already registered');
    }

    const passwordHash = await hashPassword(password);
    const user = await User.create({ name, email, passwordHash });

    const token = signToken({ userId: user.id, email: user.email });

    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, password } = req.body as {
      email: string;
      password: string;
    };

    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new HttpError(401, 'Invalid email or password');
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      throw new HttpError(401, 'Invalid email or password');
    }

    const token = signToken({ userId: user.id, email: user.email });

    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const me = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new HttpError(401, 'Unauthorized');
    }

    const user = await User.findByPk(userId);
    if (!user) {
      throw new HttpError(404, 'User not found');
    }

    res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};
