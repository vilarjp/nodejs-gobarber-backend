import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
}

@injectable()
class UpdateProfileService {
  private usersRepository: IUsersRepository;

  private hashProvider: IHashProvider;

  constructor(
    @inject('UsersRepository') usersRepository: IUsersRepository,
    @inject('HashProvider') hashProvider: IHashProvider,
  ) {
    this.usersRepository = usersRepository;
    this.hashProvider = hashProvider;
  }

  public async execute({
    user_id,
    name,
    email,
    old_password,
    password,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found');
    }

    const checkIfEmailAlreadyExists = await this.usersRepository.findByEmail(
      email,
    );

    if (checkIfEmailAlreadyExists && checkIfEmailAlreadyExists.id !== user_id)
      throw new AppError('E-mail already in use');

    user.name = name;
    user.email = email;

    if (password && !old_password)
      throw new AppError('Must provide old password');

    if (password && old_password) {
      const passwordMatched = await this.hashProvider.compareHash(
        old_password,
        user.password,
      );
      if (!passwordMatched) {
        throw new AppError('Wrong old password');
      } else user.password = await this.hashProvider.generateHash(password);
    }

    await this.usersRepository.save(user);

    return user;
  }
}

export default UpdateProfileService;
