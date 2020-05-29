import IEmailTemplateProvider from '../models/IEmailTemplateProvider';

class FakeEmailTemplateProvider implements IEmailTemplateProvider {
  public async parse(): Promise<string> {
    return 'E-mail content';
  }
}

export default FakeEmailTemplateProvider;
