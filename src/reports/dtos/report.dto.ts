import { Expose, Transform } from 'class-transformer';

export class ReportDto {
  @Expose()
  brand: string;

  @Expose()
  model: string;

  @Expose()
  year: number;

  @Expose()
  price: number;

  @Expose()
  longitude: number;

  @Expose()
  latitude: number;

  @Expose()
  isApproved: boolean;

  // get id from user property of obj which is an original Report entity
  @Transform(({ obj }) => obj.user.id)
  @Expose()
  userId: number;
}
