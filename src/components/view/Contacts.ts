import { ensureElement } from "../../utils/utils";
import { FormBase } from "./Form";
import { IEvents } from "../base/Events";

interface IContactsForm {
  valid: boolean;
  errors: string;
  email: string;
  phone: string;
}

export class Contacts extends FormBase<IContactsForm> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor(events: IEvents, container: HTMLFormElement) {
    super(events, container);

    this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', container);
    this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', container);
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }
}
