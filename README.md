# Express Typescript Template

This template should help get you started developing in Node with Express and TypeScript.

## 📦 Dev Environment

- `node` version 16.14.2 the last LTS
- `npm` version 8.5.0

## 👨‍💻 Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/)
- [VS Code Extension - Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode): This is an opinionated code formatter. It enforces a consistent style by parsing your code and re-printing it with its own rules.

These extensions are configured to be recommended to the user in the first use. You can see the recommended extensions running `Show Recommended Extensions` from VS Code's command palette,

## ⚡️ Features

- [Express v4.17.1](https://github.com/expressjs/express)
- [Typescript v4.5.4](https://github.com/microsoft/TypeScript)
- [Sequelize v6.6.5](https://github.com/sequelize/sequelize) - with decorators [@sequelize-typescript](https://github.com/sequelize/sequelize-typescript) + [Postgres](https://github.com/brianc/node-postgres)
- Formatter with [ESLint](https://github.com/eslint/eslint) rules + [Prettier](https://github.com/prettier/prettier/)
- Test with [Jest](https://github.com/jestjs/jest)
- API documentation with [swagger](https://github.com/swagger-api/swagger-ui)

## ✒️ Code Styling

- [ESLint](https://eslint.org/) rules is a tool for identifying and reporting on pattern found in the code, with the goal of making code more consistent and avoid bugs. Here are the rules used for this project:

  - [eslint](https://eslint.org/docs/rules/) - eslint:recommended.
  - [eslint-typescript](https://typescript-eslint.io/rules/) - plugin:@typescript-eslint/recommended.

## 🦾 Automation

- [Git Hooks with Husky](https://github.com/typicode/husky)

  - pre-commit - runs [lint-staged](https://github.com/okonet/lint-staged) check
  - commit-msg - runs [commitlint](https://github.com/conventional-changelog/commitlint) check
  - pre-push - runs test script `npm run test`

- [Prettier](https://github.com/prettier/prettier/) - is an opinionated code formatter.

  - Auto formatter code on save using [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier)
    NPM Scripts

- NPM scripts

  | Command               | Description                                                                                     |
  | --------------------- | ----------------------------------------------------------------------------------------------- |
  | npm start             | Builds and runs the application                                                                 |
  | npm run start:dev     | Starts the application in `development` mode using `nodemon` and `ts-node` to do hot reloading. |
  | npm run build         | Builds the application at `build`, cleaning the folder first                                    |
  | npm run lint          | Runs `lint` command.                                                                            |
  | npm run test          | Runs the `jest` tests once.                                                                     |
  | npm run test:coverage | Runs the `jest` coverage once.                                                                  |
  | npm run test:dev      | Runs the `jest` tests and watches for any change.                                               |

## 🚀 Get started

```sh
# install dependencies
npm run install

# run server
npm run start:dev

# run postgres container with docker-compose
docker-compose -f docker-compose.dev.yml up --build

# run migrations and seeders
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```
