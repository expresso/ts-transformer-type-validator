@expresso/ts-transformer-type-validator
---

This is a custom typescript transformer wich allows you to use [@expresso/validator](https://npmjs.org/package/@expresso/validator) easilly, without having to wtie both TS type definitinos and JSON Schema definitions.

## Installation

You'll need to install [@expresso/validator](https://npmjs.org/package/@expresso/validator) to use this.

Also, you'll need a way to load the transformer. I recommend using [ttypescript](https://npmjs.org/package/ttypescript),
so the instructions below assume you are using that.

From the terminal, run these commands:

- `npm install -D ttypescript @expresso/ts-transformer-type-validator`
- `npm install @expresso/validator`

On your tsconfig.json, add a new property and fill it like this:

```json5
{
  "compilerOptions": {
    // ...
    "plugins": [
      { "transform": "@expresso/ts-transformer-type-validator" }
    ]
  },
}
```

Now, instead of running `tsc` to build your app, just use `ttsc`, and *voilà*!

## Usage

From [@expresso/validator](https://npmjs.org/package/@expresso/validator), import `validateType` and use it as follows:

```typescript
import { validateType } from '@expresso/validator'

type LoginParams = {
    app: string
}

type LoginBody = {
    username: string
    password: string
}

type LoginQuery = {
    id: boolean
}

export function factory () {
  return [
    validateType<LoginBody>({ required: true }), // validates the body
    validateType<LoginParams>({ required: true }, { property: 'params' }),
    validateType<LoginQuery>({ required: true }, { property: 'query' }),
    validateType<LoginQuery>({ required: true }, { property: 'user' }),
    async (req: Request, res: Response) => {
        // do something with req
    }
  ]
}
```

The result of the above code should be something like this:

```javascript
'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const validator_1 = require('@expresso/validator')
function factory() {
  return [
    validator_1.validateType({
      type: 'object',
      properties: {
        username: { type: 'string' },
        password: { type: 'string' }
      },
      required: ['password', 'username'],
      $schema: 'http://json-schema.org/draft-07/schema#'
    }), // validates the body
    validator_1.validateType(
      {
        type: 'object',
        properties: { app: { type: 'string' } },
        required: ['app'],
        $schema: 'http://json-schema.org/draft-07/schema#'
      },
      { property: 'params' }
    ),
    validator_1.validateType(
      {
        type: 'object',
        properties: { id: { type: 'boolean' } },
        required: ['id'],
        $schema: 'http://json-schema.org/draft-07/schema#'
      },
      { property: 'query' }
    ),
    validator_1.validateType(
      {
        type: 'object',
        properties: { id: { type: 'boolean' } },
        required: ['id'],
        $schema: 'http://json-schema.org/draft-07/schema#'
      },
      { property: 'user' }
    ),
    async (req, res) => {
      // do something with req
    }
  ]
}
exports.factory = factory

```

> The block of code above was indented by carbon.now.sh to improve readability.
> The actual generated code will have schemas as single line object literals.

## Features

Since this is actually a wrapper around [@expresso/validator](https://npmjs.org/package/@expresso/validator) and [typescript-json-schema](https://npmjs.org/package/typescript-json-schema), you should refer to their docs to learn about what each one of them can do, and what options you can pass to them.

`typescript-json-schema` is used on compile-time to generate the JSON Schemas for your types, then `@expresso/validator` is used to match your HTTP requests against the generated schemas

Both libraries accept options, which you can pass to the `validateType` function like this:

```typescript
import { validateType } from '@expresso/validator'
import { LoginData } from './domain/auth/types/LoginData'

const typescriptJsonSchemaOptions = { required: true }
const expressoValidatorOptions = { param: 'query' }

export function () {
  return [
    validateType<LoginData>(typescriptJsonSchemaOptions, expressoValidatorOptions),
    async (req: Request, res: response) => {
      // req.query is validated
    }
  ]
}
```

Both parameters are optional.

> Please note that the first parameter, which is the configuration
> for generating the JSON Schema definitions, will not exist at runtime.
> It is passed to typescript-json-schema at compile time.

## Motivation

I always had a problem with having to write both types and JSON Schema definitions for my `express` routes.
I knew `tsc` had a transformer API, but I thought `ttypescript` was like `tsc` fork or something.
Then I found out it was not a fork, but, instead, used the installed `tsc`.
And, then, this library was born!

## Contributing

From the terminal, run the following steps (assuming you've got `node` and `npm` figured out):

- `git clone git@github.com:expresso/ts-transformer-type-validator`
- `cd ts-transformer-type-validator`
- `npm i`

After that, you're ready to make your changes.

Use [gitmoji](https://github.com/carloscuesta/gitmoji) on your commit titles, please :)

After making your changes, run `npm run:build` to see if everything is OK.
After that, run `npm test` to run the test files
Commit, push, and open a Pull Request

## Thanks

This project was only possible because of the effort the community has put on writing awesome
documentation, tools and examples for the TypeScript Transformer API.

During development, I depended largely on the instructions and documentation
found on the [Typescript Transformer Handbook](https://github.com/madou/typescript-transformer-handbook) by [madou](https://github.com/madou/).

Also, the inspiration to creating this came from [ts-transform-json-schema](https://github.com/marionebl/ts-transform-json-schema)

Last, but not least, huge thanks to [dsherret](https://github.com/dsherret) for making [ts-ast-viewer](https://github.com/dsherret/ts-ast-viewer). This tool
**saved my life** during my dives into the TypeScript AST.
