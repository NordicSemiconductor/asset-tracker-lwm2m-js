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
		const reportedError = new ValidationError([
			{
				instancePath: '/v',
				schemaPath: '#/properties/v/required',
				keyword: 'required',
				params: { missingProperty: 'ip' },
				message: "must have required property 'ip'",
			},
		])
		const result = unwrapResult(onError)({
			error: reportedError,
		})
		assert.deepEqual(result, undefined)
		assert.strictEqual(onError.mock.callCount(), 1)

		assert.strictEqual(onError.mock.calls.length, 1)
		assert.deepEqual(onError.mock.calls[0]?.arguments?.[0], reportedError)
	})
})
