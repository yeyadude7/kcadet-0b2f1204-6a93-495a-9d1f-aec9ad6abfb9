import { Module } from '@nestjs/common';
import { DataModule } from '../data/data.module';
import { SeedService } from './seed.service';

@Module({
  imports: [DataModule],
  providers: [SeedService],
})
export class SeedModule {}
