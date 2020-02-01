import JSON5 from 'json5'
import * as ts from 'typescript'
import * as tjs from 'typescript-json-schema'

export type ValidateCallOptions = {
  schema?: ts.ObjectLiteralExpression
  validator?: ts.ObjectLiteralExpression
}

export function fromLiteral (node: ts.Node) {
  try {
    return JSON5.parse(node.getText())
  } catch (err) {
    return {}
  }
}

export function toLiteral (input: unknown): ts.PrimaryExpression {
  if (
    typeof input === 'string' ||
    typeof input === 'boolean' ||
    typeof input === 'number'
  ) {
    return ts.createLiteral(input)
  }

  if (typeof input === 'object' && Array.isArray(input)) {
    return ts.createArrayLiteral(input.map(toLiteral))
  }

  if (input !== null && typeof input === 'object' && !Array.isArray(input)) {
    const ob = input as Record<string, any>
    return ts.createObjectLiteral(
      Object.keys(ob).map(key =>
        ts.createPropertyAssignment(ts.createLiteral(key), toLiteral(ob[key]))
      )
    )
  }

  return ts.createNull()
}

export function getTypeNameFromCall (call: ts.CallExpression, typeChecker: ts.TypeChecker) {
  if (!call.typeArguments?.length) return ''

  const typeArgument = call.typeArguments[0]
  const type = typeChecker.getTypeFromTypeNode(typeArgument)
  const symbol = type.aliasSymbol || type.symbol
  if (!symbol) throw new Error(`Cannot get symbol for type ${typeArgument.getText()}`)
  return symbol.name
}

export function generateSchemaForType (typeName: string, program: ts.Program, schemaOptions: ValidateCallOptions['schema']) {
  const schemaArgs = schemaOptions ? fromLiteral(schemaOptions) : {}

  const schema = tjs.generateSchema(program, typeName, schemaArgs as tjs.PartialArgs)

  if (!schema) console.error(`WARNING: COULD NOT GENERATE SCHEMA FOR TYPE ${typeName}`)

  return toLiteral(schema)
}
