import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';   
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepository:Repository<User>,
        private jwtService: JwtService,
        private configService:ConfigService
    ){}

    async registerUser(registerUserDto: RegisterUserDto): Promise<User> {
        const hashedPassword = await this.hashPassword(registerUserDto.password);
        return await this.userRepository.save({...registerUserDto, refreshToken:"refresh-token-string", password: hashedPassword});
    }

    async login(loginUserDto:LoginUserDto): Promise<any>{
        const user = await this.userRepository.findOne({
            where: {email: loginUserDto.email}}
        );
        
        await new Promise(resolve => setTimeout(resolve, 2000));

        if(!user){
            throw new HttpException("Email is not available", HttpStatus.UNAUTHORIZED);
        }
        const isPasswordValid = bcrypt.compareSync(loginUserDto.password, user.password);
        if(!isPasswordValid){
            throw new HttpException("Invalid Password", HttpStatus.UNAUTHORIZED);
        }
        const payload = {id: user.id, email: user.email};
        return this.generateToken(payload);
    }

    private async hashPassword(password: string): Promise<string> {
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const hashedPassword = await bcrypt.hash(password,salt);

        return hashedPassword;
    }
    private async generateToken(payload:{id:number, email:string}){     
        const accessToken = await this.jwtService.signAsync(payload);
        const refreshToken = await this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>('JWT_SECRET'),
            expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRE_IN'),
        });
        await this.userRepository.update(
            {email: payload.email},
            {refreshToken: refreshToken}
        )
        return {accessToken,refreshToken};   
    }
    async refreshToken(refresh_token:string): Promise<any> {
        try{
            const verify = await this.jwtService.verifyAsync(refresh_token, {
                secret: this.configService.get<string>('JWT_SECRET'),
            });
            const user = await this.userRepository.findOneBy({
                email: verify.email,
                refreshToken: verify.refresh_token});
            if(user) {
                return this.generateToken({id: verify.id, email: verify.email})
            }
        }
        catch(error){
            throw new HttpException("Invalid Refresh Token", HttpStatus.BAD_REQUEST);  
        }
    }
}
