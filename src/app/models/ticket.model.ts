import { ShopcartItem } from "./shopcartItem.model";


export class Ticket {
    public name: string;
    public email: string;
    public phone: number
    public orderId: string; 
    public amount: number;
    public status: string;
    public hasEmailSent: boolean;   
    public createdAt?: Date;
    public _id?: string;
    public shopCart?: ShopcartItem[];
    public paymentId?: string;
    
   constructor( name: string, email: string, phone: number, orderId: string, amount: number, status: string, hasEmailSent:boolean,createdAt?: Date, _id?: string, shopCart?: ShopcartItem[], paymentId?:string) {
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.orderId = orderId;
    this.amount = amount;
    this.status = status;
    this.hasEmailSent = hasEmailSent;
    this._id = _id;
    this.shopCart = shopCart;
    this.paymentId = paymentId;
    this.createdAt = createdAt;
   }
}