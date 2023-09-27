import { describe, it } from 'node:test'
import assert from 'node:assert'
import { Location_6_urn, type Location_6 } from '../schemas/index.js'
import { getGnss } from './getGnss.js'
import { parseURN } from '@nordicsemiconductor/lwm2m-types'
import type { UndefinedLwM2MObjectWarning } from './UndefinedLwM2MObjectWarning.js'
import type { ValidationError } from './ValidationError.js'

void describe('getGnss', () => {
	void it(`should create the 'gnss' object expected by 'nRF Asset Tracker Reported'`, () => {
		const location = {
			'0': -43.5723,
			'1': 153.2176,
			'2': 2,
			'3': 24.798573,
			'5': 1665149633,
			'6': 0.579327,
		}
		const gnss = getGnss(location) as { result: unknown }
		const expected = {
			v: {
				lng: 153.2176,
				lat: -43.5723,
				acc: 24.798573,
				alt: 2,
				spd: 0.579327,
			},
			ts: 1665149633000,
		}
		assert.deepEqual(gnss.result, expected)
	})

	/**
	 * For transition from 'LwM2M Asset Tracker v2' objects to 'nRF Asset Tracker Reported' objects
	 *
	 * @see https://github.com/MLopezJ/asset-tracker-lwm2m-js/blob/saga/documents/nRFAssetTracker.md
	 */
	void it(`should return a warning if the dependent LwM2M object for creating the 'gnss' object is undefined`, () => {
		const result = getGnss(undefined) as {
			warning: UndefinedLwM2MObjectWarning
		}
		assert.equal(
			result.warning.message,
			`'gnss' object can not be created because LwM2M object id '6' is undefined`,
		)
		assert.deepEqual(
			result.warning.undefinedLwM2MObject,
			parseURN(Location_6_urn),
		)
	})

	void it(`should return an error if the result of the conversion does not meet the expected types`, () => {
		const location = {
			// '0': -43.5723, // required resource is missing
			'1': 153.2176,
			'2': 2,
			'3': 24.798573,
			'5': 1665149633,
			'6': 0.579327,
		} as unknown as Location_6
		const result = getGnss(location) as { error: ValidationError }
		const instancePathError = result.error.description[0]?.instancePath
		const message = result.error.description[0]?.message
		const checkMessage = message?.includes("must have required property 'lat'")
		const keyword = result.error.description[0]?.keyword

		assert.equal(instancePathError, `/v`)
		assert.equal(checkMessage, true)
		assert.equal(keyword, 'required')
	})
})
