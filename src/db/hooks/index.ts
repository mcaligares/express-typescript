import { afterCreateUser } from './user.hook';

async function createHooks(db: any) {
  const { user } = db;

  user.addHook('afterCreate', afterCreateUser);
}

export default createHooks;
