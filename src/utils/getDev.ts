import {
	Device,
	type DeviceData,
	validateWithType,
} from '@nordicsemiconductor/asset-tracker-cloud-docs/protocol'
import { type Device_3 } from '@nordicsemiconductor/lwm2m-types'
import { TypeError, Warning } from '../converter.js'

/**
 * Takes object id 3 (device) from 'LwM2M Asset Tracker v2' and convert into 'dev' object from 'nRF Asset Tracker Reported'
 *
 * @see https://github.com/MLopezJ/asset-tracker-cloud-coiote-azure-converter-js/blob/saga/documents/device.md
 */
export const getDev = (
	device?: Device_3,
): { error: Error } | { result: DeviceData } | { warning: Warning } => {
	if (device === undefined)
		return {
			warning: new Warning({
				name: 'warning',
				message: 'Dev object can not be created',
				description: 'Device (3) object is undefined',
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

	const maybeValidDeviceData = validateWithType(Device)(object)
	if ('errors' in maybeValidDeviceData) {
		return {
			error: new TypeError({
				name: 'type error',
				message: 'error validating type',
				description: maybeValidDeviceData.errors,
			}),
		}
	}

	return { result: maybeValidDeviceData }
}
