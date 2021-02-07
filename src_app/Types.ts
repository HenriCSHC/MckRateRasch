class WsMsg {
    public type: string;
    public section: string;
    public data: any;

    constructor() {
        this.type = "";
        this.section = "";
    };
};

export { WsMsg };