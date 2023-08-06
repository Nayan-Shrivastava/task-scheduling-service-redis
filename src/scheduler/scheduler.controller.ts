import { Controller } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { Post, Body } from '@nestjs/common';
import { CreateEventDto } from 'src/scheduler/dto/scheduler.dto';

/**
 * UserController is responsible for handling incoming requests specific to User and returning responses to the client.
 * It creates a route - "/scheduler"
 * @category Scheduler
 */
@Controller('scheduler')
export class SchedulerController {
  /**
   * @param schedulerService
   */
  constructor(private schedulerService: SchedulerService) {}

  /**
   * Post API - "/create-event" - creates a new job to be trigged on given date and time.
   * @param dto details about the job and scheduled date.
   * @returns response integer from redis client.
   */
  @Post('create-event')
  async createEvent(@Body() dto: CreateEventDto) {
    try {
      console.log(dto);
      return await this.schedulerService.createEvent(dto);
    } catch (err) {
      console.log(err);
    }
  }
}
