import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PostService } from './post.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'helper/config';
import { AuthGuard } from 'src/auth/auth.guard';
import { extname } from 'path';
import { ApiQuery } from '@nestjs/swagger';
import { FilterPostDTO } from './dto/filter-post.dto';
import { query } from 'express';
import {Post as PostEntity} from './entities/post.entity'
import { UpdatePostDto } from './dto/update-post.dto';
import { File } from 'buffer';


@Controller('posts')
export class PostController {
    constructor(private postService: PostService){}  
    @UseGuards(AuthGuard)
    @UsePipes(ValidationPipe)
    @ApiQuery({name:'page'})    
    @ApiQuery({name: "item_per_page"})
    @ApiQuery({name: "keyword"})
    @Get()
    findAll(@Query() query: FilterPostDTO): Promise<any> {
        return this.postService.findAll(query);  
    }
    
    @UseGuards(AuthGuard)
    @Post()
    @UseInterceptors(FileInterceptor('imageUrl', {storage: storageConfig('post'),
        fileFilter: (req, file, callback) => {
                    const extention = extname(file.originalname);
                    const allowExtArr = ['.jpg', '.png', '.jpeg'];
                    if(!allowExtArr.includes(extention)){
                        req.fileValidationError = `Wrong extention file (only: ${allowExtArr.toString()} are accepted)`;
                        callback(null, false);
                    }else {
                        const fileSize = parseInt(req.headers['content-length']);
                        if(fileSize > 1024 * 1024 * 5){
                            req.fileValidationError = `File size is too large (only < 5MB)`;
                            callback(null, false);
                        }
                        else {
                            callback(null, true);
                        }
                    }
                }
    }))

    create(@Req() req:any, @Body() createPostDto:CreatePostDto, @UploadedFile() file:Express.Multer.File){
       if(req.fileValidationError){
            throw new BadRequestException(req.fileValidationError);
        }
        if(!file){
            throw new BadRequestException('File is required');
        }
        return this.postService.create(req['user_data'].id, {...createPostDto, imageUrl:file.destination + '/' + file.filename}); 
    }  

    @UseGuards(AuthGuard)
    @Get(':id')
    findById(@Param ('id') id:string): Promise<PostEntity> {
        return this.postService.findById(Number(id));
    }

    @UseGuards(AuthGuard)
    @Put(':id')  
    update(@Param('id') id:string, @Req() req:any, @Body() updatePostDto: UpdatePostDto, @UploadedFile() file:Express.Multer.File) {
        if(req.fileValidationError){
            throw new BadRequestException(req.fileValidationError)
        }
        if(file){
            updatePostDto.imageUrl= file.destination + '/' + file.filename;
        }
        return this.postService.update(Number(id), updatePostDto);
    }  

    @UseGuards(AuthGuard) 
    @Delete(':id')
    delete(@Param('id') id:string){
        return this.postService.delete(Number(id));
    }

    uploadAvatar(@Req() req:any, @UploadedFile() file:Express.Multer.File){
        if(req.fileValidationError){
            throw new BadRequestException(req.fileValidationError);
        }
        if(!file){
            throw new BadRequestException('File is required');
        }
        this.postService.uploadAvatar(req['user_data'].id, file.destination + '/' + file.filename);
    }
}

