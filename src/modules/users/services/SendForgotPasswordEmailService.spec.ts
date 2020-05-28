import AppError from '@shared/errors/AppError';
import FakeEmailProvider from '@shared/container/providers/MailProvider/fakes/FakeEmailProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokenRepository from '../repositories/fakes/FakeUserTokenRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokenRepository: FakeUserTokenRepository;
let fakeEmailProvider: FakeEmailProvider;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeEmailProvider = new FakeEmailProvider();
    fakeUserTokenRepository = new FakeUserTokenRepository();

    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeEmailProvider,
      fakeUserTokenRepository,
    );
  });

  it('should be able recover the password using the e-mail', async () => {
    const sendMail = jest.spyOn(fakeEmailProvider, 'sendMail');

    await fakeUsersRepository.create({
      name: 'João',
      email: 'joao@example.com',
      password: '12345678',
    });

    await sendForgotPasswordEmail.execute({
      email: 'joao@example.com',
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to recover a password from a non-existing user', async () => {
    await expect(
      sendForgotPasswordEmail.execute({
        email: 'joao@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a forgot password token', async () => {
    const generateToken = jest.spyOn(fakeUserTokenRepository, 'generate');

    const user = await fakeUsersRepository.create({
      name: 'João',
      email: 'joao@example.com',
      password: '12345678',
    });

    await sendForgotPasswordEmail.execute({
      email: 'joao@example.com',
    });

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
