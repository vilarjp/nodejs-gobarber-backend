interface ITemplateVariables {
  [key: string]: string | number;
}

export default interface IEmailTemplateDTO {
  file: string;
  variables: ITemplateVariables;
}
