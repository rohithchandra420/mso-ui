import { MsoEvent } from "./mso-event.model";

export class Product {
    public msoEvent: MsoEvent;
    public name: string;
    public price: number;
    public description: string;
    public active: boolean;
    public remainingCount?: number;
    public _id?: string;
    public count?: number;

    constructor(msoEvent:MsoEvent, name:string, price:number, description:string, active: boolean, remainingCount:number, _id?:string,  count?:number) {
        this.msoEvent = msoEvent;
        this._id = _id;
        this.active = active;
        this.description = description;
        this.name = name;
        this.price = price;
        this.count = count;
        this.remainingCount = remainingCount;
    }
}