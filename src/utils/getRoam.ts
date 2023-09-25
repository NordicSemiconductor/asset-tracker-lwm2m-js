import {
	RoamingInfo,
	type RoamingInfoData,
} from '@nordicsemiconductor/asset-tracker-cloud-docs/protocol'
import { ValidationError, UndefinedLwM2MObjectWarning } from '../converter.js'
import { getTime } from './getBat.js'
import { validateAgainstSchema } from './validateAgainstSchema.js'
import { ConnectivityMonitoring_4_urn, type ConnectivityMonitoring_4, type Device_3, Device_3_urn } from 'src/schemas/index.js'


/**
 * Takes objects id 4 (connectivity monitoring) and 3 (device) from 'LwM2M Asset Tracker v2'
 * and convert into 'roam' object from 'nRF Asset Tracker Reported'
 *
 * @see https://github.com/MLopezJ/asset-tracker-cloud-coiote-azure-converter-js/blob/saga/documents/roam.md
 */
export const getRoam = ({
	connectivityMonitoring,
	device,
}: {
	connectivityMonitoring: ConnectivityMonitoring_4 | undefined
	device: Device_3 | undefined
}):
	| { result: RoamingInfoData }
	| { error: ValidationError }
	| { warning: UndefinedLwM2MObjectWarning } => {
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

	const nw = String(maybeNw)
	const mccmnc = Number(`${smcc}${smnc}`)
	/**
	 * First element of resource selected
	 *
	 * @see https://github.com/MLopezJ/asset-tracker-lwm2m-js/blob/saga/adr/005-element-selected-when-multiple-resource.md
	 */
	const ip = ipArray !== undefined ? ipArray[0] : undefined

	/**
	 * Connectivity Monitoring (4) object does not support timestamp
	 *
	 * @see https://github.com/MLopezJ/asset-tracker-lwm2m-js/blob/saga/adr/010-roam-timestamp-not-supported-by-lwm2m.md
	 */
	const time = getTime(device)

	/**
	 * band and eest from Dev object are not provided.
	 *
	 * @see https://github.com/MLopezJ/asset-tracker-lwm2m-js/blob/saga/adr/009-nrf-asset-tracker-values-not-provided.md
	 */
	const object = {
		v: {
			nw,
			rsrp,
			area,
			mccmnc,
			cell,
			ip,
		},
		ts: time,
	}

	return validateAgainstSchema(object, RoamingInfo)
}
