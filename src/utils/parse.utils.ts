type ObjectWithPassword<T> = T & { password: string };

export function obfuscatePassword<T>(object: ObjectWithPassword<T>): T {
  if (!('password' in object)) {
    return object;
  }

  try {
    const copyObject = JSON.parse(JSON.stringify(object)) as ObjectWithPassword<T>;

    copyObject.password = '******';

    return copyObject;
  } catch (e) {
    return object;
  }
}
