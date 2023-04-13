import { UserInfo, UserUpdate, User, UserStore } from '../../models/user';

const userStore = new UserStore();

describe('User Model:', () => {
  const sampleUser: UserInfo = {
    username: 'Dinh Tran',
    firstname: 'Dinh',
    lastname: 'Tran',
    password: 'dinhtran123',
  };

  async function createUser(user: UserInfo) {
    return userStore.create(user);
  }

  async function deleteUser(id: number) {
    return userStore.delete(id);
  }
  it('should create a user', async () => {
    const createdUser = await createUser(sampleUser);
    if (createdUser) {
      expect(createdUser.username).toBe(sampleUser.username);
      expect(createdUser.firstname).toBe(sampleUser.firstname);
      expect(createdUser.lastname).toBe(sampleUser.lastname);
    }
    await deleteUser(createdUser.id);
  });

  it('should update the user', async () => {
    const createdUser: User = await createUser(sampleUser);
    const newUserData: UserUpdate = {
      firstname: 'DinhTest',
      lastname: 'TranTest',
      password: "dinhtran12356"
    };

    const { firstname, lastname } = await userStore.update(createdUser.id, newUserData);
    expect(firstname).toEqual(newUserData.firstname);
    expect(lastname).toEqual(newUserData.lastname);

    await deleteUser(createdUser.id);
  });

  it('should return a list of users', async () => {
    const createdUser = await createUser(sampleUser);
    const result: any = await userStore.getAll();
    expect(result[0].username).toEqual('Dinh Tran');
    expect(result[0].firstname).toEqual('Dinh');
    expect(result[0].lastname).toEqual('Tran');

    await deleteUser(createdUser.id);
  });

  it('should remove the user', async () => {
    const createdUser: User = await createUser(sampleUser);
    await deleteUser(createdUser.id);
    expect(createdUser.firstname).toEqual('Dinh');
    expect(createdUser.lastname).toEqual('Tran');
  });
});
