export interface IProduct{

}
export class Product{
  constructor(
    public id:string="",
    public name:string="",
    public type:string="",
    public price:number =0,
    public imgURL:Array<string>=[],
    public describe:string="",
    public tag: string="" ,
    public size: any =null,
    public color:any=null,
    public reviews :Array<Comment>=[],


  ){}
}
