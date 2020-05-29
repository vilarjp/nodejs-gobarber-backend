import nodemailer, { Transporter } from 'nodemailer';
import { injectable, inject } from 'tsyringe';

import IEmailTemplateProvider from '@shared/container/providers/EmailTemplateProvider/models/IEmailTemplateProvider';
import IEmailProvider from '../models/IEmailProvider';
import ISendEmailDTO from '../dtos/ISendEmailDTO';

@injectable()
export default class EtherealEmailProvider implements IEmailProvider {
  private client: Transporter;

  private mailTemplateProvider: IEmailTemplateProvider;

  constructor(
    @inject('EmailTemplateProvider')
    mailTemplateProvider: IEmailTemplateProvider,
  ) {
    this.mailTemplateProvider = mailTemplateProvider;

    nodemailer.createTestAccount().then(account => {
      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });

      this.client = transporter;
    });
  }

  public async sendMail({
    to,
    from,
    subject,
    template,
  }: ISendEmailDTO): Promise<void> {
    const message = await this.client.sendMail({
      from: {
        name: from?.name || 'Equipe GoBarber',
        address: from?.email || 'equipe@gobarber.com.br',
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html: await this.mailTemplateProvider.parse(template),
    });

    console.log('Message sent: %s', message.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
  }
}
