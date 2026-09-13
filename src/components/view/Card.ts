import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { categoryMap } from "../../utils/constants";

interface ICardBase {
  id: string;
  title: string;
  price: number | null;
}

export abstract class CardBase<T extends ICardBase> extends Component<T> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;
  id: string = "";

  constructor(
    protected events: IEvents,
    container: HTMLElement,
    protected clickEventName?: string,
  ) {
    super(container);

    this.titleElement = ensureElement<HTMLElement>(".card__title", this.container);
    this.priceElement = ensureElement<HTMLElement>(".card__price", this.container);

    const clickable =
      this.container.querySelector<HTMLButtonElement>(".card__button") ?? this.container;

    clickable.addEventListener("click", () => {
      if (this.clickEventName) {
        this.events.emit(this.clickEventName, { id: this.id });
      }
    });
  }

  set title(value: string) {
    this.titleElement.textContent = value;
  }

  set price(value: number | null) {
    if (value === null) {
      this.priceElement.textContent = "Бесценно";
    } else {
      this.priceElement.textContent = String(value) + " синапсов";
    }
  }
}

interface ICardCatalog extends ICardBase {
  image: string;
  category: string;
}

export class CardCatalog extends CardBase<ICardCatalog> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;

  constructor(events: IEvents, container: HTMLElement, clickEventName?: string) {
    super(events, container, clickEventName);
    this.imageElement = ensureElement<HTMLImageElement>(".card__image", this.container);
    this.categoryElement = ensureElement<HTMLElement>(".card__category", this.container);
  }

  set image(value: string) {
    this.setImage(this.imageElement, value, this.titleElement.textContent ?? "");
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
    this.categoryElement.className = `card__category ${(categoryMap as Record<string, string>)[value]}`;
  }
}

interface ICardPreview extends ICardBase {
  image: string;
  category: string;
  description: string;
  purchasable: boolean;
  inBasket: boolean;
}

export class CardPreview extends CardBase<ICardPreview> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;
  protected descriptionElement: HTMLElement;
  protected buyButton: HTMLButtonElement;

  constructor(events: IEvents, container: HTMLElement, clickEventName?: string) {
    super(events, container, clickEventName);
    this.imageElement = ensureElement<HTMLImageElement>(".card__image", this.container);
    this.categoryElement = ensureElement<HTMLElement>(".card__category", this.container);
    this.descriptionElement = ensureElement<HTMLElement>(".card__text", this.container);
    this.buyButton = ensureElement<HTMLButtonElement>(".card__button", this.container);
  }

  set image(value: string) {
    this.setImage(this.imageElement, value, this.titleElement.textContent ?? "");
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

  set inBasket(value: boolean) {
    this.buyButton.textContent = value ? "Убрать из корзины" : "В корзину";
  }
}

interface ICardBasket extends ICardBase {
  numberPosition: number;
}

export class CardBasket extends CardBase<ICardBasket> {
  protected numberPositionElement: HTMLElement;

  constructor(events: IEvents, container: HTMLElement, clickEventName?: string) {
    super(events, container, clickEventName);
    this.numberPositionElement = ensureElement<HTMLElement>(".basket__item-index", this.container);
  }

  set numberPosition(value: number) {
    this.numberPositionElement.textContent = String(value);
  }
}