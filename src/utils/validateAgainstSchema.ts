import { TypeError } from '../converter.js'
import type { Static, TSchema } from '@sinclair/typebox'
import Ajv, { type ErrorObject } from 'ajv'

/**
 * Check if object follow the schema definition
 */
export const validateAgainstSchema = <T extends TSchema>(
	object: Record<string, unknown>,
	schema: T,
): { result: Static<typeof schema> } | { error: TypeError } => {
	const validatedObject = validateWithTypebox(object, schema)
	if ('errors' in validatedObject) {
		return {
			error: new TypeError(validatedObject.errors),
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
