import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';
import { MusicGenre, MusicDecade } from '../src/users/entities/user.entity';

describe('User Preferences (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let userId: string;

  // Mock JWT guard for testing
  const mockJwtGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [__dirname + '/../src/**/*.entity{.ts,.js}'],
          synchronize: true,
          logging: false,
        }),
        AppModule,
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Create a test user and get auth token
    // In a real scenario, you'd create a user and get a JWT token
    // For testing, we'll mock the user data
    userId = 'test-user-id';
    authToken = 'test-jwt-token';
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    // Reset the mock guard for each test
    mockJwtGuard.canActivate.mockReturnValue(true);
  });

  describe('/users/preferences (PATCH)', () => {
    it('should update user preferences successfully', () => {
      const preferences = {
        preferredGenre: MusicGenre.ROCK,
        preferredDecade: MusicDecade.EIGHTIES,
      };

      return request(app.getHttpServer())
        .patch('/users/preferences')
        .set('Authorization', `Bearer ${authToken}`)
        .send(preferences)
        .expect(200)
        .expect((res) => {
          expect(res.body.message).toBe('Preferences updated successfully');
          expect(res.body.preferences.preferredGenre).toBe(MusicGenre.ROCK);
          expect(res.body.preferences.preferredDecade).toBe(MusicDecade.EIGHTIES);
        });
    });

    it('should update only genre preference', () => {
      const preferences = {
        preferredGenre: MusicGenre.JAZZ,
      };

      return request(app.getHttpServer())
        .patch('/users/preferences')
        .set('Authorization', `Bearer ${authToken}`)
        .send(preferences)
        .expect(200)
        .expect((res) => {
          expect(res.body.preferences.preferredGenre).toBe(MusicGenre.JAZZ);
          expect(res.body.preferences.preferredDecade).toBeUndefined();
        });
    });

    it('should update only decade preference', () => {
      const preferences = {
        preferredDecade: MusicDecade.NINETIES,
      };

      return request(app.getHttpServer())
        .patch('/users/preferences')
        .set('Authorization', `Bearer ${authToken}`)
        .send(preferences)
        .expect(200)
        .expect((res) => {
          expect(res.body.preferences.preferredDecade).toBe(MusicDecade.NINETIES);
          expect(res.body.preferences.preferredGenre).toBeUndefined();
        });
    });

    it('should return 400 for invalid genre', () => {
      const preferences = {
        preferredGenre: 'Invalid Genre',
        preferredDecade: MusicDecade.EIGHTIES,
      };

      return request(app.getHttpServer())
        .patch('/users/preferences')
        .set('Authorization', `Bearer ${authToken}`)
        .send(preferences)
        .expect(400);
    });

    it('should return 400 for invalid decade', () => {
      const preferences = {
        preferredGenre: MusicGenre.POP,
        preferredDecade: '1950s',
      };

      return request(app.getHttpServer())
        .patch('/users/preferences')
        .set('Authorization', `Bearer ${authToken}`)
        .send(preferences)
        .expect(400);
    });

    it('should return 401 when not authenticated', () => {
      mockJwtGuard.canActivate.mockReturnValue(false);

      const preferences = {
        preferredGenre: MusicGenre.POP,
        preferredDecade: MusicDecade.NINETIES,
      };

      return request(app.getHttpServer())
        .patch('/users/preferences')
        .send(preferences)
        .expect(401);
    });
  });

  describe('/users/preferences (GET)', () => {
    it('should get user preferences successfully', () => {
      return request(app.getHttpServer())
        .get('/users/preferences')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.preferences).toBeDefined();
          expect(typeof res.body.preferences.preferredGenre).toBe('string');
          expect(typeof res.body.preferences.preferredDecade).toBe('string');
        });
    });

    it('should return 401 when not authenticated', () => {
      mockJwtGuard.canActivate.mockReturnValue(false);

      return request(app.getHttpServer())
        .get('/users/preferences')
        .expect(401);
    });
  });

  describe('/users/profile (GET)', () => {
    it('should include preferences in user profile', () => {
      return request(app.getHttpServer())
        .get('/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.preferredGenre).toBeDefined();
          expect(res.body.preferredDecade).toBeDefined();
          expect(res.body.username).toBeDefined();
          expect(res.body.email).toBeDefined();
        });
    });
  });
});
