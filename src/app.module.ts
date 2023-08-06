import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SchedulerModule } from './scheduler/scheduler.module';

/**
 * It is the root module for the application in we import all feature modules and configure modules and packages that are common in feature modules. Here we also configure the middlewares.
 *
 * Here, feature modules imported are - SchedulerModule.
 * other modules are :
 *      ConfigModule - enables us to access environment variables application wide.
 *      WinstonModule - It is used for maintaining logs in files.
 * @category Core
 */
@Module({
  imports: [
    SchedulerModule,
    WinstonModule.forRoot({
      levels: winston.config.npm.levels,
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        winston.format.json(),
        winston.format.prettyPrint(),
        winston.format.splat(),
        winston.format.colorize(),
      ),
      transports: [
        new winston.transports.File({
          filename: `logs/application-errors-${new Date().getDate()}-${
            new Date().getMonth() + 1
          }-${new Date().getFullYear()}.log`,
          level: 'error',
        }),
        new winston.transports.File({
          filename: `logs/${new Date().getDate()}-${
            new Date().getMonth() + 1
          }-${new Date().getFullYear()}.log`,
        }),
      ],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
