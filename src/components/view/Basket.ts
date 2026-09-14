import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IBasket {
  items: HTMLElement[];
  total: number;
  valid: boolean;
}

export class Basket extends Component<IBasket> {
  protected listElement: HTMLElement;
  protected priceElement: HTMLElement;
  protected submitButton: HTMLButtonElement;

  constructor(
    protected events: IEvents,
    container: HTMLElement,
  ) {
    super(container);

    this.listElement = ensureElement<HTMLElement>(
      ".basket__list",
      this.container,
    );
    this.priceElement = ensureElement<HTMLElement>(
      ".basket__price",
      this.container,
    );
    this.submitButton = ensureElement<HTMLButtonElement>(
      ".basket__button",
      this.container,
    );

    this.submitButton.addEventListener("click", () => {
      this.events.emit("order:open");
    });
  }

  set items(items: HTMLElement[]) {
    this.listElement.replaceChildren(...items);
  }

  set total(value: number) {
    this.priceElement.textContent = `${value} синапсов`;
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }
}
