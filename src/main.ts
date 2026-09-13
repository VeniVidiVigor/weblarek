import "./scss/styles.scss";

import { Api } from "./components/base/Api";
import { EventEmitter } from "./components/base/Events";
import { API_URL, CDN_URL } from "./utils/constants";
import { ApiService } from "./components/api/ApiService";
import { ensureElement, cloneTemplate } from "./utils/utils";

import { Buyer } from "./components/models/Buyer";
import { Products } from "./components/models/Products";
import { ShopList } from "./components/models/ShopList";

import { Header } from "./components/view/Header";
import { Gallery } from "./components/view/Gallery";
import { Modal } from "./components/view/Modal";
import { Basket } from "./components/view/Basket";
import { CardCatalog, CardPreview, CardBasket } from "./components/view/Card";
import { Order } from "./components/view/Order";
import { Contacts } from "./components/view/Contacts";
import { Success } from "./components/view/Success";

import { IBuyer, IProduct, TPayment } from "./types";

const events = new EventEmitter();

const api = new Api(API_URL);
const apiService = new ApiService(api);

const productsModel = new Products(events);
const shopListModel = new ShopList(events);
const buyerModel = new Buyer(events);

const header = new Header(events, ensureElement<HTMLElement>(".header"));
const gallery = new Gallery(ensureElement<HTMLElement>(".gallery"));
const modal = new Modal(events, ensureElement<HTMLElement>("#modal-container"));
const basketView = new Basket(events, cloneTemplate<HTMLElement>("#basket"));
basketView.render({ items: [], total: 0, valid: false });

let orderView: Order | null = null;
let contactsView: Contacts | null = null;

function createCatalogCard(product: IProduct): HTMLElement {
  const card = new CardCatalog(
    events,
    cloneTemplate("#card-catalog"),
    "card:select",
  );
  return card.render({
    id: product.id,
    title: product.title,
    price: product.price,
    image: CDN_URL + product.image,
    category: product.category,
  });
}

function createBasketCard(product: IProduct, index: number): HTMLElement {
  const card = new CardBasket(
    events,
    cloneTemplate("#card-basket"),
    "card:remove",
  );
  return card.render({
    id: product.id,
    title: product.title,
    price: product.price,
    numberPosition: index + 1,
  });
}

events.on("products:changed", ({ products }: { products: IProduct[] }) => {
  gallery.render({ items: products.map(createCatalogCard) });
});

events.on("card:select", ({ id }: { id: string }) => {
  const product = productsModel.getProductById(id);
  if (product) {
    productsModel.setSelectedProduct(product);
  }
});

events.on("product:selected", ({ product }: { product: IProduct | null }) => {
  if (!product) return;

  const card = new CardPreview(
    events,
    cloneTemplate("#card-preview"),
    "card:toggle",
  );
  const cardElement = card.render({
    id: product.id,
    title: product.title,
    price: product.price,
    image: CDN_URL + product.image,
    category: product.category,
    description: product.description,
    purchasable: product.price !== null,
    inBasket: shopListModel.checkSelectedProductById(product.id),
  });

  modal.render({ content: cardElement });
  modal.open();
});

events.on("card:toggle", ({ id }: { id: string }) => {
  const product = productsModel.getProductById(id);
  if (!product) return;

  if (shopListModel.checkSelectedProductById(id)) {
    shopListModel.deleteSelectedProduct(product);
  } else {
    shopListModel.addSelectedProduct(product);
  }

  productsModel.setSelectedProduct(product);
});

events.on("basket:changed", ({ products }: { products: IProduct[] }) => {
  header.render({ counter: products.length });
  basketView.render({
    items: products.map(createBasketCard),
    total: shopListModel.getPriceSelectedProducts(),
    valid: products.length > 0,
  });
});

events.on("basket:open", () => {
  modal.render({ content: basketView.render() });
  modal.open();
});

events.on("card:remove", ({ id }: { id: string }) => {
  const product = productsModel.getProductById(id);
  if (product) {
    shopListModel.deleteSelectedProduct(product);
  }
});

events.on("order:open", () => {
  orderView = new Order(events, cloneTemplate("#order"));
  modal.render({ content: orderView.render() });
  modal.open();
});

events.on("order.payment:change", ({ value }: { value: TPayment }) => {
  buyerModel.setPayment(value);
});

events.on("order.address:change", ({ value }: { value: string }) => {
  buyerModel.setAddress(value);
});

events.on("order:submit", () => {
  contactsView = new Contacts(events, cloneTemplate("#contacts"));
  modal.render({ content: contactsView.render() });
  modal.open();
});

events.on("contacts.email:change", ({ value }: { value: string }) => {
  buyerModel.setEmail(value);
});

events.on("contacts.phone:change", ({ value }: { value: string }) => {
  buyerModel.setPhone(value);
});

events.on("buyer:changed", ({ buyer }: { buyer: IBuyer }) => {
  const errors = buyerModel.validate();

  if (orderView) {
    orderView.render({
      ...(buyer.payment ? { payment: buyer.payment } : {}),
      valid: !errors.payment && !errors.address,
      errors: [errors.payment, errors.address].filter(Boolean).join(". "),
    });
  }

  if (contactsView) {
    contactsView.render({
      valid: !errors.email && !errors.phone,
      errors: [errors.email, errors.phone].filter(Boolean).join(". "),
    });
  }
});

events.on("contacts:submit", () => {
  const buyer = buyerModel.getBuyerData();
  const total = shopListModel.getPriceSelectedProducts();
  const items = shopListModel
    .getSelectedProducts()
    .map((product) => product.id);

  apiService
    .createOrder({ ...buyer, total, items })
    .then(() => {
      shopListModel.clearSelectedProducts();
      buyerModel.clearBuyerData();
      orderView = null;
      contactsView = null;

      const success = new Success(events, cloneTemplate("#success"));
      modal.render({ content: success.render({ total }) });
      modal.open();
    })
    .catch((error) => {
      console.error(error);
    });
});

events.on("modal:close", () => {
  modal.close();
});

apiService
  .getProducts()
  .then((data) => {
    productsModel.setProducts(data.items);
  })
  .catch((error) => {
    console.error(error);
  });
