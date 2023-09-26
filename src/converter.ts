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
import { getBat } from './utils/getBat.js'
import { getDev } from './utils/getDev.js'
import { getEnv } from './utils/getEnv.js'
import { getGnss } from './utils/getGnss.js'
import { getRoam } from './utils/getRoam.js'
import { getCfg } from './utils/getCfg.js'

import { Type, type Static } from '@sinclair/typebox'
import { parseURN } from '@nordicsemiconductor/lwm2m-types'

/**
 * Expected input type
 *
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
 *
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

type ErrorDescription = {
	instancePath: string
	schemaPath: string
	keyword: string
	params: Record<string, unknown>
	message?: string
}

/**
 * Error handler type
 *
 * @see https://github.com/MLopezJ/asset-tracker-lwm2m-js/blob/saga/adr/007-warning-and-error-handling.md
 */
export class ValidationError extends Error {
	description: ErrorDescription[]

	constructor(description: ErrorDescription[]) {
		super(`error validating type: ${JSON.stringify(description, null, 2)}`)
		this.description = description
	}
}

/**
 * Warning handler type
 *
 * @see https://github.com/MLopezJ/asset-tracker-lwm2m-js/blob/saga/adr/007-warning-and-error-handling.md
 */
export class UndefinedLwM2MObjectWarning extends Error {
	undefinedLwM2MObject: {
		ObjectID: string
		ObjectVersion: string
		LWM2MVersion: string
	}

	constructor({
		nRFAssetTrackerReportedId,
		LwM2MObjectUrn,
	}: {
		nRFAssetTrackerReportedId: keyof nRFAssetTrackerReportedType
		LwM2MObjectUrn: keyof LwM2MAssetTrackerV2
	}) {
		const LwM2MObjectInfo = parseURN(LwM2MObjectUrn)
		super(
			`'${nRFAssetTrackerReportedId}' object can not be created because LwM2M object id '${LwM2MObjectInfo.ObjectID}' is undefined`,
		)
		this.undefinedLwM2MObject = LwM2MObjectInfo
	}
}

/**
 * convert LwM2M Asset Tracker v2 format into nRF Asset Tracker format
 */
export const converter = (
	inputAssetTracker: LwM2MAssetTrackerV2,
	onWarning?: (warning: UndefinedLwM2MObjectWarning) => unknown,
	onError?: (error: ValidationError) => unknown,
): typeof nRFAssetTrackerReported => {
	const convertedAssetTracker = {} as typeof nRFAssetTrackerReported

	const assetTrackerReportedData = {
		bat: getBat(inputAssetTracker[Device_3_urn]),
		dev: getDev(inputAssetTracker[Device_3_urn]),
		env: getEnv({
			temperature: inputAssetTracker[Temperature_3303_urn],
			humidity: inputAssetTracker[Humidity_3304_urn],
			pressure: inputAssetTracker[Pressure_3323_urn],
		}),
		gnss: getGnss(inputAssetTracker[Location_6_urn]),
		roam: getRoam({
			connectivityMonitoring: inputAssetTracker[ConnectivityMonitoring_4_urn],
			device: inputAssetTracker[Device_3_urn],
		}),
		cfg: getCfg(inputAssetTracker[Config_50009_urn]),
	}

	Object.entries(assetTrackerReportedData).forEach(
		([object, convertedObject]) => {
			if ('result' in convertedObject)
				convertedAssetTracker[object] = convertedObject.result
			else {
				'warning' in convertedObject
					? onWarning?.(convertedObject.warning)
					: onError?.(convertedObject.error)
			}
		},
	)

	return convertedAssetTracker
}
