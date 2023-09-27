import { describe, it } from 'node:test'
import assert from 'node:assert'
import {
	type ConnectivityMonitoring_4,
	ConnectivityMonitoring_4_urn,
} from '../schemas/index.js'
import { getRoam } from './getRoam.js'
import { parseURN } from '@nordicsemiconductor/lwm2m-types'
import type { UndefinedLwM2MObjectWarning } from './UndefinedLwM2MObjectWarning.js'
import type { ValidationError } from './ValidationError.js'

void describe('getRoam', () => {
	void it(`should create the 'roam' object expected by 'nRF Asset Tracker Reported'`, () => {
		const connectivityMonitoring = {
			'0': 6,
			'1': [7, 6],
			'2': -85,
			'3': 23,
			'4': ['10.160.120.155'],
			'8': 34237196,
			'9': 20,
			'10': 242,
			'12': 12,
		}

		const device = {
			'0': 'Nordic Semiconductor ASA',
			'1': 'Thingy:91',
			'2': '351358815340515',
			'3': '22.8.1+0',
			'7': [2754],
			'11': [0],
			/**
			 * Timestamp is taken from resource 13.
			 *
			 * @see {@link ../../adr/010-roam-timestamp-not-supported-by-lwm2m.md}
			 *
			 */
			'13': 1675874731,
			'16': 'UQ',
			'19': '3.2.1',
		}

		const roam = getRoam({ connectivityMonitoring, device }) as {
			result: unknown
		}
		const expected = {
			v: {
				nw: '6', //'NB-IoT',
				rsrp: -85,
				area: 12,
				mccmnc: 24220,
				cell: 34237196,
				ip: '10.160.120.155',
			},
			ts: 1675874731000,
		}
		assert.deepEqual(roam.result, expected)
	})

	/**
	 * For transition from 'LwM2M Asset Tracker v2' objects to 'nRF Asset Tracker Reported' objects
	 *
	 * @see {@link ../../documents/nRFAssetTracker.md}
	 */
	void it(`should return a warning if the dependent LwM2M object for creating the 'roam' object is undefined`, () => {
		const connectivityMonitoring = undefined
		const device = undefined
		const result = getRoam({ connectivityMonitoring, device }) as {
			warning: UndefinedLwM2MObjectWarning
		}
		assert.equal(
			result.warning.message,
			`'roam' object can not be created because LwM2M object id '4' is undefined`,
		)
		assert.deepEqual(
			result.warning.undefinedLwM2MObject,
			parseURN(ConnectivityMonitoring_4_urn),
		)
	})

	void it(`should return an error if the result of the conversion does not meet the expected types`, () => {
		const connectivityMonitoring = {
			'0': 6,
			'1': [6, 7],
			'2': -85,
			'3': 23,
			// required resource is missing '4': ['10.160.120.155']
			'8': 34237196,
			'9': 20,
			'10': 242,
			'12': 12,
		} as ConnectivityMonitoring_4
		const device = {
			'0': 'Nordic Semiconductor ASA',
			'1': 'Thingy:91',
			'2': '351358815340515',
			'3': '22.8.1+0',
			'7': [2754],
			'11': [0],
			/**
			 * Timestamp is taken from resource 13.
			 *
			 * @see {@link ../../adr/010-roam-timestamp-not-supported-by-lwm2m.md}
			 */
			'13': 1675874731,
			'16': 'UQ',
			'19': '3.2.1',
		}
		const result = getRoam({ connectivityMonitoring, device }) as {
			error: ValidationError
		}
		const instancePathError = result.error.description[0]?.instancePath
		const message = result.error.description[0]?.message
		const checkMessage = message?.includes("must have required property 'ip'")
		const keyword = result.error.description[0]?.keyword

		assert.equal(instancePathError, `/v`)
		assert.equal(checkMessage, true)
		assert.equal(keyword, 'required')
	})
})
