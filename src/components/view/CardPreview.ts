import { ensureElement } from "../../utils/utils";
import { categoryMap } from "../../utils/constants";
import { IEvents } from "../base/Events";
import { CardBase, ICardBase } from "./CardBase";

interface ICardPreview extends ICardBase {
  image: string;
  category: string;
  description: string;
  purchasable: boolean;
  buttonText: string;
}

export class CardPreview extends CardBase<ICardPreview> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;
  protected descriptionElement: HTMLElement;
  protected buyButton: HTMLButtonElement;

  constructor(
    protected events: IEvents,
    container: HTMLElement,
  ) {
    super(container);

    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container,
    );
    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      this.container,
    );
    this.descriptionElement = ensureElement<HTMLElement>(
      ".card__text",
      this.container,
    );
    this.buyButton = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container,
    );

    this.buyButton.addEventListener("click", () => {
      this.events.emit("card:action");
    });
  }

  set image(value: string) {
    this.setImage(
      this.imageElement,
      value,
      this.titleElement.textContent ?? "",
    );
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
    this.categoryElement.className = `card__category ${(categoryMap as Record<string, string>)[value]}`;
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set purchasable(value: boolean) {
    this.buyButton.disabled = !value;
  }

  set buttonText(value: string) {
    this.buyButton.textContent = value;
  }
}
