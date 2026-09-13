import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class ShopList {
  private selectedProducts: IProduct[] = [];

  constructor(private events: IEvents) {}

  getSelectedProducts(): IProduct[] {
    return this.selectedProducts;
  }

  addSelectedProduct(product: IProduct) {
    this.selectedProducts.push(product);
    this.events.emit("basket:changed", { products: this.selectedProducts });
  }

  deleteSelectedProduct(product: IProduct) {
    this.selectedProducts = this.selectedProducts.filter(
      (i) => i.id !== product.id,
    );
    this.events.emit("basket:changed", { products: this.selectedProducts });
  }

  clearSelectedProducts() {
    this.selectedProducts = [];
    this.events.emit("basket:changed", { products: this.selectedProducts });
  }

  getPriceSelectedProducts(): number {
    let sumPrice = this.selectedProducts.reduce((total, product) => {
      if (product.price === null) {
        return total;
      } else {
        return product.price + total;
      }
    }, 0);

    return sumPrice;
  }

  getAmountSelectedProducts(): number {
    return this.selectedProducts.length;
  }

  checkSelectedProductById(id: string): boolean {
    return this.selectedProducts.some((item) => item.id === id);
  }
}
