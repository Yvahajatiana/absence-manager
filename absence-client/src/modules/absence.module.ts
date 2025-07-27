import { Module } from '@nestjs/common';
import { AbsenceController, ConfirmationController } from '../controllers/absence.controller';
import { AbsenceService } from '../services/absence.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [AbsenceController, ConfirmationController],
  providers: [AbsenceService],
})
export class AbsenceModule {}