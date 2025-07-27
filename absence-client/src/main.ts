import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as hbs from 'hbs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Configuration du moteur de templates Handlebars
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  
  // Configuration des helpers Handlebars
  const handlebars = hbs.handlebars;
  handlebars.registerHelper('eq', (a, b) => a === b);
  handlebars.registerHelper('or', (a, b) => a || b);
  handlebars.registerHelper('formatDate', (date) => {
    return new Date(date).toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  });
  handlebars.registerHelper('formatDateTime', (date) => {
    return new Date(date).toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  });
  
  // Configuration des fichiers statiques
  app.useStaticAssets(join(__dirname, '..', 'public'));
  
  const port = process.env.PORT || 3003;
  await app.listen(port);
  
  console.log(`🌐 Client NestJS démarré sur http://localhost:${port}`);
  console.log(`📡 API Backend: ${process.env.API_BASE_URL || 'http://localhost:3000/api'}`);
}

bootstrap();