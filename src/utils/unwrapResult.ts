import type { UndefinedLwM2MObjectWarning } from './UndefinedLwM2MObjectWarning.js'
import type { ValidationError } from './ValidationError.js'

/**
 * Unwrap convertion process result.
 *
 * If the result of the convertion process is an error, return undefined and trigger the error.
 * Otherwise return the result value
 */
export const unwrapResult =
	(
		onError?: (element: ValidationError | UndefinedLwM2MObjectWarning) => void,
	) =>
	<Result>(
		conversionResult:
			| { result: Result }
			| { error: ValidationError | UndefinedLwM2MObjectWarning },
	): Result | undefined => {
		if ('error' in conversionResult) {
			onError?.(conversionResult.error)
			return undefined
		}
		return conversionResult.result
	}
