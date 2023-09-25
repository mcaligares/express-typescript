import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';

const options: swaggerJSDoc.Options = {
  apis: ['./src/endpoints/*.ts'],
  swaggerDefinition: {
    info: {
      title: 'Express API',
      version: '1.0.0',
      contact: {
        email: 'mcaligares@gmail.com',
        name: 'Miguel Caligares'
      },
      description: 'REST API made with Express.'
    },
  }
};

const swaggerDoc = swaggerJSDoc(options);

export const swaggerServe = swaggerUI.serve;

export const swaggerSetup = swaggerUI.setup(swaggerDoc);
