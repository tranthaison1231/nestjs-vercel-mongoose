import * as bcrypt from 'bcrypt';

export const hashPassword = async (
  password: string,
  salt: string,
): Promise<string> => {
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

// user
// Nghia
// Salt: 1234
// Password: 1234
// HashedPasword: tqyqy12461624

// user
// Son
// Salt: 1234
// Password: 1234
// HashedPasword: tqyqy12461624
