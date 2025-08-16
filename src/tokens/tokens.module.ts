import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wager } from './entities/wager.entity';
import { User } from '../users/entities/user.entity';
import { MockTokenService } from './services/mock-token.service';
import { WagerService } from './services/wager.service';
import { TOKEN_SERVICE } from './interfaces/token.interface';

@Module({
  imports: [TypeOrmModule.forFeature([Wager, User])],
  providers: [
    // Custom provider pattern - easily replaceable with real Starknet implementation later
    {
      provide: TOKEN_SERVICE,
      useClass: MockTokenService,
    },
    WagerService,
  ],
  exports: [TOKEN_SERVICE, WagerService],
})
export class TokensModule {}
