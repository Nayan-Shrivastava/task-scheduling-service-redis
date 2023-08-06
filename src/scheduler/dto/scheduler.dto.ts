import { IsString, IsNotEmpty } from 'class-validator';

export class CreateEventDto {
  /**
   * scheduledDate is the Date & Time when trigger is to be triggered in ISO String format.
   */
  @IsString()
  @IsNotEmpty()
  readonly scheduledDate: string;

  /**
   * type is a string for differentiating between events with different purposes (represents event type).
   */
  @IsString()
  @IsNotEmpty()
  readonly type: string;

  /**
   * id is unique string for identifying an event.
   */
  @IsString()
  @IsNotEmpty()
  readonly id: string;
}
