# `asset_tracker_v2` LwM2M JSON to nRF Asset Tracker JSON

```
TODO:
* Update link related to test and release badge. Use NordicSemiconductor instead of MLopezJ
* release to NPM
```

[![Test and Release](https://github.com/MLopezJ/LwM2M-Asset-Tracker-V2-to-Asset-Tracker-web-app/actions/workflows/test-and-release.yaml/badge.svg)](https://github.com/MLopezJ/LwM2M-Asset-Tracker-V2-to-Asset-Tracker-web-app/actions/workflows/test-and-release.yaml)
[![Renovate](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier/)
[![ESLint: TypeScript](https://img.shields.io/badge/ESLint-TypeScript-blue.svg)](https://github.com/typescript-eslint/typescript-eslint)

Converts a JSON document containing the `asset_tracker_v2` device and sensor
data encoded as LwM2M to the JSON document required by nRF Asset Tracker.

## LwM2M to JSON mapping

Data transition from `asset_tracker_v2` LwM2M to `nRF Asset Tracker reported`

| LwM2M ID                                                                                                                                        | LwM2M Obj Version | LwM2M version | Name                    | nRF Asset Tracker Reported                                                   |
| ----------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ------------- | ----------------------- | ---------------------------------------------------------------------------- |
| [3](https://github.com/OpenMobileAlliance/lwm2m-registry/blob/prod/version_history/3-1_1.xml)                                                   | 1.2               | 1.1           | Device                  | [bat](./docs/battery.md), [dev](./docs/device.md), [roam](./docs/roaming.md) |
| [4](https://github.com/OpenMobileAlliance/lwm2m-registry/blob/prod/version_history/4-1_1.xml)                                                   | 1.3               | 1.1           | Connectivity Monitoring | [roam](./docs/roaming.md)                                                    |
| [6](https://github.com/OpenMobileAlliance/lwm2m-registry/blob/prod/version_history/6-1_0.xml)                                                   | 1.0               | 1.0           | Location                | [gnss](./docs/gnss.md)                                                       |
| [3303](https://github.com/OpenMobileAlliance/lwm2m-registry/blob/prod/version_history/3303-1_1.xml)                                             | 1.1               | 1.0           | Temperature             | [env](./docs/environment.md)                                                 |
| [3304](https://github.com/OpenMobileAlliance/lwm2m-registry/blob/prod/version_history/3304-1_1.xml)                                             | 1.1               | 1.0           | Humidity                | [env](./docs/environment.md)                                                 |
| [3323](https://github.com/OpenMobileAlliance/lwm2m-registry/blob/prod/version_history/3323-1_1.xml)                                             | 1.1               | 1.0           | Pressure                | [env](./docs/environment.md)                                                 |
| [50009](https://github.com/nrfconnect/sdk-nrf/blob/v2.4.0/applications/asset_tracker_v2/src/cloud/lwm2m_integration/config_object_descript.xml) |                   |               | Config                  | [cfg](./docs/config.md)                                                      |

## Installation

```
npm i --save-exact @nordicsemiconductor/asset-tracker-lwm2m
```

## Running the tests

After cloning the repository:

```
npm ci
npm test
```

## Example usage

```TypeScript
import {
	converter,
	type LwM2MAssetTrackerV2,
} from '@nordicsemiconductor/asset-tracker-lwm2m'

const lwM2MAssetTrackerV2 = {} as LwM2MAssetTrackerV2 // Object with Asset Tracker v2 objects...
const result = converter(lwM2MAssetTrackerV2)
console.log(result)
```

See [./src/example.ts](./src/example.ts) for more details.

### Example input

A JSON document containing the
[`asset_tracker_v2`](https://developer.nordicsemi.com/nRF_Connect_SDK/doc/latest/nrf/applications/asset_tracker_v2/README.html)
device and sensor data encoded as LwM2M, following the schema in
[`lwm2m-types-js`](https://github.com/NordicSemiconductor/lwm2m-types-js).

```TypeScript
import {
  Device_3_urn,
  ConnectivityMonitoring_4_urn,
  Location_6_urn,
  Temperature_3303_urn,
  Humidity_3304_urn,
  Pressure_3323_urn,
  Config_50009_urn
} from "@nordicsemiconductor/lwm2m-types";

export const input = {
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
```

### Example output

The output is the
[nRF Asset Tracker Reported](https://github.com/NordicSemiconductor/asset-tracker-cloud-docs/blob/v31.0.0/docs/cloud-protocol/Reported.ts)
object.

```TypeScript
const result = {
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
```

## Architecture decision records (ADRs)

See [./adr](./adr/).
