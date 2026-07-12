import { IBuyer, IValidationErrors, TPayment } from '../../types';

export class Buyer {
  payment: TPayment | null = null;
  email: string | null = null;
  phone: string | null = null;
  address: string | null = null;

  setPayment(payment: TPayment) {
    this.payment = payment;
  }

  setEmail(email: string) {
    this.email = email;
  }

  setPhone(phone: string) {
    this.phone = phone;
  }

  setAddress(address: string) {
    this.address = address;
  }

  getBuyerData(): IBuyer {
    return {
      payment: this.payment!,
      email: this.email!,
      phone: this.phone!,
      address: this.address!
    }
  }

  clearBuyerData() {
    this.payment = null;
    this.email = null;
    this.phone = null;
    this.address = null;
  }

  validate(): IValidationErrors {
    const errors: IValidationErrors = {};

    if (!this.payment) {
      errors.payment = "Не выбран вид оплаты"
    } 
    if (!this.email) {
      errors.email = "Введите email"
    } 
    if (!this.phone) {
      errors.phone = "Введите телефон"
    }
    if (!this.address) {
      errors.address = "Введите адрес"
    }
    
    return errors
  }
}