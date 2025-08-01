import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Category } from './entities/category.entity';
import { CategoryService } from './category.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('categories')
export class CategoryController {
    constructor(private categoryService: CategoryService){}  

    @UseGuards(AuthGuard)
    @Get()
    findAll(): Promise<Category[]>{
        return this.categoryService.findAll();
    }
    @UseGuards(AuthGuard)
    @Post()
    create(@Body() createCategoryDto:CreateCategoryDto): Promise<Category>{
        return this.categoryService.create(createCategoryDto);
    }
}
