import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './report.entity';
import { CreateReportDto } from './dtos/create-report.dto';
import { GetEstimateDto } from './dtos/get-estimate.dto';
import { User } from '../users/user.entity';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  create(reportDto: CreateReportDto, user: User) {
    const report = this.repo.create(reportDto);
    // extracts only id from entire User entity
    report.user = user;

    return this.repo.save(report);
  }

  async approve(id: number, isApproved: boolean) {
    const report = await this.repo.findOneBy({ id });

    if (!report) throw new NotFoundException('Report not found');

    report.isApproved = isApproved;

    return this.repo.save(report);
  }

  createEstimate({
    brand,
    model,
    longitude,
    latitude,
    year,
    milage,
  }: GetEstimateDto) {
    return (
      this.repo
        .createQueryBuilder()
        // find the average price among limit(3) reports
        .select('AVG(price)', 'price')
        // :brand is query value
        // gets brand from estimateDto and pastes to :brand
        // same as: 'brand = :brand', { brand: estimateDto.brand }
        .where('brand = :brand', { brand })
        // 'andWhere' because 'where' will override previous
        .andWhere('model = :model', { model })
        // find longitude which is +/-5 from query value
        .andWhere('longitude - :longitude BETWEEN -5 AND 5', { longitude })
        .andWhere('latitude - :latitude BETWEEN -5 AND 5', { latitude })
        .andWhere('year - :year BETWEEN -5 AND 5', { year })
        .andWhere('isApproved IS TRUE')
        .orderBy('ABS(milage - :milage)', 'DESC')
        // use this because orderBy does not take second parameter
        .setParameters({ milage })
        .limit(3)
        .getRawOne()
    );
  }
}
