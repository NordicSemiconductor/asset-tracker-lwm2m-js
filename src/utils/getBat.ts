import {
	Battery,
	type BatteryData,
} from '@nordicsemiconductor/asset-tracker-cloud-docs/protocol'
import { Device_3_urn, type Device_3 } from '../schemas/index.js'
import { validateAgainstSchema } from './validateAgainstSchema.js'
import { UndefinedLwM2MObjectWarning } from './UndefinedLwM2MObjectWarning.js'
import type { ConversionResult } from '../converter.js'

/**
 * Takes object id 3 (device) from 'LwM2M Asset Tracker v2' and convert into 'bat' object from 'nRF Asset Tracker Reported'
 * @see {@link ../../docs/battery.md}
 */
export const getBat = (device?: Device_3): ConversionResult<BatteryData> => {
	if (device === undefined)
		return {
			error: new UndefinedLwM2MObjectWarning({
				nRFAssetTrackerReportedId: 'bat',
				LwM2MObjectUrn: Device_3_urn,
			}),
		}

	/**
	 * First element selected when resource is multiple instance
	 */
	const defaultResource = 0
	const object = {
		v: device['7']?.[defaultResource],
		ts: getTimeInMS(device),
	}

	return validateAgainstSchema(object, Battery)
}

/**
 * The resource selected to report the timestamp value is 13.
 * Value is in seconds and it is multiplied to transform to milliseconds.
 * @see {@link ../../docs/battery.md}
 */
export const getTimeInMS = (device: Device_3): number | undefined =>
	device['13'] !== undefined ? device['13'] * 1000 : undefined
