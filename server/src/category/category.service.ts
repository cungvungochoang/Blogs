import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
    constructor(@InjectRepository(Category) private categoryRepository: Repository<Category>){}

    async findAll(): Promise<Category[]>{
        return await this.categoryRepository.find();
    }
    async create(categoryDto: CreateCategoryDto): Promise<Category>{
        return await this.categoryRepository.save(categoryDto);
    }
}
