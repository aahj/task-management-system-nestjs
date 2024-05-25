import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";


const databaseConfig = async (): Promise<TypeOrmModuleOptions> => {
    const configservice = new ConfigService();
    console.log('==========================', configservice.get('DB_PORT'));
    return {
        type: 'postgres',
        host: 'localhost',
        port: configservice.get('DB_PORT'),
        username: 'postgres',
        password: configservice.get('DB_PASSWORD'),
        database: 'tms',
        autoLoadEntities: true,
        synchronize: true,
    }
}
export { databaseConfig };