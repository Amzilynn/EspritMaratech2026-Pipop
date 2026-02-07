import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('audits')
export class Audit {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    action: string; // CREATE, UPDATE, DELETE

    @Column()
    entity: string;

    @Column('jsonb', { nullable: true })
    oldValue: any;

    @Column('jsonb', { nullable: true })
    newValue: any;

    @CreateDateColumn()
    timestamp: Date;

    @ManyToOne(() => User)
    user: User;
}
