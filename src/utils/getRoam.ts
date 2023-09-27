import {
	RoamingInfo,
	type RoamingInfoData,
} from '@nordicsemiconductor/asset-tracker-cloud-docs/protocol'
import {
	type Device_3,
	type ConnectivityMonitoring_4,
	ConnectivityMonitoring_4_urn,
} from '@nordicsemiconductor/lwm2m-types'
import { TypeError, UndefinedLwM2MObjectWarning } from '../converter.js'
import { validateAgainstSchema } from './validateAgainstSchema.js'

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
	| { error: TypeError }
	| { warning: UndefinedLwM2MObjectWarning } => {
	if (connectivityMonitoring === undefined)
		return {
			warning: new UndefinedLwM2MObjectWarning({
				nRFAssetTrackerReportedId: 'roam',
				LwM2MObjectUrn: ConnectivityMonitoring_4_urn,
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
	const time = device?.['13'] !== undefined ? device['13'] * 1000 : undefined

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
