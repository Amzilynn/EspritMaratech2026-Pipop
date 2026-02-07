import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Role } from './role.entity';
import { Visit } from '../../visits/entities/visit.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column({ select: false })
    password: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @ManyToOne(() => Role, (role) => role.users)
    role: Role;

    @OneToMany(() => Visit, (visit) => visit.user)
    visits: Visit[];
}
