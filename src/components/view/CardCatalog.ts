import { ensureElement } from "../../utils/utils";
import { categoryMap } from "../../utils/constants";
import { CardBase, ICardBase } from "./CardBase";

interface ICardCatalog extends ICardBase {
  image: string;
  category: string;
}

export class CardCatalog extends CardBase<ICardCatalog> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;

  constructor(container: HTMLElement, onClick?: () => void) {
    super(container);

    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container,
    );
    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      this.container,
    );

    if (onClick) {
      this.container.addEventListener("click", onClick);
    }
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
}
