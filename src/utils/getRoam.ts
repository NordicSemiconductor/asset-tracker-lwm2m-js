import {
	RoamingInfo,
	type RoamingInfoData,
} from '@nordicsemiconductor/asset-tracker-cloud-docs/protocol'
import { getTimeInMS } from './getBat.js'
import { validateAgainstSchema } from './validateAgainstSchema.js'
import {
	Device_3_urn,
	ConnectivityMonitoring_4_urn,
	type Device_3,
	type ConnectivityMonitoring_4,
} from '../schemas/index.js'
import { UndefinedLwM2MObjectWarning } from './UndefinedLwM2MObjectWarning.js'
import type { ConversionResult } from '../converter.js'

/**
 * Takes objects id 4 (connectivity monitoring) and 3 (device) from 'LwM2M Asset Tracker v2'
 * and convert into 'roam' object from 'nRF Asset Tracker Reported'
 * @see {@link ../../docs/roam.md}
 *
 * Connectivity Monitoring (4) object does not support timestamp, for that reason timestamp value is taken from
 * Device (3) object.
 * @see {@link ../../adr/005-roam-timestamp-not-supported-by-lwm2m.md}
 *
 * 'band' and 'eest' key from the 'roam' object defined by 'nRF Asset Tracker Reported' are not provided by 'LwM2M Asset Tracker v2'.
 * @see {@link ../../adr/004-nrf-asset-tracker-reported-values-not-provided.md}
 */
export const getRoam = ({
	connectivityMonitoring,
	device,
}: {
	connectivityMonitoring: ConnectivityMonitoring_4 | undefined
	device: Device_3 | undefined
}): ConversionResult<RoamingInfoData> => {
	if (connectivityMonitoring === undefined)
		return {
			error: new UndefinedLwM2MObjectWarning({
				nRFAssetTrackerReportedId: 'roam',
				LwM2MObjectUrn: ConnectivityMonitoring_4_urn,
			}),
		}

	if (device === undefined)
		return {
			error: new UndefinedLwM2MObjectWarning({
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

	return validateAgainstSchema(
		{
			v: {
				nw,
				rsrp,
				area,
				mccmnc,
				cell,
				ip,
			},
			ts: getTimeInMS(device),
		},
		RoamingInfo,
	)
}
