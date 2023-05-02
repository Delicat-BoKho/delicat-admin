import { Comment } from './comment';
export interface IProduct {}
export class Product {
  constructor(
    public id: string = '',
    public name: string = '',
    public type: string = '',
    public price: number = 0,
    public imgURL: Array<string> = [],
    public describe: string = '',
    public tag: string = '',
    public size: any = null,
    public color: any = null,
    public reviews: Array<Comment> = []
  ) {}
}

export class ProductLine {
  constructor(
    public id: string = '',
    public name: string = '',
    public type: string = '',
    public unitPrice: number = 0,
    public imgURL: string = '',
    public tag: string = '',
    public size: any = null,
    public color: any = null,
    public quantity: number = 1,
    public describeProductLine: string = ''
  ) {}
}

export class saleProduct {
  constructor(
    public id: string = '',
    public productId: string = '',
    public quantity: number = 0,
    public description: string = ''
  ) {}
}
