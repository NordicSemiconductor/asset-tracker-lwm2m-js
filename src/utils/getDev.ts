import {
	Device,
	type DeviceData,
} from '@nordicsemiconductor/asset-tracker-cloud-docs/protocol'
import { Device_3_urn, type Device_3 } from '@nordicsemiconductor/lwm2m-types'
import { TypeError, UndefinedLwM2MObjectWarning } from '../converter.js'
import { validateAgainstSchema } from './validateAgainstSchema.js'

/**
 * Takes object id 3 (device) from 'LwM2M Asset Tracker v2' and convert into 'dev' object from 'nRF Asset Tracker Reported'
 *
 * @see https://github.com/MLopezJ/asset-tracker-cloud-coiote-azure-converter-js/blob/saga/documents/device.md
 */
export const getDev = (
	device?: Device_3,
):
	| { error: TypeError }
	| { result: DeviceData }
	| { warning: UndefinedLwM2MObjectWarning } => {
	if (device === undefined)
		return {
			warning: new UndefinedLwM2MObjectWarning({
				nRFAssetTrackerReportedId: 'dev',
				LwM2MObjectUrn: Device_3_urn,
			}),
		}

	const { 0: brdV, 2: imei, 3: modV, 13: maybeTime } = device
	const time = maybeTime !== undefined ? maybeTime * 1000 : undefined

	/**
	 * iccid from Dev object is not provided.
	 *
	 * @see https://github.com/MLopezJ/asset-tracker-lwm2m-js/blob/saga/adr/009-nrf-asset-tracker-values-not-provided.md
	 */
	const object = {
		v: {
			imei,
			modV,
			brdV,
		},
		ts: time,
	}

	return validateAgainstSchema(object, Device)
}
