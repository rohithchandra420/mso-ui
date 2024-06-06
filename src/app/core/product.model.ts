export class Product {
    public _id?: string;
    public name: string;
    public title: string;
    public price: number;
    public description: string;
    public active: boolean;

    constructor(_id:string, name:string, title:string, price:number, description:string, active: boolean) {
        this._id = _id;
        this.active = active;
        this.description = description;
        this.name = name;
        this.price = price;
        this.title = title;
    }
}