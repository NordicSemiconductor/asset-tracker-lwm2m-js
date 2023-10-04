import {
	Device,
	type DeviceData,
} from '@nordicsemiconductor/asset-tracker-cloud-docs/protocol'
import { Device_3_urn, type Device_3 } from '@nordicsemiconductor/lwm2m-types'
import { validateAgainstSchema } from './validateAgainstSchema.js'
import { getTimeInMS } from './getBat.js'
import { UndefinedLwM2MObjectWarning } from './UndefinedLwM2MObjectWarning.js'
import type { ConversionResult } from 'src/converter.js'

/**
 * Takes object id 3 (device) from 'LwM2M Asset Tracker v2' and convert into 'dev' object from 'nRF Asset Tracker Reported'
 * @see {@link ../../docs/device.md}
 *
 * 'iccid' key from the 'dev' object defined by 'nRF Asset Tracker Reported' is not provided by 'LwM2M Asset Tracker v2'.
 * @see {@link ../../adr/004-nrf-asset-tracker-reported-values-not-provided.md}
 */
export const getDev = (device?: Device_3): ConversionResult<DeviceData> => {
	if (device === undefined)
		return {
			error: new UndefinedLwM2MObjectWarning({
				nRFAssetTrackerReportedId: 'dev',
				LwM2MObjectUrn: Device_3_urn,
			}),
		}

	const { 0: brdV, 2: imei, 3: modV } = device

	return validateAgainstSchema(
		{
			v: {
				imei,
				modV,
				brdV,
			},
			ts: getTimeInMS(device),
		},
		Device,
	)
}
