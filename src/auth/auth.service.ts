import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './auth.repository';
import { User } from 'src/entities/user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private readonly userRepository: UserRepository, private readonly jwtService: JwtService) { }
    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<User> {
        return this.userRepository.signUp(authCredentialsDto);
    }

    async login(authCredentialsDto: AuthCredentialsDto): Promise<{ data: User, token: string }> {
        const finduser = await this.userRepository.findOne({ where: { username: authCredentialsDto.username } });
        if (finduser) {
            const token = this.jwtService.sign({ username: finduser.username });
            return { data: finduser, token };
        } else {
            throw new UnauthorizedException('user not found');
        }
    }
}
