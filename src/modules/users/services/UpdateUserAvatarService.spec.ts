import AppError from '@shared/errors/AppError';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();

    updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );
  });

  it('should be able to update users avatar', async () => {
    const user = await fakeUsersRepository.create({
      name: 'João',
      email: 'joao@example.com',
      password: '12345678',
    });

    const updatedUser = await updateUserAvatar.execute({
      user_id: user.id,
      avatar: 'avatar.jpg',
    });

    expect(updatedUser.avatar).toBe('avatar.jpg');
  });

  it('should not be able to update avatar if there is no user authenticated', async () => {
    await expect(
      updateUserAvatar.execute({
        user_id: '123456789',
        avatar: 'avatar.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should delete old avatar when updating new one', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUsersRepository.create({
      name: 'João',
      email: 'joao@example.com',
      password: '12345678',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatar: 'avatar.jpg',
    });

    const updatedUser = await updateUserAvatar.execute({
      user_id: user.id,
      avatar: 'avatar2.jpg',
    });

    expect(deleteFile).toHaveBeenLastCalledWith('avatar.jpg');
    expect(updatedUser.avatar).toBe('avatar2.jpg');
  });
});
