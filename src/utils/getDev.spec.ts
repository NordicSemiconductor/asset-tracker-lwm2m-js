import { describe, it } from 'node:test'
import assert from 'node:assert'
import { getDev } from './getDev.js'
import { TypeError, Warning } from '../converter.js'

void describe('getDev', () => {
	void it(`should create the 'dev' object expected by the nRF Asset Tracker`, () => {
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

	void it(`should return warning if Device object is undefined`, () => {
		const dev = getDev(undefined) as { warning: Warning }
		assert.equal(dev.warning.message, 'Dev object can not be created')
		assert.equal(dev.warning.description, 'Device (3) object is undefined')
	})

	void it(`should return error in case a required resource is missing`, () => {
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
