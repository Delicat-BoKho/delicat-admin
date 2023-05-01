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
    public price: number = 0,
    public imgURL: string = '',
    // public describe: string = '',
    public tag: string = '',
    public size: any = null,
    public color: any = null,
    // public reviews: Array<Comment> = [],
    public quantity: number = 1,
    public describeProductLine: string = ''
  ) {}
}

export class saleProduct {
  constructor(
    public id: string = '',
    public ProductID: string = '',
    public Quantity: number = 0,
    public Description: string = ''
  ) {}
}
