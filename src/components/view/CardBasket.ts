import { ensureElement } from "../../utils/utils";
import { CardBase, ICardBase } from "./CardBase";

interface ICardBasket extends ICardBase {
  numberPosition: number;
}

export class CardBasket extends CardBase<ICardBasket> {
  protected numberPositionElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, onClick?: () => void) {
    super(container);

    this.numberPositionElement = ensureElement<HTMLElement>(
      ".basket__item-index",
      this.container,
    );
    this.deleteButton = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container,
    );

    if (onClick) {
      this.deleteButton.addEventListener("click", onClick);
    }
  }

  set numberPosition(value: number) {
    this.numberPositionElement.textContent = String(value);
  }
}
