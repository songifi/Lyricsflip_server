// auth.controller.ts
import { 
    Body, 
    Controller, 
    Post, 
    HttpCode, 
    HttpStatus, 
    ValidationPipe,
    Res,
    Get,
    Param,
    BadRequestException 
  } from '@nestjs/common';
  import { Response } from 'express';
  import { AuthService } from './auth.service';
  import { LoginDto } from './dto/login.dto';
  import { ForgotPasswordDto } from './dto/forgot-password.dto';
  import { ResetPasswordDto } from './dto/reset-password.dto';
  
  @Controller('auth')
  export class AuthController {
    constructor(private readonly authService: AuthService) {}
  
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(
      @Body() loginDto: LoginDto,
      @Res({ passthrough: true }) response: Response,
    ) {
      const { accessToken, expiresIn, user } = await this.authService.login(
        loginDto.email,
        loginDto.password,
        loginDto.rememberMe || false,
      );
  
      // Set cookie options based on rememberMe flag
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        maxAge: expiresIn * 1000, // convert to milliseconds
      };
  
      response.cookie('access_token', accessToken, cookieOptions);
  
      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      };
    }
  
    @Post('forgot-password')
    @HttpCode(HttpStatus.OK)
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
      await this.authService.sendPasswordResetEmail(forgotPasswordDto.email);
      return { message: 'If your email is registered, you will receive password reset instructions' };
    }
  
    @Post('reset-password')
    @HttpCode(HttpStatus.OK)
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
      await this.authService.resetPassword(
        resetPasswordDto.token,
        resetPasswordDto.password,
      );
      return { message: 'Password has been successfully reset' };
    }
  
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    async logout(@Res({ passthrough: true }) response: Response) {
      response.clearCookie('access_token');
      return { message: 'Logged out successfully' };
    }
  
    @Get('validate-reset-token/:token')
    async validateResetToken(@Param('token') token: string) {
      const isValid = await this.authService.validatePasswordResetToken(token);
      if (!isValid) {
        throw new BadRequestException('Invalid or expired password reset token');
      }
      return { valid: true };
    }
  }