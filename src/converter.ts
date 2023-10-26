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
import { unwrapResult } from './utils/unwrapResult.js'

/**
 * Expected input type
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
export type ConversionResult<Result extends Record<string, unknown>> =
	| { result: Result }
	| { error: ValidationError | UndefinedLwM2MObjectWarning }

/**
 * convert 'LwM2M Asset Tracker v2' format into 'nRF Asset Tracker reported' format
 */
export const converter = (
	LwM2MAssetTracker: LwM2MAssetTrackerV2,
	onError?: (error: ValidationError | UndefinedLwM2MObjectWarning) => unknown,
): Static<typeof nRFAssetTrackerReported> => {
	const unwrap = unwrapResult(onError)

	const convertedBat = unwrap(getBat(LwM2MAssetTracker[Device_3_urn]))
	const convertedDev = unwrap(getDev(LwM2MAssetTracker[Device_3_urn]))
	const convertedEnv = unwrap(
		getEnv({
			temperature: LwM2MAssetTracker[Temperature_3303_urn],
			humidity: LwM2MAssetTracker[Humidity_3304_urn],
			pressure: LwM2MAssetTracker[Pressure_3323_urn],
		}),
	)
	const convertedGnss = unwrap(getGnss(LwM2MAssetTracker[Location_6_urn]))
	const convertedRoam = unwrap(
		getRoam({
			connectivityMonitoring: LwM2MAssetTracker[ConnectivityMonitoring_4_urn],
			device: LwM2MAssetTracker[Device_3_urn],
		}),
	)
	const convertedCfg = unwrap(getCfg(LwM2MAssetTracker[Config_50009_urn]))

	const output: Static<typeof nRFAssetTrackerReported> = {}

	if (convertedBat !== undefined) output['bat'] = convertedBat
	if (convertedDev !== undefined) output['dev'] = convertedDev
	if (convertedEnv !== undefined) output['env'] = convertedEnv
	if (convertedGnss !== undefined) output['gnss'] = convertedGnss
	if (convertedRoam !== undefined) output['roam'] = convertedRoam
	if (convertedCfg !== undefined) output['cfg'] = convertedCfg

	return output
}
