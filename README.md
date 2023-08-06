# Task Scheduling Service

### Description

The Task Scheduling Service efficiently manages a Job queue, enabling the scheduling of events that trigger specific actions like invoking functions or calling webhooks. It utilizes a sorted set in Redis to implement the Job queue. This service finds widespread application in our applications, allowing us to schedule various tasks that are required to be executed at a certain date/time.

- It uses a **Sorted set in Redis** for implementing the Job queue.
- Runs a cron job every 10 seconds and triggers all events that should have been triggered.
- Creating new event triggers via webhook.

### How It Works

##### How events are triggered ?

![](hhttps://github.com/Nayan-Shrivastava/task-scheduling-service-redis/blob/master/images/event_trigger.png)

For the Job Queue, We use a Sorted Set which keeps a list of strings sorted based on the respective numerical score. We use a string < Event Type > + < Event Id> for value and the date/time in seconds for score.

| Value < Type >\_< Id > | Score < Date & Time in ISO String > |
| :--------------------- | :---------------------------------- |
| eventA_123456          | 1644216228                          |
| eventC_123456          | 1644219428                          |
| eventA_143234          | 1644259428                          |
| eventB_143234          | 1644259728                          |

Every 10 seconds, All events with score less than current time are fetched and are triggered and then removed from queue.

##### What Action to perform ?

![](https://github.com/Nayan-Shrivastava/task-scheduling-service-redis/blob/master/images/action_perform.png)

In the triggerEvent Function, One can customize the actions to be performed for a specific event using the switch case in the function. Here we perform different API calls with different payload for different event types.

### API Reference

##### Create Event

```http
  POST /scheduler/create-event
```

| Parameter       | Type     | Description                                                                         |
| :-------------- | :------- | :---------------------------------------------------------------------------------- |
| `scheduledDate` | `string` | **Required**. Date and Time when the event should be triggered in ISO string format |
| `type`          | `string` | **Required**. Type represents event type - should not contain "\_" underscores      |
| `id`            | `string` | **Required**. Type represents event type - should not contain "\_" underscores      |

### Environment variables

| Name                 | Description                        |
| :------------------- | :--------------------------------- |
| `SCHEDULER_MSC_PORT` | Port to Scheduler Service          |
| `BASE_URL`           | Base URL to your API or Web Server |
| `REDIS_URL`          | Connection URL to your Redis DB    |

### Installation

1. cd task-scheduling-service-redis
2. To run project in dev/watch mode run `npm run start:dev`.
3. Build the application using `npm run build`.
4. To run project in production mode run `npm run start:prod`.

### Author

- [@Nayan-Shrivastava](https://github.com/Nayan-Shrivastava)

