import {
	RoamingInfo,
	type RoamingInfoData,
} from '@nordicsemiconductor/asset-tracker-cloud-docs/protocol'
import { getTime } from './getBat.js'
import { validateAgainstSchema } from './validateAgainstSchema.js'
import {
	Device_3_urn,
	ConnectivityMonitoring_4_urn,
	type Device_3,
	type ConnectivityMonitoring_4,
} from 'src/schemas/index.js'
import { UndefinedLwM2MObjectWarning } from './UndefinedLwM2MObjectWarning.js'
import type { ValidationError } from './ValidationError.js'

/**
 * Defines the result type of 'getRoam' method, which will be one of the following options
 * - result: contains the validated roam object.
 * - error: contains an object indicating the object has not the expected format.
 * - warning: contains an object indicating that the LwM2M object for roam is undefined.
 */
type GetRoamResult =
	| { result: RoamingInfoData }
	| { error: ValidationError }
	| { warning: UndefinedLwM2MObjectWarning }

/**
 * Takes objects id 4 (connectivity monitoring) and 3 (device) from 'LwM2M Asset Tracker v2'
 * and convert into 'roam' object from 'nRF Asset Tracker Reported'
 * @see {@link ../../documents/roam.md}
 *
 * Connectivity Monitoring (4) object does not support timestamp, for that reason timestamp value is taken from
 * Device (3) object.
 * @see {@link ../../adr/005-roam-timestamp-not-supported-by-lwm2m.md}
 */
export const getRoam = ({
	connectivityMonitoring,
	device,
}: {
	connectivityMonitoring: ConnectivityMonitoring_4 | undefined
	device: Device_3 | undefined
}): GetRoamResult => {
	if (connectivityMonitoring === undefined)
		return {
			warning: new UndefinedLwM2MObjectWarning({
				nRFAssetTrackerReportedId: 'roam',
				LwM2MObjectUrn: ConnectivityMonitoring_4_urn,
			}),
		}

	if (device === undefined)
		return {
			warning: new UndefinedLwM2MObjectWarning({
				nRFAssetTrackerReportedId: 'roam',
				LwM2MObjectUrn: Device_3_urn,
			}),
		}

	const {
		0: maybeNw,
		2: rsrp,
		4: ipArray,
		8: cell,
		9: smnc,
		10: smcc,
		12: area,
	} = connectivityMonitoring

	/**
	 * First element selected when resource is multiple instance
	 */
	const defaultResource = 0

	const nw = String(maybeNw)
	const mccmnc = Number(`${smcc}${smnc}`)
	const ip = ipArray !== undefined ? ipArray[defaultResource] : undefined
	const time = getTime(device)
	const object = createRoamObject({ nw, rsrp, area, mccmnc, cell, ip, time })

	return validateAgainstSchema(object, RoamingInfo)
}

/**
 * Creates 'roam' object defined by 'nRF Asset Tracker Reported'.
 * @see {@link ../../documents/roam.md}
 *
 * 'band' and 'eest' key from the 'roam' object defined by 'nRF Asset Tracker Reported' are not provided by 'LwM2M Asset Tracker v2'.
 * @see {@link ../../adr/004-nrf-asset-tracker-reported-values-not-provided.md}
 */
const createRoamObject = ({
	nw,
	rsrp,
	area,
	mccmnc,
	cell,
	ip,
	time,
}: {
	nw: string
	rsrp: number
	area: number | undefined
	mccmnc: number
	cell: number | undefined
	ip: string | undefined
	time: number | undefined
}) => ({
	v: {
		nw,
		rsrp,
		area,
		mccmnc,
		cell,
		ip,
	},
	ts: time,
})
