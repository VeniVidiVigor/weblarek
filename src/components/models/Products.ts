import { IProduct } from "../../types";

export class Products {
  private products: IProduct[] = [];
  private selectedProduct: IProduct | null = null;

  setProducts(list: IProduct[]) {
    this.products = list;
  }

  setSelectedProduct(item: IProduct) {
    this.selectedProduct = item;
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }

  getProductById(id: string): IProduct | undefined {
    return this.products.find((item) => item.id === id);
  }
}
