import { BadRequestException, Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterUserDTO } from './dto/filter-user.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'helper/config';
import { extname, parse } from 'path';

@ApiBearerAuth()
@ApiTags("Users")
@Controller('users')
export class UserController {
    constructor(private userService: UserService){}
    @UseGuards(AuthGuard)
    @ApiQuery({ name: 'page' })
    @ApiQuery({ name: 'items_per_page' })
    @ApiQuery({ name: 'keyword' })
    @Get()
    findAll(@Query() query: FilterUserDTO): Promise<User[]> {
        return this.userService.findAll(query);  
    }
    
    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Req() req:any): Promise<User> {
        return this.userService.findOne(Number(req.user_data.id));
    }

    @UseGuards(AuthGuard)
    @Get(':id')
    findOne(@Param ('id') id:string): Promise<User> {
        return this.userService.findOne(Number(id));
    }

    @UseGuards(AuthGuard)
    @Post()
    create(@Body() createUserDto:CreateUserDto) :Promise<User> {
        return this.userService.create(createUserDto);
    }  

    @UseGuards(AuthGuard)
    @Put(':id')  
    update(@Param('id') id:string, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(Number(id), updateUserDto);
    }  

    @Delete('multiple')
    multipleDelete(@Query('ids', new ParseArrayPipe({ items: String, separator: ',' })) ids: string[]) {
        console.log("delete multi=> ", ids)
        return this.userService.multipleDelete(ids)
    }

    @UseGuards(AuthGuard) 
    @Delete(':id')
    delete(@Param('id') id:string){
        return this.userService.delete(Number(id));
    }
    
    @UseGuards(AuthGuard) 
    @Post('upload-avatar')
    @UseInterceptors(FileInterceptor('avatar', {
            storage:storageConfig('avatar'),
        fileFilter: (req, file, callback) => {
            const extention = extname(file.originalname);
            const allowExtArr = ['.jpg', '.png', '.jpeg', '.JPG', '.PNG', '.JPEG'];
            if(!allowExtArr.includes(extention)){
                req.fileValidationError = `Wrong extention file (only: ${allowExtArr.toString()} are accepted)`;
                callback(null, false);
            }else {
                const fileSize = parseInt(req.headers['Content-Length']);
                if(fileSize > 1024 * 1024 * 5){
                    req.fileValidationError = `File size is too large (only < 5MB)`;
                    callback(null, false);
                }
                else {
                    callback(null, true);
                }
            }
        },
    }))

    uploadAvatar(@Req() req:any, @UploadedFile() file:Express.Multer.File){
        if(req.fileValidationError){
            throw new BadRequestException(req.fileValidationError);
        }
        if(!file){
            throw new BadRequestException('File is required');
        }
        this.userService.uploadAvatar(req.user_data.id, file.fieldname + '/' + file.filename);
    }
}               
