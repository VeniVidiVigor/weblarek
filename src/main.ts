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
import { CardCatalog } from "./components/view/CardCatalog";
import { CardPreview } from "./components/view/CardPreview";
import { CardBasket } from "./components/view/CardBasket";
import { Order } from "./components/view/Order";
import { Contacts } from "./components/view/Contacts";
import { Success } from "./components/view/Success";

import { IProduct, TPayment } from "./types";

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

const orderView = new Order(events, cloneTemplate("#order"));
const contactsView = new Contacts(events, cloneTemplate("#contacts"));
const successView = new Success(events, cloneTemplate("#success"));
const previewView = new CardPreview(events, cloneTemplate("#card-preview"));

function createCatalogCard(product: IProduct): HTMLElement {
  const card = new CardCatalog(cloneTemplate("#card-catalog"), () =>
    events.emit("card:select", { id: product.id }),
  );
  return card.render({
    title: product.title,
    price: product.price,
    image: CDN_URL + product.image,
    category: product.category,
  });
}

function createBasketCard(product: IProduct, index: number): HTMLElement {
  const card = new CardBasket(cloneTemplate("#card-basket"), () =>
    events.emit("card:remove", { id: product.id }),
  );
  return card.render({
    title: product.title,
    price: product.price,
    numberPosition: index + 1,
  });
}

events.on("products:changed", () => {
  gallery.render({ items: productsModel.getProducts().map(createCatalogCard) });
});

events.on("card:select", ({ id }: { id: string }) => {
  const product = productsModel.getProductById(id);
  if (product) {
    productsModel.setSelectedProduct(product);
  }
});

events.on("product:selected", () => {
  const product = productsModel.getSelectedProduct();
  if (!product) return;

  const purchasable = product.price !== null;
  const inBasket = shopListModel.checkSelectedProductById(product.id);

  const buttonText = !purchasable
    ? "Недоступно"
    : inBasket
      ? "Убрать из корзины"
      : "В корзину";

  const cardElement = previewView.render({
    title: product.title,
    price: product.price,
    image: CDN_URL + product.image,
    category: product.category,
    description: product.description,
    purchasable,
    buttonText,
  });

  modal.render({ content: cardElement });
  modal.open();
});

events.on("card:action", () => {
  const product = productsModel.getSelectedProduct();
  if (!product) return;

  if (shopListModel.checkSelectedProductById(product.id)) {
    shopListModel.deleteSelectedProduct(product);
  } else {
    shopListModel.addSelectedProduct(product);
  }

  modal.close();
});

events.on("basket:changed", () => {
  const products = shopListModel.getSelectedProducts();

  header.render({ counter: shopListModel.getAmountSelectedProducts() });
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
  modal.render({ content: contactsView.render() });
  modal.open();
});

events.on("contacts.email:change", ({ value }: { value: string }) => {
  buyerModel.setEmail(value);
});

events.on("contacts.phone:change", ({ value }: { value: string }) => {
  buyerModel.setPhone(value);
});

events.on("buyer:changed", () => {
  const buyer = buyerModel.getBuyerData();
  const errors = buyerModel.validate();

  orderView.render({
    payment: buyer.payment,
    address: buyer.address,
    valid: !errors.payment && !errors.address,
    errors: [errors.payment, errors.address].filter(Boolean).join(". "),
  });

  contactsView.render({
    email: buyer.email,
    phone: buyer.phone,
    valid: !errors.email && !errors.phone,
    errors: [errors.email, errors.phone].filter(Boolean).join(". "),
  });
});

events.on("contacts:submit", () => {
  const buyer = buyerModel.getBuyerData();
  const total = shopListModel.getPriceSelectedProducts();
  const items = shopListModel.getSelectedProducts().map((product) => product.id);

  apiService
    .createOrder({ ...buyer, total, items })
    .then((response) => {
      shopListModel.clearSelectedProducts();
      buyerModel.clearBuyerData();

      modal.render({ content: successView.render({ total: response.total }) });
      modal.open();
    })
    .catch((error) => {
      console.error(error);
    });
});

events.on("modal:close", () => {
  modal.close();
});

events.on("success:close", () => {
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
