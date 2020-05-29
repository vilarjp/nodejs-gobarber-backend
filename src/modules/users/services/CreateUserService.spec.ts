import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
  });

  it('should be able to create a new user', async () => {
    const user = await createUser.execute({
      name: 'João',
      email: 'joao@example.com',
      password: '12345678',
    });

    expect(user).toHaveProperty('id');
    expect(user.name).toBe('João');
    expect(user.email).toBe('joao@example.com');
    expect(user).toHaveProperty('password');
  });

  it('should not be able to create two users with same e-mail', async () => {
    await createUser.execute({
      name: 'João',
      email: 'joao@example.com',
      password: '12345678',
    });

    await expect(
      createUser.execute({
        name: 'João',
        email: 'joao@example.com',
        password: '12345678',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
