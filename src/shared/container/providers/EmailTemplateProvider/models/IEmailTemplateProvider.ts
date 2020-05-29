import IEmailTemplateDTO from '../dtos/IEmailTemplateDTO';

export default interface IEmailTemplateProvider {
  parse(data: IEmailTemplateDTO): Promise<string>;
}
