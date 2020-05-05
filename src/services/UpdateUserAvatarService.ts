import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';

import User from '../models/User';

import AppError from '../errors/AppError';

import uploadConfig from '../config/upload';

interface Request {
  user_id: string;
  avatar: string;
}

class UpdateUserAvatarService {
  public async execute({ user_id, avatar }: Request): Promise<User> {
    const userRepository = getRepository(User);

    const user = await userRepository.findOne(user_id);

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
    await userRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
