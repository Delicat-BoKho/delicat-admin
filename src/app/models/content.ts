export interface IContent {}

export class Content {
  constructor(
    public id: string = '',
    public title: string = '',
    public img: string = '',
    public content: string = '',
    public author: string = '',
    public date: string = ''
  ) {}
}
