import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// import * as bcrypt from 'bcrypt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { TokenResponse } from './interfaces/token-response.interface';
import { RegisterDto } from './dto/register.dto';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly BCRYPT_SALT_ROUNDS = 12;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<Omit<User, 'password'>> {
    try {
      const existingUser = await this.usersService.findUserByEmail(
        registerDto.email,
      );
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }

      const hashedPassword = await this.hashPassword(registerDto.password);
      const user = await this.usersService.create({
        ...registerDto,
        password: hashedPassword,
      });
      return this.sanitizeUser(user);
    } catch (error) {
      this.logger.error(`Registration failed: ${error.message}`, error.stack);
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Registration failed');
    }
  }

  async validateUser(body: LoginDto): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.findUserByEmail(body.email);
    if (!user) {
      // await bcrypt.hash(body.password, this.BCRYPT_SALT_ROUNDS);
      return null;
    }
    console.log(user)

    const isPasswordValid = await this.comparePasswords(body.password, user.password);

    console.log(isPasswordValid)

    if (!isPasswordValid) {
      return null;
    }

    return this.sanitizeUser(user);
  }

  async login(loginDto: LoginDto): Promise<TokenResponse> {
    const user = await this.validateUser(loginDto);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user);
  }

  async refreshToken(user: Omit<User, 'password'>): Promise<TokenResponse> {
    return this.generateTokens(user);
  }

  private async generateTokens(
    user: Omit<User, 'password'>,
  ): Promise<TokenResponse> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roles: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(
        { sub: payload.sub },
        {
          expiresIn: '7d',
          secret: process.env.JWT_REFRESH_SECRET,
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  private sanitizeUser(user: User): Omit<User, 'password'> {
    const { password, ...result } = user;
    return result;
  }

  // private async hashPassword(password: string): Promise<string> {
  //   return bcrypt.hash(password, this.BCRYPT_SALT_ROUNDS);
  // }

  private async hashPassword(password: string): Promise<string> {
    // const salt = await bcrypt.genSalt(this.BCRYPT_SALT_ROUNDS);
    return bcrypt.hash(password, 10);
  }

  private async comparePasswords(
    plainText: string,
    hash: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainText, hash);
  }
}
