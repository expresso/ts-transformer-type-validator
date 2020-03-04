import { expect } from 'chai'
import { getSimpleResult } from './utils'

describe('function calls', () => {
  describe('swaps function calls with expresso validate calls', () => {
    let result: string

    before(() => {
      result = getSimpleResult()
    })

    it('generates correct code', () => {
      expect(result)
        .to.have.string('validator_1.validateType({ "type": "object", "properties": { "username": { "type": "string" }, "password": { "type": "string" } }, "required": ["password", "username"], "$schema": "http://json-schema.org/draft-07/schema#" }),')
        .and.have.string('validator_1.validateType({ "type": "object", "properties": { "app": { "type": "string" } }, "required": ["app"], "$schema": "http://json-schema.org/draft-07/schema#" }, { property: \'params\' }),')
        .and.have.string('validator_1.validateType({ "type": "object", "properties": { "id": { "type": "boolean" } }, "required": ["id"], "$schema": "http://json-schema.org/draft-07/schema#" }, { property: \'query\' }),')
        .and.have.string('validator_1.validateType({ "type": "object", "properties": { "id": { "type": "boolean" } }, "required": ["id"], "$schema": "http://json-schema.org/draft-07/schema#" }, { property: \'user\' }),')
    })

    it('ignores other validate calls', () => {
      expect(result)
        .to.have.string('validator_1.validate({ type: \'object\', properties: { name: { type: \'string\' } } })')
    })
  })
})
