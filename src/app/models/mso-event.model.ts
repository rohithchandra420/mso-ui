export class MsoEvent {
    public name: string;
    public description: string;
    public active: boolean;
    public imageFile?: any
    public _id?: string;

    constructor(name:string, description:string, active: boolean, imageFile?:any, _id?:string) {
        this._id = _id;
        this.active = active;
        this.description = description;
        this.name = name;
        this.imageFile = imageFile;
    }
}