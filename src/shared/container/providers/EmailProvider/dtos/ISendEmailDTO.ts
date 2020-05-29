import IEmailTemplateDTO from '@shared/container/providers/EmailTemplateProvider/dtos/IEmailTemplateDTO';

interface IEmailContact {
  name: string;
  email: string;
}

export default interface ISendEmailDTO {
  to: IEmailContact;
  from?: IEmailContact;
  subject: string;
  template: IEmailTemplateDTO;
}
