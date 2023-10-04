import {
	GNSS,
	type GNSSData,
} from '@nordicsemiconductor/asset-tracker-cloud-docs/protocol'
import { validateAgainstSchema } from './validateAgainstSchema.js'
import { Location_6_urn, type Location_6 } from '../schemas/index.js'
import { UndefinedLwM2MObjectWarning } from './UndefinedLwM2MObjectWarning.js'
import type { ConversionResult } from 'src/converter.js'

/**
 * Takes object id 6 (location) from 'LwM2M Asset Tracker v2' and convert into 'GNSS' object from 'nRF Asset Tracker Reported'.
 * @see {@link ../../docs/gnss.md}
 *
 * 'hdg' key from 'GNSS' object defined by 'nRF Asset Tracker Reported' is not provided by 'LwM2M Asset Tracker v2'.
 * @see {@link ../../adr/004-nrf-asset-tracker-reported-values-not-provided.md}
 */
export const getGnss = (location?: Location_6): ConversionResult<GNSSData> => {
	if (location === undefined)
		return {
			error: new UndefinedLwM2MObjectWarning({
				nRFAssetTrackerReportedId: 'gnss',
				LwM2MObjectUrn: Location_6_urn,
			}),
		}

	const { [0]: lat, [2]: alt, [6]: spd, [1]: lng, [3]: acc } = location

	return validateAgainstSchema(
		{
			v: {
				lng,
				lat,
				acc,
				alt,
				spd,
			},
			ts: location['5'] * 1000,
		},
		GNSS,
	)
}
