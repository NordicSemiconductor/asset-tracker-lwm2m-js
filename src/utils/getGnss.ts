import {
	GNSS,
	type GNSSData,
} from '@nordicsemiconductor/asset-tracker-cloud-docs/protocol'
import { validateAgainstSchema } from './validateAgainstSchema.js'
import { Location_6_urn, type Location_6 } from '../schemas/index.js'
import { ValidationError, UndefinedLwM2MObjectWarning } from '../converter.js'

/**
 * It defines the following objects
 * - result: contains the validated gnss object.
 * - error: contains an object indicating the object has not the expected format.
 * - warning: contains an object indicating that the LwM2M object for gnss is undefined.
 */
type GetGnssResult =
	| { result: GNSSData }
	| { error: ValidationError }
	| { warning: UndefinedLwM2MObjectWarning }

/**
 * Takes object id 6 (location) from 'LwM2M Asset Tracker v2' and convert into 'GNSS' object from 'nRF Asset Tracker Reported'.
 * @see https://github.com/MLopezJ/asset-tracker-cloud-coiote-azure-converter-js/blob/saga/documents/gnss.md
 */
export const getGnss = (location?: Location_6): GetGnssResult => {
	if (location === undefined)
		return {
			warning: new UndefinedLwM2MObjectWarning({
				nRFAssetTrackerReportedId: 'gnss',
				LwM2MObjectUrn: Location_6_urn,
			}),
		}

	const { [0]: lat, [2]: alt, [6]: spd, [1]: lng, [3]: acc } = location
	const time = getTime(location)
	const object = createGnssObject({ lat, lng, acc, alt, spd, time })

	return validateAgainstSchema(object, GNSS)
}

/**
 * Resource selected to reporte timestamp value is 5.
 * Value is in seconds and it is multiplied to transform to milliseconds.
 */
const getTime = (location: Location_6): number => location['5'] * 1000

/**
 * Creates GNSS object defined by 'nRF Asset Tracker Reported'.
 * @see {@link documents/gnss.md}
 *
 * 'hdg' key from 'GNSS' object defined by 'nRF Asset Tracker Reported' is not provided.
 * @see https://github.com/MLopezJ/asset-tracker-lwm2m-js/blob/saga/adr/009-nrf-asset-tracker-values-not-provided.md
 */
const createGnssObject = ({
	lat,
	lng,
	acc,
	alt,
	spd,
	time,
}: {
	lat: number
	lng: number
	acc: number | undefined
	alt: number | undefined
	spd: number | undefined
	time: number
}) => {
	return {
		v: {
			lng,
			lat,
			acc,
			alt,
			spd,
		},
		ts: time,
	}
}
