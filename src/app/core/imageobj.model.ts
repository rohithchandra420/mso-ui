export interface ImageData {
    type: string;
    data: number[];
}

export class ImageModel {
    public name: string;
    public description: string;
    public imgTag: string;
    public image: ImageData
    public _id?: string;


    constructor(name:string, description:string, imgTag:string, image:ImageData , _id?:string,) {
        this._id = _id;    
        this.description = description;
        this.name = name;
        this.imgTag = imgTag;
        this.image = image;
    }
}