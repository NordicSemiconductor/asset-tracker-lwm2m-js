import {
	Device_3_urn,
	ConnectivityMonitoring_4_urn,
	Location_6_urn,
	Temperature_3303_urn,
	Humidity_3304_urn,
	Pressure_3323_urn,
	Config_50009_urn,
} from './schemas/index.js'
import type {
	Device_3,
	ConnectivityMonitoring_4,
	Location_6,
	Temperature_3303,
	Humidity_3304,
	Pressure_3323,
	Config_50009,
} from './schemas/index.js'
import {
	Config,
	Device,
	RoamingInfo,
	Battery,
	Environment,
	GNSS,
} from '@nordicsemiconductor/asset-tracker-cloud-docs/protocol'
import type { UndefinedLwM2MObjectWarning } from './utils/UndefinedLwM2MObjectWarning.js'
import type { ValidationError } from './utils/ValidationError.js'
import { getBat } from './utils/getBat.js'
import { getDev } from './utils/getDev.js'
import { getEnv } from './utils/getEnv.js'
import { getGnss } from './utils/getGnss.js'
import { getRoam } from './utils/getRoam.js'
import { getCfg } from './utils/getCfg.js'
import { Type, type Static } from '@sinclair/typebox'

/**
 * Expected input type
 * @see https://github.com/MLopezJ/asset-tracker-lwm2m-js/blob/saga/adr/006-result-generation.md
 */
export type LwM2MAssetTrackerV2 = {
	[Device_3_urn]?: Device_3
	[ConnectivityMonitoring_4_urn]?: ConnectivityMonitoring_4
	[Location_6_urn]?: Location_6
	[Temperature_3303_urn]?: Temperature_3303
	[Humidity_3304_urn]?: Humidity_3304
	[Pressure_3323_urn]?: Pressure_3323
	[Config_50009_urn]?: Config_50009
}

/**
 * Expected output type
 * @see https://github.com/MLopezJ/asset-tracker-lwm2m-js/blob/saga/adr/006-result-generation.md
 */
export const nRFAssetTrackerReported = Type.Object({
	cfg: Type.Optional(Config),
	dev: Type.Optional(Device),
	roam: Type.Optional(RoamingInfo),
	bat: Type.Optional(Battery),
	env: Type.Optional(Environment),
	gnss: Type.Optional(GNSS),
})

export type nRFAssetTrackerReportedType = Static<typeof nRFAssetTrackerReported>

/**
 * convert 'LwM2M Asset Tracker v2' format into 'nRF Asset Tracker reported' format
 */
export const converter = (
	LwM2MAssetTracker: LwM2MAssetTrackerV2,
	onWarning?: (warning: UndefinedLwM2MObjectWarning) => unknown,
	onError?: (error: ValidationError) => unknown,
): typeof nRFAssetTrackerReported => {
	const conversionResult = {} as typeof nRFAssetTrackerReported

	const nRFAssetTrackerReportedObjects = {
		bat: getBat(LwM2MAssetTracker[Device_3_urn]),
		dev: getDev(LwM2MAssetTracker[Device_3_urn]),
		env: getEnv({
			temperature: LwM2MAssetTracker[Temperature_3303_urn],
			humidity: LwM2MAssetTracker[Humidity_3304_urn],
			pressure: LwM2MAssetTracker[Pressure_3323_urn],
		}),
		gnss: getGnss(LwM2MAssetTracker[Location_6_urn]),
		roam: getRoam({
			connectivityMonitoring: LwM2MAssetTracker[ConnectivityMonitoring_4_urn],
			device: LwM2MAssetTracker[Device_3_urn],
		}),
		cfg: getCfg(LwM2MAssetTracker[Config_50009_urn]),
	}

	Object.entries(nRFAssetTrackerReportedObjects).forEach(
		([objectId, convertedObject]) => {
			if ('result' in convertedObject)
				conversionResult[objectId] = convertedObject.result
			else {
				'warning' in convertedObject
					? onWarning?.(convertedObject.warning)
					: onError?.(convertedObject.error)
			}
		},
	)

	return conversionResult
}
