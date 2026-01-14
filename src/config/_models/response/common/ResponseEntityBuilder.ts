import { HttpStatus } from "@nestjs/common";

export default class ResponseEntityBuilder {
    map = new Map<String, Object>();

    constructor() {
        const timestamp = new Date();
        this.map.set("code", 200);
        this.map.set("timestamp", timestamp);
    }

    static getBuilder() { return new ResponseEntityBuilder() }

    public setCode(code: HttpStatus | number) {
        this.map.set("code", code);
        this.setSuccess(code < 400);
        return this;
    }

    public setMessage(message: String | String[] | Map<string, string>) {
        this.map.set("message", message);
        return this;
    }

    public set(key: String, value: Object) {
        this.map.set(key, value);
        return this;
    }

    public setSuccess(isSuccess: boolean) {
        this.map.set("success", isSuccess);
        return this;
    }

    public setData(data: Object) {
        this.map.set("data", data);
        return this;
    }

    public build() {
        return Object.fromEntries(this.map);
    }
}
