import { IsEmail,IsStrongPassword,IsString,Matches, MinLength } from "class-validator";

export class LoginDto {
    @IsEmail()
    email?: string;  
    @MinLength(8)
    @IsString()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message: 'Password must contain at least one uppercase , one lowercase letter, one number, and one special character.',
      })    
    password?: string;
}