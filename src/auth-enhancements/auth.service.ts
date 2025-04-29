// auth.service.ts
import {
    Injectable,
    UnauthorizedException,
    BadRequestException,
    NotFoundException,
    InternalServerErrorException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import { ConfigService } from '@nestjs/config';
  import { MailerService } from '@nestjs-modules/mailer';
  import * as bcrypt from 'bcrypt';
  import { v4 as uuidv4 } from 'uuid';
  import { User } from '../users/entities/user.entity';
  import { PasswordReset } from './entities/password-reset.entity';
  import { JwtPayload } from './interfaces/jwt-payload.interface';
  
  @Injectable()
  export class AuthService {
    constructor(
      @InjectRepository(User)
      private usersRepository: Repository<User>,
      @InjectRepository(PasswordReset)
      private passwordResetRepository: Repository<PasswordReset>,
      private jwtService: JwtService,
      private configService: ConfigService,
      private mailerService: MailerService,
    ) {}
  
    async login(email: string, password: string, rememberMe: boolean) {
      const user = await this.usersRepository.findOne({ where: { email } });
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }
  
      // Set expiration based on rememberMe flag
      const expiresIn = rememberMe 
        ? parseInt(this.configService.get('JWT_REMEMBER_EXPIRATION', '2592000')) // 30 days in seconds
        : parseInt(this.configService.get('JWT_EXPIRATION', '3600')); // 1 hour in seconds
  
      const payload: JwtPayload = { sub: user.id, email: user.email };
      const accessToken = this.jwtService.sign(payload, { expiresIn });
  
      return {
        accessToken,
        expiresIn,
        user,
      };
    }
  
    async sendPasswordResetEmail(email: string) {
      const user = await this.usersRepository.findOne({ where: { email } });
  
      // Always return success even if email doesn't exist (security best practice)
      if (!user) {
        return;
      }
  
      // Generate a unique token
      const token = uuidv4();
      
      // Create an expiry date (1 hour from now)
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1);
  
      // Save the reset token in the database
      await this.passwordResetRepository.save({
        user,
        token,
        expiresAt,
      });
  
      // Generate the reset URL
      const resetUrl = `${this.configService.get('FRONTEND_URL', 'http://localhost:3000')}/reset-password/${token}`;
  
      // Send the email
      try {
        await this.mailerService.sendMail({
          to: user.email,
          subject: 'Password Reset Request',
          html: `
            <h3>Password Reset</h3>
            <p>You requested a password reset for your account. Click the link below to reset your password:</p>
            <a href="${resetUrl}">Reset Password</a>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
          `,
        });
      } catch (error) {
        throw new InternalServerErrorException('Failed to send password reset email');
      }
    }
  
    async validatePasswordResetToken(token: string): Promise<boolean> {
      const passwordReset = await this.passwordResetRepository.findOne({
        where: { token },
        relations: ['user'],
      });
  
      if (!passwordReset || !passwordReset.user) {
        return false;
      }
  
      // Check if token is expired
      if (new Date() > passwordReset.expiresAt) {
        return false;
      }
  
      return true;
    }
  
    async resetPassword(token: string, newPassword: string) {
      const passwordReset = await this.passwordResetRepository.findOne({
        where: { token },
        relations: ['user'],
      });
  
      if (!passwordReset || !passwordReset.user) {
        throw new BadRequestException('Invalid reset token');
      }
  
      // Check if token is expired
      if (new Date() > passwordReset.expiresAt) {
        throw new BadRequestException('Reset token has expired');
      }
  
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Update user's password
      await this.usersRepository.update(passwordReset.user.id, {
        password: hashedPassword,
      });
  
      // Delete the used token
      await this.passwordResetRepository.delete({ token });
  
      // Log password reset event (could be expanded to a proper audit log)
      console.log(`Password reset for user ID ${passwordReset.user.id} at ${new Date()}`);
    }
  }