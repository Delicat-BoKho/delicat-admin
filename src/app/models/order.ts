import { Product } from './product';

export class Order {
  constructor(
    public id: string = '',
    public customerID: string = '',
    public description: string = '',
    public Total: number = 0,
    public OrderDate: string = '',
    public PaymentMethod: string = '',
    public Status: string = '',
    public SaleProducts: Array<Product> = []
  ) {}
}
