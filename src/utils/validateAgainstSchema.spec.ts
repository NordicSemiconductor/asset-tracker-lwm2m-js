import { describe, it } from 'node:test'
import { Battery } from '@nordicsemiconductor/asset-tracker-cloud-docs/protocol'
import { validateAgainstSchema } from './validateAgainstSchema.js'
import assert from 'node:assert'

void describe('validateType', () => {
	void it(`should return error when type of object does NOT follow the schema definition`, () => {
		const schema = Battery
		const object = {
			v: 123,
			ts: null,
		} as unknown as typeof schema
		const validatedObject = validateAgainstSchema(object, schema)
		assert.equal('error' in validatedObject, true)
	})

	void it(`should return result when type of object does follow the schema definition`, () => {
		const schema = Battery
		const object = {
			v: 123,
			ts: 1675874731000,
		} as unknown as typeof schema

		const validatedObject = validateAgainstSchema(object, schema)
		assert.equal('result' in validatedObject, true)
	})
})
