import fs from 'fs'
import path from 'path'
import * as ts from 'typescript'
import { transformerFactory } from '../src/transformer'
import { Transformer } from 'ts-transformer-testing-library'

export function getTransformer () {
  return new Transformer()
    .addTransformer(transformerFactory)
    .addMock({
      name: '@expresso/validator',
      content: fs.readFileSync(path.resolve(__dirname, './fixtures/validate-type.ts'), 'utf8')
    })
    .setCompilerOptions({
      strict: true,
      module: ts.ModuleKind.CommonJS
    })
}

export function getSimpleResult (_transformer?: Transformer) {
  const transformer = _transformer ?? getTransformer()

  return transformer.transform(`
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
        validateType<LoginBody>({ required: true, ignoreErrors: true }),
        validateType<LoginParams>({ required: true, ignoreErrors: true }, { property: 'params' }),
        validateType<LoginQuery>({ required: true, ignoreErrors: true }, { property: 'query' }),
        validateType<LoginQuery>({ required: true, ignoreErrors: true }, { property: 'user' }),
        async (req: Request, res: Response) => {
            // do something with req
        }
      ]
    }
  `)
}
