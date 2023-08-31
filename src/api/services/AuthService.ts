import { SignUpFormData } from '@/models/auth';
import $apiClient from '..';

export class AuthService {
  static async signUp(data: SignUpFormData) {
    return await $apiClient.post('/auth/signup', data);
  }
}
