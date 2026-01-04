import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { DataSource } from 'typeorm';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly dataSource: DataSource) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/synchronize')
  async synchronize() {
    await this.dataSource.synchronize();
    return {
      data: 'Database Synchronized'
    };
  }
}
