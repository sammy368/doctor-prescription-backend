import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'User' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'first_name', length: 100 })
    first_name: string;

    @CreateDateColumn()
    created_at: Date;
}