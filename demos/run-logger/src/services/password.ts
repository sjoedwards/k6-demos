import { promisify } from 'util';
import { scrypt, randomBytes } from 'crypto';

// Look at the type file util.d.ts
const scryptPromise = promisify<string, string, number, Buffer>(scrypt);

export class Password {
  static async toHash(password: string): Promise<string> {
    // Salt is a random collection of characters
    const salt = randomBytes(8).toString('hex');

    // Hash the password with a salt
    const buf = await scryptPromise(password, salt, 64);
    // Add the salt onto the end of the string so it can be used in decryption
    return `${buf.toString('hex')}.${salt}`;
  }

  static async compare(
    storedPassword: string,
    suppliedPassword: string
  ): Promise<boolean> {
    const [hashedPassword, salt] = storedPassword.split('.');
    const buf = await scryptPromise(suppliedPassword, salt, 64);
    return buf.toString('hex') === hashedPassword;
  }
}
