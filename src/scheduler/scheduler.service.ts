import { Injectable } from '@nestjs/common';
import * as redis from 'redis';
import { HttpService } from '@nestjs/axios';
import { Cron } from '@nestjs/schedule';
import { CreateEventDto } from './dto/scheduler.dto';

const jobQueueKey = 'Events';

/**
 * This service contain contains methods and business logic related to the scheduler.
 * @category Scheduler
 */
@Injectable()
export class SchedulerService {
  private redisClient;

  /**
   * @param httpService from @nestjs/axios for sending Http requests.
   */
  constructor(private httpService: HttpService) {
    // create redis client with the redis server URL
    this.redisClient = redis.createClient({
      url: process.env.REDIS_URL,
    });
    this.redisClient.on('error', (err) =>
      console.log('Redis Client Error', err),
    );
    // connect to redis DB
    this.redisClient.connect();
  }

  /**
   * it sends a post request to given endpoint URL with given payload.
   * @param URL the endpoint URL.
   * @param payload Request body for Post request.
   */
  async callEndpoint(URL: string, payload: any) {
    try {
      // calling the post API for collection
      await this.httpService.post(URL, payload).toPromise();
    } catch (e) {
      const { error, statusCode } = e.response.data;
      console.log('ERROR', statusCode, error);
    }
  }

  /**
   * It sets the end point and payloads according to the event type and calls callEndpoint.
   * @param type event type.
   * @param id event id.
   * @returns Http Response from calling the endpoint.
   */
  async triggerEvent(type: string, id: string) {
    let payload = {};
    let URL = '';

    // perform custom operation for each event type
    switch (type) {
      case 'eventA':
        // custom payload and URL for API call for event A
        payload = { name: 'eventA', id };
        URL = `${process.env.BASE_URL}/events/A/`;
        break;
      case 'eventB':
        // setting payload and URL for API call for event B
        payload = { name: 'eventB', id };
        URL = `${process.env.BASE_URL}/events/B/`;
        break;
      case 'eventC':
        // setting payload and URL for API call for event C
        payload = { name: 'eventC', id };
        URL = `${process.env.BASE_URL}/events/C/`;
        break;
      default:
        console.log(`invalid event type`);
        return;
    }
    await this.callEndpoint(URL, payload);
  }

  /**
   * It fetches all events that are ready to be triggered and then calls triggerEvent for each event.
   * It's a cron job that runs every 10 seconds.
   */
  @Cron('*/10 * * * * *') // running this function every 10 seconds
  async getEvents() {
    // current time in seconds
    const curr = Math.floor(Date.now() / 1000) + 1;

    // fetching all events with with scor (date in seconds) less than current time
    let events: string[] = await this.redisClient.zRangeByScore(
      jobQueueKey,
      0,
      curr,
    );

    // if found any
    if (events.length) {
      // calling their respective endpoints  based on event type
      events = await Promise.all(
        events.map(async (event) => {
          // slicing the type and id from string
          const type = event.split('_')[0];
          const id = event.split('_')[1];
          // call the Rest API for the event
          await this.triggerEvent(type, id);
          return event;
        }),
      );

      // removing the events from job queue as they are now triggered
      await this.redisClient.zRem(jobQueueKey, events);
    }
  }

  /**
   * creates a new job to be trigged on given date and time and saving it in redis DB.
   * @param dto details about the job and scheduled date.
   * @returns response integer from redis client.
   */
  async createEvent(dto: CreateEventDto) {
    // creating event in DB
    // type is a string for differentiating between events with different purposes (represents event type).
    // id is unique string for identifying an event.
    // scheduledDate is the Date & Time when trigger is to be triggered in ISO String format.

    const { scheduledDate } = dto;
    const { type, id } = dto;
    const scheduledDateInSeconds = Math.floor(
      new Date(scheduledDate).getTime() / 1000,
    ); // converting the iso date in string to time in seconds format

    // Using sorted set as a job queue
    return await this.redisClient.zAdd(jobQueueKey, {
      score: scheduledDateInSeconds, // the scheduled date in seconds as the score
      value: type + '_' + id, // '<object type>_<ID of object>' as string
    });
  }
}
