import { Injectable, Query } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, In, Like, Repository, UpdateResult } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterUserDTO } from './dto/filter-user.dto';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private userRepository: Repository<User> ){}
    async findAll(query:FilterUserDTO):Promise<any> {
        const items_per_page = Number(query.items_per_page) || 10;
        const page = Number(query.page) || 1;
        const skip = (page - 1) * items_per_page;
        const keyWord = query.keyword || '';
        const [res, total] = await this.userRepository.findAndCount({
            where:[
                    { firstName: Like('%' + keyWord + '%')},
                    { lastName: Like('%' + keyWord + '%')},
                    { email: Like('%' + keyWord + '%')}
            ],
            order: {createdAt: "DESC"},
            take: items_per_page,
            skip: skip,
            select: ['id', 'firstName','lastName', 'email', 'status', 'createdAt', 'updatedAt']
        })
        const lastPage = Math.ceil(total / items_per_page);
        const nextPage = page + 1 > lastPage ? null : lastPage - 1;
        const previousPage = page - 1 < 1 ? null : page - 1;
        return {
            data: res,
            total,
            current_page: page,   
            nextPage,  
            previousPage,
            lastPage
        }
    }

    async findOne(id: number): Promise<User> {
        return await this.userRepository.findOneBy({ id });
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
        return await this.userRepository.save({...createUserDto, password:hashedPassword});
    }
    
    async update(id: number, updateUserDto: UpdateUserDto): Promise<UpdateResult> {  
        return await this.userRepository.update(id, updateUserDto);
    }

    async delete(id: number): Promise<DeleteResult> {
        return await this.userRepository.delete(id);
    }

    async multipleDelete(ids: string[]): Promise<DeleteResult> {
        return await this.userRepository.delete({ id: In(ids) })
    }
    
    async uploadAvatar(id: number, avatar:string): Promise<UpdateResult> {
        return await this.userRepository.update(id, {avatar});
    }
}
