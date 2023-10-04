import type { Static, TSchema } from '@sinclair/typebox'
import Ajv, { type ErrorObject } from 'ajv'
import { ValidationError } from './ValidationError.js'
import type { UndefinedLwM2MObjectWarning } from './UndefinedLwM2MObjectWarning.js'

/**
 * Check if object follow the schema definition
 */
export const validateAgainstSchema = <T extends TSchema>(
	object: Record<string, unknown>,
	schema: T,
):
	| { result: Static<typeof schema> }
	| { error: ValidationError | UndefinedLwM2MObjectWarning } => {
	const validatedObject = validateWithTypebox(object, schema)
	if ('errors' in validatedObject) {
		return {
			error: new ValidationError(validatedObject.errors),
		}
	}

	return { result: validatedObject.valid }
}

const ajv = new Ajv()
// see @https://github.com/sinclairzx81/typebox/issues/51
ajv.addKeyword('kind')
ajv.addKeyword('modifier')

/**
 * Use typebox to check if object follow the schema definition
 */
const validateWithTypebox = <T extends TSchema>(
	object: unknown,
	schema: T,
):
	| {
			errors: ErrorObject[]
	  }
	| {
			valid: unknown
	  } => {
	const v = ajv.compile(schema)
	const valid = v(object)
	if (valid !== true) {
		return {
			errors: v.errors as ErrorObject[],
		}
	}
	return { valid: object }
}
