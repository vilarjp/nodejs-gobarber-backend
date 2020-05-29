import handlebars from 'handlebars';
import fs from 'fs';

import IEmailTemplateDTO from '../dtos/IEmailTemplateDTO';
import IEmailTemplateProvider from '../models/IEmailTemplateProvider';

class HandlebarsEmailTemplateProvider implements IEmailTemplateProvider {
  public async parse({ file, variables }: IEmailTemplateDTO): Promise<string> {
    const templateFileContent = await fs.promises.readFile(file, {
      encoding: 'utf-8',
    });

    const parseTempate = handlebars.compile(templateFileContent);
    return parseTempate(variables);
  }
}

export default HandlebarsEmailTemplateProvider;
