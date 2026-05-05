import {
  IsString,
  Matches,
  MinLength,
  IsNotEmpty,
  IsEmail,
} from 'class-validator';

export class ResetPasswordDto {
  @IsEmail()
  email: string;
  @IsString()
  @IsNotEmpty()
  otp: string;
  @IsString()
  @IsNotEmpty()
  resetToken: string;
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/, {
    message:
      'Password must include uppercase, lowercase, number, and special character',
  })
  @IsString()
  newPassword: string;
  @IsString()
  confirmPassword: string;
}
