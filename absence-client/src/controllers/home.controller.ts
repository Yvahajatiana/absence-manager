import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class HomeController {
  @Get()
  @Render('index')
  getHome() {
    return {
      title: 'Service de Surveillance d\'Absence - Police Municipale',
      currentPage: 'home'
    };
  }
}