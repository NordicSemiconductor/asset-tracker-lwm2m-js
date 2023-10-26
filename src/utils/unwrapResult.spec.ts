import { describe, it } from 'node:test'
import assert from 'node:assert'
import { unwrapResult } from './unwrapResult.js'
import { ValidationError } from './ValidationError.js'

void describe('unwrapResult', () => {
	void it(`should return the result when the input is known as valid`, (context) => {
		const onError = context.mock.fn()
		const result = unwrapResult(onError)({ result: true })
		assert.deepEqual(result, true)
		assert.strictEqual(onError.mock.callCount(), 0)
	})

	void it(`should return undefined and call the onError callback when the input is known as invalid`, (context) => {
		const onError = context.mock.fn()
		const result = unwrapResult(onError)({
			error: new ValidationError('' as any),
		})
		assert.deepEqual(result, undefined)
		assert.strictEqual(onError.mock.callCount(), 1)
	})
})
