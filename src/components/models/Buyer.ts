import { IBuyer, IValidationErrors, TPayment } from "../../types";
import { IEvents } from "../base/Events";

export class Buyer {
  private payment: TPayment | null = null;
  private email: string = "";
  private phone: string = "";
  private address: string = "";

  constructor(private events: IEvents) {}

  setPayment(payment: TPayment) {
    this.payment = payment;
    this.events.emit("buyer:changed", { buyer: this.getBuyerData() });
  }

  setEmail(email: string) {
    this.email = email;
    this.events.emit("buyer:changed", { buyer: this.getBuyerData() });
  }

  setPhone(phone: string) {
    this.phone = phone;
    this.events.emit("buyer:changed", { buyer: this.getBuyerData() });
  }

  setAddress(address: string) {
    this.address = address;
    this.events.emit("buyer:changed", { buyer: this.getBuyerData() });
  }

  getBuyerData(): IBuyer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }

  clearBuyerData() {
    this.payment = null;
    this.email = "";
    this.phone = "";
    this.address = "";
    this.events.emit("buyer:changed", { buyer: this.getBuyerData() });
  }

  validate(): IValidationErrors {
    const errors: IValidationErrors = {};

    if (!this.payment) {
      errors.payment = "Не выбран вид оплаты";
    }
    if (!this.email) {
      errors.email = "Введите email";
    }
    if (!this.phone) {
      errors.phone = "Введите телефон";
    }
    if (!this.address) {
      errors.address = "Введите адрес";
    }

    return errors;
  }
}
