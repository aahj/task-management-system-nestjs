import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from "./jwt.interface";
import { UserRepository } from "./auth.repository";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly userRepository: UserRepository
    ) {
        super({ jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), secretOrKey: "123nfjf0waijhbdoiuwefkdjbq", })
    }
    async validate(payload: JwtPayload) {
        const finduser = await this.userRepository.findOne({ where: { username: payload.username } });
        if(!finduser) {
            throw new UnauthorizedException();
        }
        return finduser;
    }
    
}