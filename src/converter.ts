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
export class TypeError extends Error {
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
	input: LwM2MAssetTrackerV2,
	onWarning?: (warning: UndefinedLwM2MObjectWarning) => unknown,
	onError?: (error: TypeError) => unknown,
): typeof nRFAssetTrackerReported => {
	const result = {} as typeof nRFAssetTrackerReported
	const device = input[Device_3_urn]
	const temperature = input[Temperature_3303_urn]
	const humidity = input[Humidity_3304_urn]
	const pressure = input[Pressure_3323_urn]
	const location = input[Location_6_urn]
	const connectivityMonitoring = input[ConnectivityMonitoring_4_urn]
	const config = input[Config_50009_urn]

	const bat = getBat(device)
	if ('result' in bat) result['bat'] = bat.result
	else {
		'warning' in bat ? onWarning?.(bat.warning) : onError?.(bat.error)
	}

	const dev = getDev(device)
	if ('result' in dev) result['dev'] = dev.result
	else {
		'warning' in dev ? onWarning?.(dev.warning) : onError?.(dev.error)
	}

	const env = getEnv({
		temperature,
		humidity,
		pressure,
	})
	if ('result' in env) result['env'] = env.result
	else {
		'warning' in env ? onWarning?.(env.warning) : onError?.(env.error)
	}

	const gnss = getGnss(location)
	if ('result' in gnss) result['gnss'] = gnss.result
	else {
		'warning' in gnss ? onWarning?.(gnss.warning) : onError?.(gnss.error)
	}

	const roam = getRoam({
		connectivityMonitoring,
		device,
	})
	if ('result' in roam) result['roam'] = roam.result
	else {
		'warning' in roam ? onWarning?.(roam.warning) : onError?.(roam.error)
	}

	const cfg = getCfg(config)
	if ('result' in cfg) result['cfg'] = cfg.result
	else {
		'warning' in cfg ? onWarning?.(cfg.warning) : onError?.(cfg.error)
	}

	return result
}
