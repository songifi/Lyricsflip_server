import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ChatroomMessage } from './chatroom-message.entity';

@Entity()
export class Chatroom {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  gameSessionId: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToMany(
    () => ChatroomMessage,
    (chatroom_message) => chatroom_message.chatroom,
  )
  chatroom_messages: ChatroomMessage[];
}
