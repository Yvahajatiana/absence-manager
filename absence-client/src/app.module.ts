import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AbsenceModule } from './modules/absence.module';
import { HomeController } from './controllers/home.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AbsenceModule,
  ],
  controllers: [HomeController],
})
export class AppModule {}