import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Chatroom } from './chatroom.entity';

@Entity()
export class ChatroomMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @Column()
  senderId: string;

  @Column()
  senderName: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @ManyToOne(() => Chatroom, (chatroom) => chatroom.chatroom_messages)
  chatroom: Chatroom;
}
