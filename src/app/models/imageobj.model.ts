export interface ImageData {
    type: string;
    data: number[];
}

export class ImageModel {
    public name: string;
    public description: string;
    public imgTag: string;
    public imageFile: any
    public _id?: string;


    constructor(name:string, description:string, imgTag:string, imageFile:any , _id?:string,) {
        this._id = _id;    
        this.description = description;
        this.name = name;
        this.imgTag = imgTag;
        this.imageFile = imageFile;
    }
}