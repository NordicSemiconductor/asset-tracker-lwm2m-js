import {
	Device,
	type DeviceData,
} from '@nordicsemiconductor/asset-tracker-cloud-docs/protocol'
import { Device_3_urn, type Device_3 } from '@nordicsemiconductor/lwm2m-types'
import { validateAgainstSchema } from './validateAgainstSchema.js'
import { ValidationError, UndefinedLwM2MObjectWarning } from '../converter.js'
import { getTime } from './getBat.js'

/**
 * It defines the following objects
 * - result: contains the validated dev object.
 * - error: contains an object indicating the object has not the expected format.
 * - warning: contains an object indicating that the LwM2M object for dev is undefined.
 */
type GetDevResult =
	| { error: ValidationError }
	| { result: DeviceData }
	| { warning: UndefinedLwM2MObjectWarning }

/**
 * Takes object id 3 (device) from 'LwM2M Asset Tracker v2' and convert into 'dev' object from 'nRF Asset Tracker Reported'
 *
 * @see https://github.com/MLopezJ/asset-tracker-cloud-coiote-azure-converter-js/blob/saga/documents/device.md
 */
export const getDev = (device?: Device_3): GetDevResult => {
	if (device === undefined)
		return {
			warning: new UndefinedLwM2MObjectWarning({
				nRFAssetTrackerReportedId: 'dev',
				LwM2MObjectUrn: Device_3_urn,
			}),
		}

	const { 0: brdV, 2: imei, 3: modV } = device
	const time = getTime(device)

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
