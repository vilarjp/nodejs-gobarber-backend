import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfileService = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update user profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'João',
      email: 'joao@example.com',
      password: '12345678',
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'Paulo',
      email: 'paulo@example.com',
    });

    expect(updatedUser.name).toBe('Paulo');
    expect(updatedUser.email).toBe('paulo@example.com');
  });

  it("should not be able to update e-mail to another user's e-mail", async () => {
    const user = await fakeUsersRepository.create({
      name: 'João',
      email: 'joao@example.com',
      password: '12345678',
    });

    await fakeUsersRepository.create({
      name: 'Paulo',
      email: 'paulo@example.com',
      password: '12345678',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'João',
        email: 'paulo@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should be able to update user's name only ", async () => {
    const user = await fakeUsersRepository.create({
      name: 'João',
      email: 'joao@example.com',
      password: '12345678',
    });

    const updatedName = await updateProfileService.execute({
      user_id: user.id,
      name: 'Paulo',
      email: 'joao@example.com',
    });

    expect(updatedName.name).toBe('Paulo');
    expect(updatedName.email).toBe('joao@example.com');
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'João',
      email: 'joao@example.com',
      password: '12345678',
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'João',
      email: 'joao@example.com',
      old_password: '12345678',
      password: '123123',
    });

    expect(updatedUser.password).toBe('123123');
  });

  it('should not be able to update the password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'João',
      email: 'joao@example.com',
      password: '12345678',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'João',
        email: 'joao@example.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'João',
      email: 'joao@example.com',
      password: '12345678',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'João',
        email: 'joao@example.com',
        old_password: 'wrong-old-password',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update non-existing user', async () => {
    await expect(
      updateProfileService.execute({
        user_id: 'non-existing-id',
        name: 'João',
        email: 'paulo@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
