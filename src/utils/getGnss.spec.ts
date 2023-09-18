import { describe, it } from 'node:test'
import assert from 'node:assert'
import { type Location_6 } from '@nordicsemiconductor/lwm2m-types'
import { getGnss } from './getGnss.js'
import { TypeError, Warning } from '../converter.js'

void describe('getGnss', () => {
	void it(`should create gnss`, () => {
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

	void it(`should return warning in case Location object is undefined`, () => {
		const result = getGnss(undefined) as { warning: Warning }
		assert.equal(result.warning.message, 'GNSS object can not be created')
		assert.equal(result.warning.description, 'Location (6) object is undefined')
	})

	void it(`should return error in case required resource is missing`, () => {
		const location = {
			// '0': -43.5723, // required resource is missing
			'1': 153.2176,
			'2': 2,
			'3': 24.798573,
			'5': 1665149633,
			'6': 0.579327,
		} as unknown as Location_6
		const result = getGnss(location) as { error: TypeError }
		const instancePathError = result.error.description[0]?.instancePath
		const message = result.error.description[0]?.message
		const keyword = result.error.description[0]?.keyword

		assert.equal(instancePathError, `/v`)
		assert.equal(message, "must have required property 'lat'")
		assert.equal(keyword, 'required')
	})
})
