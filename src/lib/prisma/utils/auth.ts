import bcrypt from 'bcrypt';
import { BadRequestException } from 'next-api-decorators';
import { ERROR_MESSAGES } from '@/constants/common';
import { findUser } from '../resolvers';

export const validateUserPassword = async (email: string, password: string) => {
  try {
    const user = await findUser(email);

    if (!user) {
      throw new BadRequestException(ERROR_MESSAGES.invalidCredentials);
    }

    const isValid = await bcrypt.compare(password, user.password || '');
    if (!isValid) {
      throw new BadRequestException(ERROR_MESSAGES.invalidCredentials);
    }

    return { id: user.id, email: user.email };
  } catch (e) {
    throw new Error(e as string);
  }
};
