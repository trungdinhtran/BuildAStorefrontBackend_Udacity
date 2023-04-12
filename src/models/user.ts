import bcrypt from 'bcrypt';
import Client from '../database';

export interface UserUpdate {
  firstname: string;
  lastname: string;
  password: string;
}
export interface UserInfo {
  firstname: string;
  lastname: string;
  username: string;
  password: string;
}
export interface User extends UserInfo {
  id: number;
}

export class UserStore {
  async getAll(): Promise<User[]> {
    try {
      const connection = await Client.connect();
      const sql = 'SELECT * FROM users';
      const { rows } = await connection.query(sql);
      connection.release();
      return rows;
    } catch (err) {
      throw new Error(`Can not get users.`);
    }
  }
  async create(user: UserInfo): Promise<User> {
    const { firstname, lastname, username, password } = user;

    try {
      const connection = await Client.connect();
      const sql =
        'INSERT INTO users (firstname, lastname, username, password_digest) VALUES($1, $2, $3, $4) RETURNING *';
      const hash = bcrypt.hashSync(
        password + process.env.BCRYPT_PASSWORD,
        parseInt(process.env.SALT_ROUNDS as string, 10)
      );
      const { rows } = await connection.query(sql, [firstname, lastname, username, hash]);
      connection.release();
      return rows[0];
    } catch (err) {
      throw new Error(`Can not add new user.`);
    }
  }

  async show(id: number): Promise<User> {
    try {
      const connection = await Client.connect();
      const sql = 'SELECT * FROM users WHERE id=($1)';
      const { rows } = await connection.query(sql, [id]);
      connection.release();
      return rows[0];
    } catch (err) {
      throw new Error(`Can not find user.`);
    }
  }

  async update(id: number, newUserData: UserUpdate): Promise<User> {
    try {
      const connection = await Client.connect();
      const sql = 'UPDATE users SET firstname = $1, lastname = $2, password_digest =$3 WHERE id = $4 RETURNING *';
      const { rows } = await connection.query(sql, [
        newUserData.firstname,
        newUserData.lastname,
        newUserData.password,
        id,
      ]);
      connection.release();
      return rows[0];
    } catch (err) {
      throw new Error(
        `Can not update user.`
      );
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const connection = await Client.connect();
      const sql = 'DELETE FROM users WHERE id=($1)';
      await connection.query(sql, [id]);
      connection.release();
      return true;
    } catch (err) {
      throw new Error(`Can not delete user.`);
    }
  }

  async authenticate(username: string, password: string): Promise<User | null> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT password_digest FROM users WHERE username=($1)';
      const { rows } = await conn.query(sql, [username]);
      if (rows.length > 0) {
        const user = rows[0];
        if (bcrypt.compareSync(password + process.env.BCRYPT_PASSWORD, user.password_digest)) {
          return user;
        }
      }
      conn.release();
      return null;
    } catch (err) {
      throw new Error(`Invalid info for user:  ${username}.`);
    }
  }
}
