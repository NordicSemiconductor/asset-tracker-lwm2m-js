import { describe, it } from 'node:test'
import assert from 'node:assert'
import { type Config_50009, Config_50009_urn } from '../schemas/Config_50009.js'
import { getCfg } from './getCfg.js'
import { parseURN } from '@nordicsemiconductor/lwm2m-types'
import type { UndefinedLwM2MObjectWarning } from './UndefinedLwM2MObjectWarning.js'
import type { ValidationError } from './ValidationError.js'
import type { ConfigData } from '@nordicsemiconductor/asset-tracker-cloud-docs/protocol'

void describe('getCfg', () => {
	void it(`should create the 'cfg' object expected by 'nRF Asset Tracker Reported'`, () => {
		const object: Config_50009 = {
			'0': true,
			'1': 120,
			'2': 120,
			'3': 600,
			'4': 7200,
			'5': 8.5,
			'6': false,
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

	void it(`should return a warning if the dependent LwM2M object to create the 'cfg' object is not defined`, () => {
		const cfg = getCfg(undefined) as { error: UndefinedLwM2MObjectWarning }
		assert.equal(
			cfg.error.message,
			`'cfg' object can not be created because LwM2M object id '50009' is undefined`,
		)
		assert.deepEqual(cfg.error.undefinedLwM2MObject, parseURN(Config_50009_urn))
	})

	void it('should return an error if the result of the conversion does not meet the schema definition', () => {
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

		const config = getCfg(object) as {
			error: ValidationError
		}
		const message = config.error.description[0]?.message
		const checkMessage = message?.includes(
			"must have required property 'accath'",
		)
		const keyword = config.error.description[0]?.keyword

		assert.equal(checkMessage, true)
		assert.equal(keyword, 'required')
	})

	void describe(`create 'nod' array value`, () => {
		const object: Config_50009 = {
			'0': true,
			'1': 120,
			'2': 120,
			'3': 600,
			'4': 7200,
			'5': 8.5,
			'6': false,
			'7': false,
			'8': 2.5,
			'9': 0.5,
		}

		type testTemplate = {
			resources: { 6: boolean; 7: boolean }
			expected: string[]
		}[]
		;(
			[
				{ resources: { 6: false, 7: false }, expected: [] },
				{ resources: { 6: true, 7: false }, expected: ['gnss'] },
				{ resources: { 6: false, 7: true }, expected: ['ncell'] },
				{ resources: { 6: true, 7: true }, expected: ['gnss', 'ncell'] },
			] as testTemplate
		).forEach(({ resources, expected }) => {
			void it(`should return '${expected}' as 'nod' value when resource 'GNSS enable' (id 6) is '${resources[6]}' and 'Neighbor cell measurements enable' (id 7) '${resources[7]}'`, () => {
				const cfg = getCfg({
					...object,
					'6': resources[6],
					'7': resources[7],
				}) as {
					result: ConfigData
				}
				assert.deepEqual(cfg.result.nod, expected)
			})
		})
	})
})
