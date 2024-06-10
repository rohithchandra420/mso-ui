import { ShopcartItem } from "./shopcartItem.model";


export class Ticket {
    public name: string;
    public email: string;
    public bookingId: string;
    public orderId: string;    
    public _id?: string;
    public shopCart?: ShopcartItem[];
    
   constructor( name: string, email: string, bookingId: string, _id?: string, shopCart?: ShopcartItem[]) {
    this._id = _id;
    this.name = name;
    this.email = email;
    this.bookingId = bookingId;
    this.shopCart = shopCart;
   }
}