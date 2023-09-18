import { describe, it } from 'node:test'
import assert from 'node:assert'
import type { ConnectivityMonitoring_4 } from '@nordicsemiconductor/lwm2m-types'
import { getRoam } from './getRoam.js'
import { TypeError, Warning } from '../converter.js'

void describe('getRoam', () => {
	void it(`should create roam object`, () => {
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
			 * @see https://github.com/MLopezJ/asset-tracker-lwm2m-js/blob/saga/adr/010-roam-timestamp-not-supported-by-lwm2m.md
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
				band: 3, // TODO: remove this
				eest: 5, // TODO: remove this
			},
			ts: 1675874731000,
		}
		assert.deepEqual(roam.result, expected)
	})

	void it(`should return warning if Connectivity Monitoring (4) object is missing`, () => {
		const connectivityMonitoring = undefined
		const device = undefined
		const result = getRoam({ connectivityMonitoring, device }) as {
			warning: Warning
		}
		assert.equal(result.warning.message, 'Roam object can not be created')
		assert.equal(
			result.warning.description,
			'Connectivity Monitoring (4) object is undefined',
		)
	})

	void it(`should return error if required resource is missing`, () => {
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
			 * @see https://github.com/MLopezJ/asset-tracker-lwm2m-js/blob/saga/adr/010-roam-timestamp-not-supported-by-lwm2m.md
			 */
			'13': 1675874731,
			'16': 'UQ',
			'19': '3.2.1',
		}
		const result = getRoam({ connectivityMonitoring, device }) as {
			error: TypeError
		}
		const instancePathError = result.error.description[0]?.instancePath
		const message = result.error.description[0]?.message
		const keyword = result.error.description[0]?.keyword

		assert.equal(instancePathError, `/v`)
		assert.equal(message, "must have required property 'ip'")
		assert.equal(keyword, 'required')
	})
})
