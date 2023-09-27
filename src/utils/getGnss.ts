import {
	GNSS,
	type GNSSData,
} from '@nordicsemiconductor/asset-tracker-cloud-docs/protocol'
import { Location_6_urn, type Location_6 } from '../schemas/index.js'
import { TypeError, UndefinedLwM2MObjectWarning } from '../converter.js'
import { validateAgainstSchema } from './validateAgainstSchema.js'

/**
 * Takes object id 6 (location) from 'LwM2M Asset Tracker v2' and convert into 'gnss' object from 'nRF Asset Tracker Reported'
 *
 * @see https://github.com/MLopezJ/asset-tracker-cloud-coiote-azure-converter-js/blob/saga/documents/gnss.md
 */
export const getGnss = (
	location?: Location_6,
):
	| { result: GNSSData }
	| { error: TypeError }
	| { warning: UndefinedLwM2MObjectWarning } => {
	if (location === undefined)
		return {
			warning: new UndefinedLwM2MObjectWarning({
				nRFAssetTrackerReportedId: 'gnss',
				LwM2MObjectUrn: Location_6_urn,
			}),
		}

	const { 0: lat, 2: alt, 6: spd, 1: lng, 3: acc, 5: time } = location

	/**
	 * hdg from GNSS object is not provided.
	 *
	 * @see https://github.com/MLopezJ/asset-tracker-lwm2m-js/blob/saga/adr/009-nrf-asset-tracker-values-not-provided.md
	 */
	const object = {
		v: {
			lng,
			lat,
			acc,
			alt,
			spd,
		},
		ts: time * 1000,
	}

	return validateAgainstSchema(object, GNSS)
}
