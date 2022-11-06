import { Expose } from 'class-transformer';

export class UserDto {
  // apply @Expose() to properties which we send with reponse
  @Expose()
  id: number;

  @Expose()
  email: string;
}
