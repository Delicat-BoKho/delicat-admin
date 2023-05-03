import { cart } from './product';

export interface Icustomer {}
export class Customer {
  constructor(
    public id: string = '',
    public address: string = '',
    public fullName: string = '',
    public phone: string = '',
    public userName: string = '',
    public cart: Array<cart> = [],
    public wishlist: Array<string> = [],
    public order: Array<string> = []
  ) {}
}
