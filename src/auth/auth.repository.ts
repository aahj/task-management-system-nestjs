import { ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { User } from "../entities/user.entity";
import { DataSource, Repository } from "typeorm";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";

@Injectable()
export class UserRepository extends Repository<User> {
    constructor(private datasource: DataSource) {
        super(User, datasource.createEntityManager())
    }
    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<User> {
        const { username, password } = authCredentialsDto;

        const user = this.create();
        user.username = username;
        user.password = password;
        try {
            await user.save();
        } catch (error) {
            if (error.code === '23505') {
                throw new ConflictException('username already exists');
            } else {
                throw new InternalServerErrorException();
            }
        }
        return user;
    }
}