import { Buyer } from "./components/models/Buyer";
import { Products } from "./components/models/Products";
import { ShopList } from "./components/models/ShopList";
import { Api } from "./components/base/Api";
import { API_URL } from "./utils/constants";
import { ApiService } from "./components/api/ApiService";
import { apiProducts } from "./utils/data";
import "./scss/styles.scss";

const buyerModel = new Buyer();
const productsModel = new Products();
const shopListModel = new ShopList();
const api = new Api(API_URL);
const apiService = new ApiService(api);

// Проверка работоспособности класса Product на данных
productsModel.setProducts(apiProducts.items)
console.log('Массив товаров из каталога:', productsModel.getProducts())

productsModel.getProductById(apiProducts.items[0].id)
console.log('Товар по ID:', productsModel.getProductById(apiProducts.items[0].id))

productsModel.setSelectedProduct(apiProducts.items[2])
console.log('Выбранный товар:', productsModel.getSelectedProduct())

// Проверка работоспособности класса ShopList на данных
shopListModel.addSelectedProduct(apiProducts.items[1])
shopListModel.addSelectedProduct(apiProducts.items[2])
shopListModel.addSelectedProduct(apiProducts.items[3])
console.log('Массив товаров в корзине:', shopListModel.getSelectedProducts())

shopListModel.deleteSelectedProduct(apiProducts.items[1])
console.log('Массив товаров в корзине после удаления:', shopListModel.getSelectedProducts())

shopListModel.clearSelectedProducts()
console.log('Массив товаров в корзине после очистки корзины:', shopListModel.getSelectedProducts())

shopListModel.addSelectedProduct(apiProducts.items[1])
shopListModel.addSelectedProduct(apiProducts.items[2]) // цены нету - null
shopListModel.addSelectedProduct(apiProducts.items[3])
console.log('Стоимость всех товаров в корзине', shopListModel.getPriceSelectedProducts())
console.log('Товаров в корзине', shopListModel.getAmountSelectedProducts())
console.log('Товар с ID', shopListModel.checkSelectedProductById(apiProducts.items[1].id)) // есть в корзине
console.log('Товар с ID', shopListModel.checkSelectedProductById(apiProducts.items[0].id)) // нет в корзине

// Проверка работоспособности класса ShopList на данных
console.log(buyerModel.validate()) // выведет ошибку о незаполненных данных

buyerModel.setPayment('online')
buyerModel.setEmail('email@gmail.com')
buyerModel.setPhone('+7(999)999-99-99')
buyerModel.setAddress('city Moscow')
console.log(buyerModel.validate()) // пустой объект в консоли, потому что все данные заполнены

console.log('Данные покупателя:', buyerModel.getBuyerData())

buyerModel.clearBuyerData()
console.log('Очистка данных')
console.log(buyerModel.validate()) // выведет ошибку о незаполненных данных

apiService
  .getProducts()
  .then((data) => {
    productsModel.setProducts(data.items);

    console.log(productsModel.getProducts());
  })
  .catch((error) => {
    console.error(error);
  });
