import { type Config_50009, Config_50009_urn } from '../schemas/Config_50009.js'
import {
	Config,
	type ConfigData,
} from '@nordicsemiconductor/asset-tracker-cloud-docs/protocol'
import { validateAgainstSchema } from './validateAgainstSchema.js'
import { UndefinedLwM2MObjectWarning } from './UndefinedLwM2MObjectWarning.js'
import type { TransformationResult } from 'src/converter.js'

/**
 * Takes object id 50009 (config) from 'LwM2M Asset Tracker v2' and convert into 'cfg' object from 'nRF Asset Tracker Reported'
 * @see {@link ../../docs/config.md}
 */
export const getCfg = (
	config?: Config_50009,
): TransformationResult<ConfigData> => {
	if (config === undefined)
		return {
			error: new UndefinedLwM2MObjectWarning({
				nRFAssetTrackerReportedId: 'cfg',
				LwM2MObjectUrn: Config_50009_urn,
			}),
		}

	const {
		0: act,
		1: loct,
		2: actwt,
		3: mvres,
		4: mvt,
		5: accath,
		8: accith,
		9: accito,
	} = config

	const cfg = {
		loct,
		act,
		actwt,
		mvres,
		mvt,
		accath,
		accith,
		accito,
		nod: [],
	}

	return validateAgainstSchema(cfg, Config)
}
