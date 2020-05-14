import path from 'path';
import fs from 'fs';

import AppError from '@shared/errors/AppError';
import uploadConfig from '@config/upload';

import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  user_id: string;
  avatar: string;
}

class UpdateUserAvatarService {
  private usersRepository: IUsersRepository;

  constructor(usersRepository: IUsersRepository) {
    this.usersRepository = usersRepository;
  }

  public async execute({ user_id, avatar }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Only authenticated users can update avatar', 401);
    }

    if (user.avatar) {
      const filePath = path.join(uploadConfig.directory, user.avatar);
      const file = await fs.promises.stat(filePath);

      if (file) {
        await fs.promises.unlink(filePath);
      }
    }

    user.avatar = avatar;
    await this.usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
