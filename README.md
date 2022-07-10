### Commands

- `npm run start:dev` : Starts the application in development using `nodemon` and `ts-node` to do hot reloading.
- `npm run start`: Starts the app in production by first building the project with `npm run build`, and then executing the compiled JavaScript at `build/index.js`.
- `npm run build`: Builds the app at `build`, cleaning the folder first.
- `npm run test` Runs the `jest` tests once.
- `npm run test:dev`: Run the `jest` tests in watch mode, waiting for file changes.
- `npm run prettier-format`: Format your code.

### Database Local

- `docker-compose -f docker-compose.dev.yml up --build`

### Database Test

- `docker-compose -f docker-compose.test.yml up --build`

### Sequelize CLI

- `npx sequelize-cli db:migrate`
- `npx sequelize-cli db:migrate:undo`
- `npx sequelize-cli db:seed:all`
- `npx sequelize-cli db:seed:undo`
