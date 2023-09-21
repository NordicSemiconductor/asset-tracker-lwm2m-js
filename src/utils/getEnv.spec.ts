import { describe, it } from 'node:test'
import assert from 'node:assert'
import type { Temperature_3303 } from '@nordicsemiconductor/lwm2m-types'
import { getEnv } from './getEnv.js'
import { TypeError, Warning } from '../converter.js'

void describe('getEnv', () => {
	void it(`should create the 'env' object expected by 'nRF Asset Tracker Reported'`, () => {
		const temperature = [
			{
				'5601': 27.18,
				'5602': 27.71,
				'5700': 27.18,
				'5701': 'Cel',
				'5518': 1675874731,
			},
		]
		const humidity = [
			{
				'5601': 23.535,
				'5602': 24.161,
				'5700': 24.057,
				'5701': '%RH',
				'5518': 1675874731,
			},
		]
		const pressure = [
			{
				'5601': 101697,
				'5602': 101705,
				'5700': 10,
				'5701': 'Pa',
				'5518': 1675874731,
			},
		]
		const env = getEnv({ temperature, humidity, pressure }) as {
			result: unknown
		}
		const expected = {
			v: {
				temp: 27.18,
				hum: 24.057,
				atmp: 10,
			},
			ts: 1675874731000,
		}

		assert.deepEqual(env.result, expected)
	})

	/**
	 * For transition from 'LwM2M Asset Tracker v2' objects to 'nRF Asset Tracker Reported' objects
	 *
	 * @see https://github.com/MLopezJ/asset-tracker-lwm2m-js/blob/saga/documents/nRFAssetTracker.md
	 */
	void it(`should return a warning if the dependent LwM2M object for creating the 'env' object is undefined`, () => {
		const temperature = [
			{
				'5601': 27.18,
				'5602': 27.71,
				'5700': 27.18,
				'5701': 'Cel',
				'5518': 1675874731,
			},
		]
		const humidity = undefined
		const pressure = [
			{
				'5601': 101697,
				'5602': 101705,
				'5700': 10,
				'5701': 'Pa',
				'5518': 1675874731,
			},
		]
		const result = getEnv({ temperature, humidity, pressure }) as {
			warning: Warning
		}
		assert.equal(result.warning.message, 'Env object can not be created')
		assert.equal(
			result.warning.description,
			'Humidity (3304) object is undefined',
		)
	})

	void it(`should return an error if the result of the conversion does not meet the expected types`, () => {
		const temperature = [
			{
				'5601': 27.18,
				'5602': 27.71,
				//'5700': 27.18, // required resource is missing
				'5701': 'Cel',
				'5518': 1675874731,
			},
		] as unknown as Temperature_3303
		const humidity = [
			{
				'5601': 23.535,
				'5602': 24.161,
				'5700': 24.057,
				'5701': '%RH',
				'5518': 1675874731,
			},
		]
		const pressure = [
			{
				'5601': 101697,
				'5602': 101705,
				'5700': 10,
				'5701': 'Pa',
				'5518': 1675874731,
			},
		]
		const result = getEnv({ temperature, humidity, pressure }) as {
			error: TypeError
		}
		const instancePathError = result.error.description[0]?.instancePath
		const message = result.error.description[0]?.message
		const keyword = result.error.description[0]?.keyword

		assert.equal(instancePathError, `/v`)
		assert.equal(message, "must have required property 'temp'")
		assert.equal(keyword, 'required')
	})
})
