import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('game_modes')
export class GameMode {
  @PrimaryGeneratedColumn() // Use auto-incremented primary key (number)
  id: number; // Unique identifier for the game mode

  @Column({ unique: true })
  name: string; // Name of the game mode (e.g., Classic, Timed)

  @Column({ type: 'text', nullable: true })
  description: string; // Short description of the game mode

  @Column({ type: 'json', nullable: true })
  rules: Record<string, any>; // Rules associated with the game mode as structured JSON

  @CreateDateColumn()
  createdAt: Date; // Auto-generated timestamp for creation
}