import { describe, it } from 'node:test'
import assert from 'node:assert'
import {
	Device_3_urn,
	ConnectivityMonitoring_4_urn,
	Location_6_urn,
	Temperature_3303_urn,
	Humidity_3304_urn,
	Pressure_3323_urn,
	Config_50009_urn,
} from './schemas/index.js'
import { converter, type LwM2MAssetTrackerV2 } from './converter.js'
import { UndefinedLwM2MObjectWarning } from './utils/UndefinedLwM2MObjectWarning.js'
import { ValidationError } from './utils/ValidationError.js'

void describe('converter', () => {
	void it(`should convert 'LwM2M Asset Tracker v2' format into 'nRF Asset Tracker reported' format`, () => {
		const input = {
			[Device_3_urn]: {
				'0': 'Nordic Semiconductor ASA',
				'1': 'Thingy:91',
				'2': '351358815340515',
				'3': '22.8.1+0',
				'7': [2754],
				'11': [0],
				'13': 1675874731,
				'16': 'UQ',
				'19': '3.2.1',
			},

			[ConnectivityMonitoring_4_urn]: {
				'0': 6,
				'1': [6, 7],
				'2': -85,
				'3': 23,
				'4': ['10.160.120.155'],
				'8': 34237196,
				'9': 20,
				'10': 242,
				'12': 12,
			},

			[Location_6_urn]: {
				'0': -43.5723,
				'1': 153.2176,
				'2': 2,
				'3': 24.798573,
				'5': 1665149633,
				'6': 0.579327,
			},

			[Temperature_3303_urn]: [
				{
					'5601': 27.18,
					'5602': 27.71,
					'5700': 27.18,
					'5701': 'Cel',
					'5518': 1675874731,
				},
			],

			[Humidity_3304_urn]: [
				{
					'5601': 23.535,
					'5602': 24.161,
					'5700': 24.057,
					'5701': '%RH',
					'5518': 1675874731,
				},
			],

			[Pressure_3323_urn]: [
				{
					'5601': 101697,
					'5602': 101705,
					'5700': 10,
					'5701': 'Pa',
					'5518': 1675874731,
				},
			],

			[Config_50009_urn]: {
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
			},
		}

		const expected = {
			bat: {
				v: 2754,
				ts: 1675874731000,
			},
			env: {
				v: {
					temp: 27.18,
					hum: 24.057,
					atmp: 10,
				},
				ts: 1675874731000,
			},
			gnss: {
				v: {
					lng: 153.2176,
					lat: -43.5723,
					acc: 24.798573,
					alt: 2,
					spd: 0.579327,
				},
				ts: 1665149633000,
			},
			cfg: {
				loct: 120,
				act: true,
				actwt: 120,
				mvres: 600,
				mvt: 7200,
				accath: 8.5,
				accith: 2.5,
				accito: 0.5,
				nod: [],
			},
			dev: {
				v: {
					imei: '351358815340515',
					modV: '22.8.1+0',
					brdV: 'Nordic Semiconductor ASA',
				},
				ts: 1675874731000,
			},
			roam: {
				v: {
					nw: '6',
					rsrp: -85,
					area: 12,
					mccmnc: 24220,
					cell: 34237196,
					ip: '10.160.120.155',
				},
				ts: 1675874731000,
			},
		}

		const result = converter(input)

		assert.deepEqual(result.bat, expected.bat)
		assert.deepEqual(result.cfg, expected.cfg)
		assert.deepEqual(result.dev, expected.dev)
		assert.deepEqual(result.env, expected.env)
		assert.deepEqual(result.roam, expected.roam)
		assert.deepEqual(result.gnss, expected.gnss)
	})

	void it(`should create output even when some expected objects in the input are missing`, () => {
		/**
		 * Check the data transition document to see the dependency between
		 * 'LwM2M Asset Tracker v2' and 'Asset Tracker reported' objects
		 * @see {@link ../README.md#lwm2m-to-json-mapping}
		 */
		const input = {
			[Device_3_urn]: {
				'0': 'Nordic Semiconductor ASA',
				'1': 'Thingy:91',
				'2': '351358815340515',
				'3': '22.8.1+0',
				'7': [2754],
				'11': [0],
				'13': 1675874731,
				'16': 'UQ',
				'19': '3.2.1',
			},
		}

		const expected = {
			bat: {
				v: 2754,
				ts: 1675874731000,
			},
			dev: {
				v: {
					imei: '351358815340515',
					modV: '22.8.1+0',
					brdV: 'Nordic Semiconductor ASA',
				},
				ts: 1675874731000,
			},
		}

		const result = converter(input)
		assert.deepEqual(result, expected)
	})

	void it(`should trigger a warning if an 'Asset Tracker reported' object can not be created because equivalent LwM2M object is undefined`, (context) => {
		const input = {
			[Device_3_urn]: {
				'0': 'Nordic Semiconductor ASA',
				'1': 'Thingy:91',
				'2': '351358815340515',
				'3': '22.8.1+0',
				'7': [2754],
				'11': [0],
				'13': 1675874731,
				'16': 'UQ',
				'19': '3.2.1',
			},
		}

		const onError = context.mock.fn()
		converter(input, onError)

		/**
		 * 4 objects (env, gnss, cfg, roam) from 'Asset Tracker reported' were not generated
		 * because dependent objects were not present in input, thats why it is expecting
		 * the warning callback to be called 4 times
		 *
		 * @see {@link ../README.md#lwm2m-to-json-mapping}
		 */
		assert.strictEqual(onError.mock.callCount(), 4)
	})

	void it(`should trigger an error if an 'Asset Tracker reported' object can not be created because conversion went wrong`, (context) => {
		const input = {
			[Device_3_urn]: {
				'0': 'Nordic Semiconductor ASA',
				'1': 'Thingy:91',
				'2': '351358815340515',
				'3': '22.8.1+0',
				'7': [2754],
				'11': [0],
				//'13': 1675874731,
				'16': 'UQ',
				'19': '3.2.1',
			},
		}

		const errorCallback = context.mock.fn()
		converter(input, errorCallback)

		/**
		 * Bat and Dev objects from 'Asset Tracker reported' uses resource 13 from LwM2M object id 3 as the timestamp value,
		 * thats why it is expected the error callback to be called 2 times
		 * @see {@link ../README.md#lwm2m-to-json-mapping}
		 */
		assert.strictEqual(
			errorCallback.mock.calls.filter(
				(call) => call.arguments[0] instanceof ValidationError,
			).length,
			2,
		)
	})

	void it(`should select first instance when LwM2M object is an array`, () => {
		const input = {
			[Temperature_3303_urn]: [
				{
					// First instance of Temperature object
					'5601': 27.18,
					'5602': 27.71,
					'5700': 27.18,
					'5701': 'Cel',
					'5518': 1675874731,
				},
				{
					'5601': 0,
					'5602': 0,
					'5700': 0,
					'5701': 'Cel',
					'5518': 1675874731,
				},
				{
					'5601': 0,
					'5602': 0,
					'5700': 0,
					'5701': 'Cel',
					'5518': 1675874731,
				},
			],

			[Humidity_3304_urn]: [
				{
					// First instance of Humidity object
					'5601': 23.535,
					'5602': 24.161,
					'5700': 24.057,
					'5701': '%RH',
					'5518': 1675874731,
				},
				{
					'5601': 0,
					'5602': 0,
					'5700': 0,
					'5701': '%RH',
					'5518': 1675874731,
				},
			],

			[Pressure_3323_urn]: [
				{
					// First instance of Pressure object
					'5601': 101697,
					'5602': 101705,
					'5700': 10,
					'5701': 'Pa',
					'5518': 1675874731,
				},
				{
					'5601': 0,
					'5602': 0,
					'5700': 0,
					'5701': 'Pa',
					'5518': 1675874731,
				},
				{
					'5601': 0,
					'5602': 0,
					'5700': 0,
					'5701': 'Pa',
					'5518': 1675874731,
				},
			],
		}

		const output = {
			env: {
				v: {
					temp: 27.18,
					hum: 24.057,
					atmp: 10,
				},
				ts: 1675874731000,
			},
		}
		assert.deepEqual(converter(input), output)
	})

	void it(`should select first element when LwM2M resource is an array`, () => {
		const input = {
			[Device_3_urn]: {
				'0': 'Nordic Semiconductor ASA',
				'1': 'Thingy:91',
				'2': '351358815340515',
				'3': '22.8.1+0',
				'7': [2754, 0, 1, 2, 3, 4, 5, 6, 7], // array resource
				'11': [0],
				'13': 1675874731,
				'16': 'UQ',
				'19': '3.2.1',
			},
		}

		const output = {
			bat: {
				v: 2754,
				ts: 1675874731000,
			},
			dev: {
				ts: 1675874731000,
				v: {
					brdV: 'Nordic Semiconductor ASA',
					imei: '351358815340515',
					modV: '22.8.1+0',
				},
			},
		}

		assert.deepEqual(converter(input), output)
	})

	void describe(`Dependency between 'LwM2M Asset Tracker v2' and 'nRF Asset Tracker reported'`, () => {
		const LwM2MAssetTrackerV2 = {
			[Device_3_urn]: {
				'0': 'Nordic Semiconductor ASA',
				'1': 'Thingy:91',
				'2': '351358815340515',
				'3': '22.8.1+0',
				'7': [2754],
				'11': [0],
				'13': 1675874731,
				'16': 'UQ',
				'19': '3.2.1',
			},

			[ConnectivityMonitoring_4_urn]: {
				'0': 6,
				'1': [6, 7],
				'2': -85,
				'3': 23,
				'4': ['10.160.120.155'],
				'8': 34237196,
				'9': 20,
				'10': 242,
				'12': 12,
			},

			[Location_6_urn]: {
				'0': -43.5723,
				'1': 153.2176,
				'2': 2,
				'3': 24.798573,
				'5': 1665149633,
				'6': 0.579327,
			},

			[Temperature_3303_urn]: [
				{
					'5601': 27.18,
					'5602': 27.71,
					'5700': 27.18,
					'5701': 'Cel',
					'5518': 1675874731,
				},
			],

			[Humidity_3304_urn]: [
				{
					'5601': 23.535,
					'5602': 24.161,
					'5700': 24.057,
					'5701': '%RH',
					'5518': 1675874731,
				},
			],

			[Pressure_3323_urn]: [
				{
					'5601': 101697,
					'5602': 101705,
					'5700': 10,
					'5701': 'Pa',
					'5518': 1675874731,
				},
			],

			[Config_50009_urn]: {
				'0': true,
				'1': 120,
				'2': 120,
				'3': 600,
				'4': 7200,
				'5': 8.5,
				'6': false,
				'7': true,
				'8': 2.5,
				'9': 0.5,
			},
		}
		/**
		 * @see {@link ../README.md#lwm2m-to-json-mapping}
		 */
		const objectsRelation = [
			{ [Device_3_urn]: ['bat', 'dev', 'roam'] },
			{ [ConnectivityMonitoring_4_urn]: ['roam'] },
			{ [Location_6_urn]: ['gnss'] },
			{ [Temperature_3303_urn]: ['env'] },
			{ [Humidity_3304_urn]: ['env'] },
			{ [Pressure_3323_urn]: ['env'] },
			{ [Config_50009_urn]: ['cfg'] },
		]

		objectsRelation.forEach((element) => {
			const LwM2MObjectId = Object.keys(element)[0]
			const dependentnRFAssetTrackerReportedObjects = Object.values(element)[0]

			void it(`without LwM2M object ${LwM2MObjectId}, the object(s) ${dependentnRFAssetTrackerReportedObjects} from 'nRF Asset Tracker reported' will not be generated`, () => {
				// remove LwM2M object from LwM2MAssetTrackerV2
				const LwM2MAssetTrackerV2Updated = {
					...LwM2MAssetTrackerV2,
					[LwM2MObjectId as keyof LwM2MAssetTrackerV2]: undefined,
				}
				converter(LwM2MAssetTrackerV2Updated, (error) => {
					assert.equal(
						dependentnRFAssetTrackerReportedObjects?.includes(
							(error as UndefinedLwM2MObjectWarning)
								.notCreatednRFAssetTrackerReportedObject,
						),
						true,
					)
				})
			})
		})
	})
})
