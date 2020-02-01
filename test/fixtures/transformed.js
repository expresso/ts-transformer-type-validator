"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = require("@expresso/validator");
function factory() {
    return [
        validator_1.validateType({ "type": "object", "properties": { "username": { "type": "string" }, "password": { "type": "string" } }, "required": ["password", "username"], "$schema": "http://json-schema.org/draft-07/schema#" }),
        validator_1.validateType({ "type": "object", "properties": { "app": { "type": "string" } }, "required": ["app"], "$schema": "http://json-schema.org/draft-07/schema#" }, { property: 'params' }),
        validator_1.validateType({ "type": "object", "properties": { "id": { "type": "boolean" } }, "required": ["id"], "$schema": "http://json-schema.org/draft-07/schema#" }, { property: 'query' }),
        validator_1.validateType({ "type": "object", "properties": { "id": { "type": "boolean" } }, "required": ["id"], "$schema": "http://json-schema.org/draft-07/schema#" }, { property: 'user' }),
        async (req, res) => {
            // do something with req
        }
    ];
}
exports.factory = factory;
