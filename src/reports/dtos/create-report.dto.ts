import {
  IsString,
  IsNumber,
  Min,
  Max,
  IsLongitude,
  IsLatitude,
} from 'class-validator';

export class CreateReportDto {
  @IsString()
  brand: string;

  @IsString()
  model: string;

  @IsNumber()
  @Min(1930)
  @Max(2050)
  year: number;

  @IsNumber()
  @Min(0)
  @Max(999999)
  price: number;

  @IsNumber()
  @Min(0)
  @Max(999999)
  milage: number;

  @IsLongitude()
  longitude: number;

  @IsLatitude()
  latitude: number;
}
