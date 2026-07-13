import { IProduct } from "../../types";

export class ShopList {
  private selectedProducts: IProduct[] = [];

  getSelectedProducts(): IProduct[] {
    return this.selectedProducts;
  }

  addSelectedProduct(product: IProduct) {
    this.selectedProducts.push(product);
  }

  deleteSelectedProduct(product: IProduct) {
    this.selectedProducts = this.selectedProducts.filter(
      (i) => i.id !== product.id,
    );
  }

  clearSelectedProducts() {
    this.selectedProducts = [];
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
