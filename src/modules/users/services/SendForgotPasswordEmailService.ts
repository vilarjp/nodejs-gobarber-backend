import { injectable, inject } from 'tsyringe';

import IMailProvider from '@shared/container/providers/MailProvider/models/IEmailProvider';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokenRepository from '../repositories/IUserTokenRepository';

interface IRequest {
  email: string;
}

@injectable()
class SendForgotPasswordEmailService {
  private usersRepository: IUsersRepository;

  private emailProvider: IMailProvider;

  private userTokenRepository: IUserTokenRepository;

  constructor(
    @inject('UsersRepository') usersRepository: IUsersRepository,
    @inject('EmailProvider') emailProvider: IMailProvider,
    @inject('UserTokenRepository') userTokenRepository: IUserTokenRepository,
  ) {
    this.usersRepository = usersRepository;
    this.emailProvider = emailProvider;
    this.userTokenRepository = userTokenRepository;
  }

  public async execute({ email }: IRequest): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) throw new AppError('User does not exists');

    await this.userTokenRepository.generate(user.id);

    this.emailProvider.sendMail(
      email,
      'Pedido de recuperação de senha recebido',
    );
  }
}

export default SendForgotPasswordEmailService;
