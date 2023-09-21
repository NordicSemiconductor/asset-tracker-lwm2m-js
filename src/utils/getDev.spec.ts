import { describe, it } from 'node:test'
import assert from 'node:assert'
import { getDev } from './getDev.js'
import { TypeError, Warning } from '../converter.js'

void describe('getDev', () => {
	void it(`should create the 'dev' object expected by 'nRF Asset Tracker Reported'`, () => {
		const device = {
			'0': 'Nordic Semiconductor ASA',
			'1': 'Thingy:91',
			'2': '351358815340515',
			'3': '22.8.1+0',
			'7': [2754],
			'11': [0],
			'13': 1675874731,
			'16': 'UQ',
			'19': '3.2.1',
		}
		const dev = getDev(device) as { result: unknown }
		const expected = {
			v: {
				imei: '351358815340515',
				modV: '22.8.1+0',
				brdV: 'Nordic Semiconductor ASA',
			},
			ts: 1675874731000,
		}
		assert.deepEqual(dev.result, expected)
	})

	/**
	 * For transition from 'LwM2M Asset Tracker v2' objects to 'nRF Asset Tracker Reported' objects
	 *
	 * @see https://github.com/MLopezJ/asset-tracker-lwm2m-js/blob/saga/documents/nRFAssetTracker.md
	 */
	void it(`should return a warning if the dependent LwM2M object for creating the 'dev' object is undefined`, () => {
		const dev = getDev(undefined) as { warning: Warning }
		assert.equal(dev.warning.message, 'Dev object can not be created')
		assert.equal(dev.warning.description, 'Device (3) object is undefined')
	})

	void it(`should return an error if the result of the conversion does not meet the expected types`, () => {
		const device = {
			'0': 'Nordic Semiconductor ASA',
			'1': 'Thingy:91',
			// '2': '351358815340515', // required resource is missing
			'3': '22.8.1+0',
			'7': [2754],
			'11': [0],
			'13': 1675874731,
			'16': 'UQ',
			'19': '3.2.1',
		}
		const dev = getDev(device) as { error: TypeError }
		const instancePathError = dev.error.description[0]?.instancePath
		const message = dev.error.description[0]?.message
		const keyword = dev.error.description[0]?.keyword

		assert.equal(instancePathError, `/v`)
		assert.equal(message, "must have required property 'imei'")
		assert.equal(keyword, 'required')
	})
})
