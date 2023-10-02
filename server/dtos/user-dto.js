module.exports = class UserDto {
    id;
    name;

    constructor(model) {
        this.name = model.name;
    }
}
