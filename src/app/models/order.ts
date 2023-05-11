import { saleProduct } from './product';

export class Order {
  constructor(
    public id: string = '',
    public customerId: string = '',
    public description: string = '',
    public total: number = 0,
    public dateCreated: string = '',
    public paymentMethod: string = '',
    public status: string = '',
    public deliveryAddress: string = '',
    public saleProducts: Array<saleProduct> = []
  ) {}
}
