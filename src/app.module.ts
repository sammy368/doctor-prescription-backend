import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AuthorisedModule } from './authorised/authorised.module';
import { DatabaseService } from './services/database/database.service';
import { ServicesModule } from './services/services.module';
import { User } from './entities/User.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DB_URL'),
        autoLoadEntities: true,
        synchronize: false,
        logging: ['error', 'info', 'warn'],
        ssl: config.get('DB_URL')?.includes('ssl=true') ? { rejectUnauthorized: false } : false,
      })
    }),
    TypeOrmModule.forFeature([User]),
    AuthorisedModule,
    ServicesModule
  ],
  controllers: [AppController],
  providers: [AppService, DatabaseService],
})
export class AppModule implements OnModuleInit {
  private readonly logger = new Logger(AppModule.name);
  constructor(private readonly dataSource: DataSource) {}
  async onModuleInit() {
    try {
      await this.dataSource.query('SELECT 1');
      this.logger.log('Database connection successful');
    } catch (error) {
      this.logger.log('Database connection failed', error);
      process.exit(1);
    }
  }
}
