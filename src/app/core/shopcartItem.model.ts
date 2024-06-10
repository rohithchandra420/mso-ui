export class ShopcartItem {
    public _id: string;
    public name: string;
    public price: number;

    constructor(_id:string, name:string, price:number) {
        this._id = _id;
        this.name = name;
        this.price = price;
    }
}