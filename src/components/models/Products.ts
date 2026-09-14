import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Products {
  private products: IProduct[] = [];
  private selectedProduct: IProduct | null = null;

  constructor(private events: IEvents) {}

  setProducts(list: IProduct[]) {
    this.products = list;
    this.events.emit("products:changed");
  }

  setSelectedProduct(item: IProduct) {
    this.selectedProduct = item;
    this.events.emit("product:selected");
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
