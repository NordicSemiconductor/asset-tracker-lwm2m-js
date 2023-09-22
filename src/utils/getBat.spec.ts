import { describe, it } from 'node:test'
import assert from 'node:assert'
import { getBat } from './getBat.js'
import { type BatteryData } from '@nordicsemiconductor/asset-tracker-cloud-docs'
import { ValidationError, UndefinedLwM2MObjectWarning } from '../converter.js'
import { Device_3_urn, parseURN } from '@nordicsemiconductor/lwm2m-types'

void describe('getBat', () => {
	void it(`should create the 'bat' object expected by 'nRF Asset Tracker Reported'`, () => {
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
		const bat = getBat(device) as { result: BatteryData }

		assert.equal(bat.result.v, 2754)
		assert.equal(bat.result.ts, 1675874731000)
	})

	/**
	 * For transition from 'LwM2M Asset Tracker v2' objects to 'nRF Asset Tracker Reported' objects
	 *
	 * @see https://github.com/MLopezJ/asset-tracker-lwm2m-js/blob/saga/documents/nRFAssetTracker.md
	 */
	void it(`should return a warning if the dependent LwM2M object for creating the 'bat' object is undefined`, () => {
		const result = getBat(undefined) as { warning: UndefinedLwM2MObjectWarning }
		assert.equal(
			result.warning.message,
			`'bat' object can not be created because LwM2M object id '3' is undefined`,
		)
		assert.deepEqual(
			result.warning.undefinedLwM2MObject,
			parseURN(Device_3_urn),
		)
	})

	void it(`should return an error if the result of the conversion does not meet the expected types`, () => {
		const device = {
			'0': 'Nordic Semiconductor ASA',
			'1': 'Thingy:91',
			'2': '351358815340515',
			'3': '22.8.1+0',
			// '7':  [2754], required value missed
			'11': [0],
			'13': 1675874731,
			'16': 'UQ',
			'19': '3.2.1',
		}
		const bat = getBat(device) as { error: ValidationError }
		const message = bat.error.description[0]?.message
		const checkMessage = message?.includes("must have required property 'v'")
		const keyword = bat.error.description[0]?.keyword

		assert.equal(checkMessage, true)
		assert.equal(keyword, 'required')
	})
})
