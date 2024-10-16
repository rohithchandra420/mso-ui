export class User {
    public id: string;
    public name: string;
    public email: string;
    public role?: string;
    public _token: string;

    constructor(id: string, name: string, email: string, role: string, token: string) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this._token = token;
    }

    // get token() {
    //     return this._token;
    // }
}