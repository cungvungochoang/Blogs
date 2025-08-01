import { HttpException, HttpStatus, Injectable, Query } from '@nestjs/common';
import { Post} from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { DeleteResult, Like, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { FilterPostDTO } from './dto/filter-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
    constructor(@InjectRepository(Post) private userRepository: Repository<User>,
                @InjectRepository(Post) private postRepository: Repository<Post>  ){}
                
    async create(userId: number, createPostDto: CreatePostDto): Promise<Post> {      
        const user = await this.userRepository.findOneBy({id:userId});  
        try{
            const post = await this.postRepository.save({...createPostDto, user});  
            return await this.postRepository.findOneBy({id:post.id}); 
        }
        catch(err){ 
            throw new HttpException('Error', HttpStatus.BAD_REQUEST);
        }
    }
    async findAll(query:FilterPostDTO):Promise<any>{
        const item_per_page = Number(query.item_per_page) || 10;
        const page = Number(query.page) || 1;
        const skip = (page - 1) * item_per_page;
        const keyWord = query.keyword || '';
        const categoryId = Number(query.category) || null;   
        const [res, total] = await this.postRepository.findAndCount({
            where:[
                {
                    title: Like('%' + keyWord + '%'),
                    category: {id: categoryId}
                },
                {
                    description: Like('%' + keyWord + '%'),
                    category: {id: categoryId}   
                }
            ],
            order: {createdAt: "DESC"},
            take: item_per_page,
            skip: skip,
            relations:{
                user:true,
                category:true
            },
            select:{
                user:{
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    avatar: true
                },
                category:{
                    id: true,
                    name: true
                }
            } 
        })
        const lastPage = Math.ceil(total / item_per_page);
        const nextPage = page + 1 > lastPage ? null : lastPage - 1;
        const previousPage = page - 1 < 1 ? null : page - 1;
        return {
            data: res,
            total,
            current_page: page,
            item_per_page,     
            nextPage,  
            previousPage,
            lastPage
        }
    }
    async findById(id: number):Promise<Post> 
    {
        return await this.postRepository.findOne({where:{id},
            relations:['user', 'category'],
            select:{
                category:{
                    id: true,
                    name: true
                },
                user:{
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    avatar: true
                }
            }
        });
    }  
    async update(id: number, updatePostDto: UpdatePostDto): Promise<UpdateResult> {  
        return await this.postRepository.update(id, updatePostDto);
    }  
    async delete(id: number): Promise<DeleteResult> {
        return await this.postRepository.delete(id);
    }
    async uploadAvatar(id: number, imageUrl:string): Promise<UpdateResult> {
        return await this.postRepository.update(id, {imageUrl});
    }  
}

