import { Module } from '@nestjs/common';
import { EmulatorsService } from './emulators.service';

@Module({
  providers: [EmulatorsService],
  exports: [EmulatorsService],
})
export class EmulatorsModule {}
