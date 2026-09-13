import { ensureElement } from "../../utils/utils";
import { FormBase } from "./Form";
import { IEvents } from "../base/Events";
import { TPayment } from "../../types";

interface IOrderForm {
  valid: boolean;
  errors: string;
  payment: TPayment;
}

const paymentByButtonName: Record<string, TPayment> = {
  card: "online",
  cash: "offline",
};

export class Order extends FormBase<IOrderForm> {
  protected cardButton: HTMLButtonElement;
  protected cashButton: HTMLButtonElement;

  constructor(events: IEvents, container: HTMLFormElement) {
    super(events, container);

    this.cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', container);
    this.cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', container);

    this.cardButton.addEventListener("click", () => {
      this.events.emit(`${this.formName}.payment:change`, {
        value: paymentByButtonName.card,
      });
    });

    this.cashButton.addEventListener("click", () => {
      this.events.emit(`${this.formName}.payment:change`, {
        value: paymentByButtonName.cash,
      });
    });
  }

  set payment(value: TPayment) {
    this.cardButton.classList.toggle("button_alt-active", value === "online");
    this.cashButton.classList.toggle("button_alt-active", value === "offline");
  }
}
