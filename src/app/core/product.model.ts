export class Product {
    public _id?: string;
    public name: string;
    public price: number;
    public description: string;
    public active: boolean;
    public count?: number;
    public remainingCount?: number;

    constructor(_id:string, name:string, price:number, description:string, active: boolean, count:number, remainingCount:number) {
        this._id = _id;
        this.active = active;
        this.description = description;
        this.name = name;
        this.price = price;
        this.count = count;
        this.remainingCount = remainingCount;
    }
}