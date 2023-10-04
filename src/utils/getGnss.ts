import {
	GNSS,
	type GNSSData,
} from '@nordicsemiconductor/asset-tracker-cloud-docs/protocol'
import { validateAgainstSchema } from './validateAgainstSchema.js'
import { Location_6_urn, type Location_6 } from '../schemas/index.js'
import type { ValidationError } from './ValidationError.js'
import { UndefinedLwM2MObjectWarning } from './UndefinedLwM2MObjectWarning.js'

/**
 * Defines the result type of 'getGnss' method, which will be one of the following options
 * - result: contains the validated gnss object.
 * - error: contains an object indicating the object has not the expected format.
 * - error: contains an object indicating that the LwM2M object for gnss is undefined.
 */
type GetGnssResult =
	| { result: GNSSData }
	| { error: ValidationError | UndefinedLwM2MObjectWarning }

/**
 * Takes object id 6 (location) from 'LwM2M Asset Tracker v2' and convert into 'GNSS' object from 'nRF Asset Tracker Reported'.
 * @see {@link ../../docs/gnss.md}
 */
export const getGnss = (location?: Location_6): GetGnssResult => {
	if (location === undefined)
		return {
			error: new UndefinedLwM2MObjectWarning({
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
 * The resource selected to report the timestamp value is 5.
 * Value is in seconds and it is multiplied to transform to milliseconds.
 * {@link ../../docs/gnss.md}
 */
const getTime = (location: Location_6): number => location['5'] * 1000

/**
 * Creates GNSS object defined by 'nRF Asset Tracker Reported'.
 * @see {@link ../../docs/gnss.md}
 *
 * 'hdg' key from 'GNSS' object defined by 'nRF Asset Tracker Reported' is not provided by 'LwM2M Asset Tracker v2'.
 * @see {@link ../../adr/004-nrf-asset-tracker-reported-values-not-provided.md}
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
}) => ({
	v: {
		lng,
		lat,
		acc,
		alt,
		spd,
	},
	ts: time,
})
