export class RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
}

export class LoginDto {
  email: string;
  password: string;
}