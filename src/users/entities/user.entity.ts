import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('users') // This decorator marks the class as a TypeORM entity, mapping it to the 'users' table.
export class User {
  @PrimaryGeneratedColumn('uuid') // Creates a primary key column that automatically generates a UUID.
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  // It's good practice to have password hashes in a separate entity or table,
  // but for simplicity, we'll include it here for now.
  @Column({ type: 'varchar' })
  passwordHash: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
