import * as ts from 'typescript'
import { getTypeNameFromCall, generateSchemaForType, ValidateCallOptions } from './utils'

function isValidatorOptions (obj: ts.ObjectLiteralExpression) {
  const validatorProperties = [
    'coerce',
    'defaults',
    'property'
  ]

  const isValidatorOptionsKey = (property: ts.PropertyAssignment) =>
    validatorProperties.includes(property.name.getText())

  return !!obj.properties.find(property => ts.isPropertyAssignment(property) && isValidatorOptionsKey(property))
}

function getValidateCallOptions (call: ts.CallExpression): ValidateCallOptions {
  const callArgs = call.arguments

  if (!callArgs.length) return {}

  if (callArgs.length === 2) {
    const [ schema, validator ] = callArgs

    return {
      schema: ts.isObjectLiteralExpression(schema) ? schema : undefined,
      validator: ts.isObjectLiteralExpression(validator) ? validator : undefined
    }
  }

  const [ onlyArg ] = callArgs

  if (!ts.isObjectLiteralExpression(onlyArg) || !onlyArg.properties.length) return {}

  if (isValidatorOptions(onlyArg)) {
    return {
      validator: onlyArg
    }
  }

  return { schema: onlyArg }
}

function getValidateCall (call: ts.CallExpression, typeName: string, options: ValidateCallOptions, program: ts.Program) {
  const schema = generateSchemaForType(typeName, program, options.schema)

  const validateCallParams = [ schema ]

  if (options.validator) {
    validateCallParams.push(options.validator)
  }

  return ts.updateCall(call, call.expression, undefined, validateCallParams)
}

export const transformerFactory = (program: ts.Program): ts.TransformerFactory<ts.SourceFile> => {
  const typeChecker = program.getTypeChecker()

  return context => {
    return sourceFile => {
      const visitor = (node: ts.Node): ts.VisitResult<ts.Node> => {
        if (ts.isCallExpression(node) && node.expression.getText().includes('validateType')) {
          const typeName = getTypeNameFromCall(node, typeChecker)
          return getValidateCall(node, typeName, getValidateCallOptions(node), program)
        }

        return ts.visitEachChild(node, visitor, context)
      }

      return ts.visitNode(sourceFile, visitor)
    }
  }
}

export default transformerFactory
