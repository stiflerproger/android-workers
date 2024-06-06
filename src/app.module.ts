import { Module } from '@nestjs/common';
import { EmulatorsModule } from './emulators/emulators.module';

@Module({
  imports: [EmulatorsModule],
})
export class AppModule {}
