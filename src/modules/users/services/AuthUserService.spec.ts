import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProviders/fakes/FakeHashProvider';
import AuthUserService from './AuthUserService';
import CreateUserService from './CreateUserService';

describe('AuthUser', () => {
  it('should be able to authenticate', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const authUser = new AuthUserService(fakeUsersRepository, fakeHashProvider);

    const user = await createUser.execute({
      name: 'João',
      email: 'joao@example.com',
      password: '12345678',
    });

    const auth = await authUser.execute({
      email: user.email,
      password: user.password,
    });

    expect(auth).toHaveProperty('token');
    expect(auth.user).toEqual(user);
  });

  it('should not be able to authenticate with non existing user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const authUser = new AuthUserService(fakeUsersRepository, fakeHashProvider);

    expect(
      authUser.execute({
        email: 'joao@example.com',
        password: '12345678',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const authUser = new AuthUserService(fakeUsersRepository, fakeHashProvider);

    const user = await createUser.execute({
      name: 'João',
      email: 'joao@example.com',
      password: '12345678',
    });

    expect(
      authUser.execute({
        email: user.email,
        password: 'asdasdas',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
