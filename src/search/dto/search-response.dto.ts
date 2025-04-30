import { User } from '../../users/entities/user.entity';
import { Song } from '../../songs/entities/song.entity';
import { Session } from '../../sessions/entities/session.entity';

export class PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type SearchResponse = 
  | PaginatedResponse<User>
  | PaginatedResponse<Song>
  | PaginatedResponse<Session>;