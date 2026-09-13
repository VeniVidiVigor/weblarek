import { FormBase } from "./Form";

interface IContactsForm {
  valid: boolean;
  errors: string;
}

export class Contacts extends FormBase<IContactsForm> {}
