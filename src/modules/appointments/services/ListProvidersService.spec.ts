import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProvidersService: ListProvidersService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    listProvidersService = new ListProvidersService(fakeUsersRepository);
  });

  it('should be able to list providers', async () => {
    const loggedUser = await fakeUsersRepository.create({
      name: 'João',
      email: 'joao@example.com',
      password: '12345678',
    });

    await fakeUsersRepository.create({
      name: 'Paulo',
      email: 'paulo@example.com',
      password: '12345678',
    });

    await fakeUsersRepository.create({
      name: 'Vilar',
      email: 'vilar@example.com',
      password: '12345678',
    });

    const providers = await listProvidersService.execute({
      user_id: loggedUser.id,
    });

    expect(providers).toHaveLength(2);
  });
});
