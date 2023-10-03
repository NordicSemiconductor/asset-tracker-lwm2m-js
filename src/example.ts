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

const lwM2MAssetTrackerV2: LwM2MAssetTrackerV2 = {
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

const warningCallback = (warning: Error) => console.log(warning)
const errorCallback = (error: Error) => console.log(error)
const result = converter(lwM2MAssetTrackerV2, warningCallback, errorCallback)
console.log(result)

/**
{
	bat: { v: 2754, ts: 1675874731000 },
	dev: {
		v: {
			imei: '351358815340515',
			modV: '22.8.1+0',
			brdV: 'Nordic Semiconductor ASA',
		},
		ts: 1675874731000,
	},
	env: { v: { temp: 27.18, hum: 24.057, atmp: 10 }, ts: 1675874731000 },
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
}

 */
