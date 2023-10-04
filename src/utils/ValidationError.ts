type ErrorDescription = {
	instancePath: string
	schemaPath: string
	keyword: string
	params: Record<string, unknown>
	message?: string
}

/**
 * This error is returned when the converted object is not valid.
 */
export class ValidationError extends Error {
	description: ErrorDescription[]

	constructor(description: ErrorDescription[]) {
		super(`error validating type: ${JSON.stringify(description, null, 2)}`)
		this.description = description
	}
}
