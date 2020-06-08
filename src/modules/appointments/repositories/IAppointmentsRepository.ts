import Appointment from '../infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '../dtos/ICreateAppointmentDTO';
import IFindMonthAvailabilityDTO from '../dtos/IFindMonthAvailabilityDTO';
import IFindDayAvailabilityDTO from '../dtos/IFindDayAvailabilityDTO';

export default interface IAppointmentsRepository {
  create(data: ICreateAppointmentDTO): Promise<Appointment>;
  findByDate(date: Date, provider_id: string): Promise<Appointment | undefined>;
  findMonthAvailability(
    data: IFindMonthAvailabilityDTO,
  ): Promise<Appointment[]>;
  findDayAvailability(data: IFindDayAvailabilityDTO): Promise<Appointment[]>;
}
