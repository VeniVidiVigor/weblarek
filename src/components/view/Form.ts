import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IFormState {
  valid: boolean;
  errors: string;
}

export abstract class FormBase<T extends IFormState> extends Component<T> {
  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement;
  protected formName: string;

  constructor(
    protected events: IEvents,
    container: HTMLFormElement,
  ) {
    super(container);

    this.formName = container.name;
    this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
    this.errorsElement = ensureElement<HTMLElement>(".form__errors", container);

    container.addEventListener("input", (event) => {
      const target = event.target as HTMLInputElement;
      if (target.name) {
        this.events.emit(`${this.formName}.${target.name}:change`, {
          value: target.value,
        });
      }
    });

    container.addEventListener("submit", (event) => {
      event.preventDefault();
      this.events.emit(`${this.formName}:submit`);
    });
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errors(value: string) {
    this.errorsElement.textContent = value;
  }
}
