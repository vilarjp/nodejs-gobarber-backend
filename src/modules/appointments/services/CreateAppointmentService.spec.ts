import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 1, 1, 13).getTime();
    });

    const appointment = await createAppointment.execute({
      provider_id: '123456789',
      user_id: '987654321',
      date: new Date(2020, 1, 1, 14),
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123456789');
    expect(appointment.user_id).toBe('987654321');
  });

  it('should not be able to create two appointments on the same schedule', async () => {
    await createAppointment.execute({
      provider_id: '123456789',
      user_id: '987654321',
      date: new Date(2020, 10, 10, 14),
    });

    await expect(
      createAppointment.execute({
        provider_id: '123456789',
        user_id: '987654321',
        date: new Date(2020, 10, 10, 14),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('it should not be possible to create appointments on past dates', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 1, 1, 13).getTime();
    });

    await expect(
      createAppointment.execute({
        provider_id: '123456789',
        user_id: '987654321',
        date: new Date(2020, 1, 1, 12),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('it should not be possible to create an appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 1, 1, 13).getTime();
    });

    await expect(
      createAppointment.execute({
        provider_id: '123456789',
        user_id: '123456789',
        date: new Date(2020, 1, 1, 14),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('it should only be possible to create an appointment after 17h', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 1, 1, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        provider_id: 'provider-id',
        user_id: 'user-id',
        date: new Date(2020, 1, 2, 18),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('it should only be possible to create an appointment before 8h', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 1, 1, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        provider_id: 'provider-id',
        user_id: 'user-id',
        date: new Date(2020, 1, 2, 7),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
