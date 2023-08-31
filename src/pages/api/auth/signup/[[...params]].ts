import { Body, Catch, createHandler, Post, ValidationPipe } from 'next-api-decorators';
import { exceptionHandler } from '@/lib/prisma/error';
import { signUp } from '@/lib/prisma/resolvers';
import { SignUpValidation } from '@/validation';

@Catch(exceptionHandler)
class AuthHandler {
  @Post()
  _signUp(@Body(ValidationPipe) body: SignUpValidation) {
    return signUp(body);
  }
}

export default createHandler(AuthHandler);
