export class Ticket {
    public _id?: string;
    public name: string;
    public email: string;
    public bookingId: string;
    public noOfTickets: number;
    
   constructor(_id: string, name: string, email: string, bookingId: string, noOfTickets: number) {
    this._id = _id;
    this.name = name;
    this.email = email;
    this.bookingId = bookingId;
    this.noOfTickets = noOfTickets;
   }
}