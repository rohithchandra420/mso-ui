export class ShopcartItem {
    public _id: string;
    public name: string;
    public price: number;
    public status: string;

    constructor(_id:string, name:string, price:number, status: string) {
        this._id = _id;
        this.name = name;
        this.price = price;
        this.status = status;
    }
}