import { describe, it } from 'node:test'
import assert from 'node:assert'
import type { Config_50009 } from '../schemas/Config_50009.js'
import { getCfg } from './getCfg.js'
import { TypeError, Warning } from '../converter.js'

void describe('getCfg', () => {
	void it(`should create the 'cfg' object expected by 'nRF Asset Tracker Reported'`, () => {
		const object: Config_50009 = {
			'0': true,
			'1': 120,
			'2': 120,
			'3': 600,
			'4': 7200,
			'5': 8.5,
			'6': true,
			'7': false,
			'8': 2.5,
			'9': 0.5,
		}

		const expected = {
			loct: 120,
			act: true,
			actwt: 120,
			mvres: 600,
			mvt: 7200,
			accath: 8.5,
			accith: 2.5,
			accito: 0.5,
			nod: [],
		}

		const cfg = getCfg(object) as { result: unknown }
		assert.deepEqual(cfg.result, expected)
	})

	/**
	 * For transition from 'LwM2M Asset Tracker v2' objects to 'nRF Asset Tracker Reported' objects
	 *
	 * @see https://github.com/MLopezJ/asset-tracker-lwm2m-js/blob/saga/documents/nRFAssetTracker.md
	 */
	void it(`should return a warning if the dependent LwM2M object for creating the 'cfg' object is undefined`, () => {
		const cfg = getCfg(undefined) as { warning: Warning }
		assert.equal(cfg.warning.message, 'Cfg object can not be created')
		assert.equal(cfg.warning.description, 'Config (50009) object is undefined')
	})

	void it('should return an error if the result of the conversion does not meet the expected types', () => {
		const object = {
			'0': true,
			'1': 120,
			'2': 120,
			'3': 600,
			'4': 7200,
			// '5': 8.5, // required value is missing
			'6': true,
			'7': false,
			'8': 2.5,
			'9': 0.5,
		} as Config_50009

		const config = getCfg(object) as { error: TypeError }
		const message = config.error.description[0]?.message
		const keyword = config.error.description[0]?.keyword

		assert.equal(message, "must have required property 'accath'")
		assert.equal(keyword, 'required')
	})
})
