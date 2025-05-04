import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class GameHistory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: string;

    @Column()
    sessionId: string;

    @Column()
    score: number;

    @CreateDateColumn()
    date: Date;

    @Column()
    result: string;
}