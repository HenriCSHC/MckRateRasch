const { v4: uuidv4 } = require('uuid');
 class User {
    id: string;
    name: string;
    picture: string;
    keyCode: string;
    sortId: number;

    constructor() {
        this.id = uuidv4();
        this.name = "";
        this.picture = "";
        this.keyCode = "";
    }
}

class Room {
    id: string;
    name: string;
    private users: Map<string, User>;


    constructor() {
        this.id = uuidv4();
        this.name = "";
    }

    AddUser = function(): string {
        let _id = uuidv4();
        this.users[_id] = new User();
        this.users[_id].sortId = Object.keys(this.users).length;
        return _id;
    }

    RemoveUser = function(id: string): void {
        delete this.users[id];

        let _keys = Object.keys(this.users);
        _keys.sort((_a, _b) => this.users[_a].sortId - this.users[_b].sortId);
        _keys.forEach((_k, _i) => {
            this.users[_k].sortId = _i;
        });
    }
}

export { User, Room }