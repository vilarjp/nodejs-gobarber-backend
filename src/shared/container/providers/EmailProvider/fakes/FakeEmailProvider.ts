import IEmailProvider from '../models/IEmailProvider';
import ISendEmailDTO from '../dtos/ISendEmailDTO';

export default class FakeEmailProvider implements IEmailProvider {
  private messages: ISendEmailDTO[] = [];

  public async sendMail(message: ISendEmailDTO): Promise<void> {
    this.messages.push(message);
  }
}
