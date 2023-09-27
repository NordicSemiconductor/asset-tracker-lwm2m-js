import {
	Device,
	type DeviceData,
} from '@nordicsemiconductor/asset-tracker-cloud-docs/protocol'
import { Device_3_urn, type Device_3 } from '@nordicsemiconductor/lwm2m-types'
import { validateAgainstSchema } from './validateAgainstSchema.js'
import { getTime } from './getBat.js'
import { UndefinedLwM2MObjectWarning } from './UndefinedLwM2MObjectWarning.js'
import type { ValidationError } from './ValidationError.js'

/**
 * Defines the result type of 'getDev' method, which will be one of the following options:
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
 * @see {@link ../../documents/device.md}
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
	const object = createDevObject({ brdV, imei, modV, time })

	return validateAgainstSchema(object, Device)
}

/**
 * Creates 'dev' object defined by 'nRF Asset Tracker Reported'.
 * @see {@link ../../documents/device.md}
 *
 * 'iccid' key from the 'dev' object defined by 'nRF Asset Tracker Reported' is not provided.
 * @see {@link ../../adr/009-nrf-asset-tracker-values-not-provided.md}
 */
const createDevObject = ({
	imei,
	modV,
	brdV,
	time,
}: {
	imei: string | undefined
	modV: string | undefined
	brdV: string | undefined
	time: number | undefined
}) => ({
	v: {
		imei,
		modV,
		brdV,
	},
	ts: time,
})
