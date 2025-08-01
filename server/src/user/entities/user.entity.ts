import { Post } from "src/post/entities/post.entity"
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, UpdateDateColumn } from "typeorm"

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    email: string

    @Column()
    password: string

    @Column({type:"int", default: 1})
    status: number

    @Column({nullable: true, default:null})
    refreshToken: string

    @Column({nullable: true, default:null})
    avatar: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @OneToMany(()  => Post, (post) => post.user)
    posts: Post[];
}
