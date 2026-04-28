import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export const hashPassword = async (rawPassword: string): Promise<string> => {
  return bcrypt.hash(rawPassword, SALT_ROUNDS);
};

export const comparePassword = async (
  rawPassword: string,
  passwordHash: string,
): Promise<boolean> => {
  return bcrypt.compare(rawPassword, passwordHash);
};
