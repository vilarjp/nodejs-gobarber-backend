import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequest {
  user_id: string;
}

@injectable()
class ListProviderService {
  private usersRepository: IUsersRepository;

  constructor(@inject('UsersRepository') usersRepository: IUsersRepository) {
    this.usersRepository = usersRepository;
  }

  public async execute({ user_id }: IRequest): Promise<User> {
    const users = await this.usersRepository.findAllProviders(user_id);

    if (!user) {
      throw new AppError('User not found');
    }

    return users;
  }
}

export default ListProviderService;
