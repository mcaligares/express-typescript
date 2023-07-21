import { afterCreateUser } from './user.hook';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function createHooks(db: any) {
  const { user } = db;

  user.addHook('afterCreate', afterCreateUser);
}

export default createHooks;
