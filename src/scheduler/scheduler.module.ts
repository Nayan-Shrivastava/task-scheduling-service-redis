import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SchedulerController } from './scheduler.controller';
import { SchedulerService } from './scheduler.service';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';

/**
 * It is a feature module where we keep the controller, service and other code related to the scheduler and  we import other modules and configure modules and packages that are being used in this module.
 *
 * Other modules imported are:
 * HttpModule - it enables us to make Http Requests.
 * ScheduleModule - it enables us to setup Cron job in our nest application.
 * ClientsModule - A client module which enables us to create a Redis microservice client in our application.
 * @category Scheduler
 */
@Module({
  imports: [
    HttpModule,
    ScheduleModule.forRoot(),
    ClientsModule.register([
      {
        name: 'SCHEDULER',
        transport: Transport.REDIS,
        options: {
          url: process.env.REDIS_URL,
        },
      },
    ]),
  ],
  controllers: [SchedulerController],
  providers: [SchedulerService],
})
export class SchedulerModule {}
