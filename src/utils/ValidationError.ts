type ErrorDescription = {
	instancePath: string
	schemaPath: string
	keyword: string
	params: Record<string, unknown>
	message?: string
}

/**
 * Error handler type
 * @see https://github.com/MLopezJ/asset-tracker-lwm2m-js/blob/saga/adr/007-warning-and-error-handling.md
 */
export class ValidationError extends Error {
	description: ErrorDescription[]

	constructor(description: ErrorDescription[]) {
		super(`error validating type: ${JSON.stringify(description, null, 2)}`)
		this.description = description
	}
}
