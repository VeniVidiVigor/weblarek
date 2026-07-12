import { Buyer } from './components/models/Buyer';
import { Products } from './components/models/Products';
import { ShopList } from './components/models/ShopList';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { ApiService } from './components/api/ApiService';
import './scss/styles.scss';

const buyerModel = new Buyer();
const productsModel = new Products();
const shopListModel = new ShopList();
const api = new Api(API_URL);
const apiService = new ApiService(api);

apiService.getProducts()
  .then((data) => {
    productsModel.setProducts(data.items)
    
    console.log(productsModel.getProducts())
  })

