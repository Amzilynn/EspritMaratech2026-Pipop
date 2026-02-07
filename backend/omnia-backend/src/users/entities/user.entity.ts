import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
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

    @ManyToOne(() => User, (user) => user.subordinates, { nullable: true })
    @JoinColumn({ name: 'responsableId' })
    responsable: User;

    @OneToMany(() => User, (user) => user.responsable)
    subordinates: User[];

    @OneToMany(() => Visit, (visit) => visit.user)
    visits: Visit[];
}
