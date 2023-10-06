import { type Config_50009, Config_50009_urn } from '../schemas/Config_50009.js'
import {
	Config,
	type ConfigData,
} from '@nordicsemiconductor/asset-tracker-cloud-docs/protocol'
import { validateAgainstSchema } from './validateAgainstSchema.js'
import { UndefinedLwM2MObjectWarning } from './UndefinedLwM2MObjectWarning.js'
import type { ConversionResult } from 'src/converter.js'

/**
 * Takes object id 50009 (config) from 'LwM2M Asset Tracker v2' and convert into 'cfg' object from 'nRF Asset Tracker Reported'
 * @see {@link ../../docs/config.md}
 */
export const getCfg = (config?: Config_50009): ConversionResult<ConfigData> => {
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
		nod: getNod(config),
	}

	return validateAgainstSchema(cfg, Config)
}

/**
 * Nod is the list of modules which should be disabled when sampling data.
 *
 * Default value is an empty array.
 *
 * If resource 6 from Config_50009 is true, the list must have 'gnss' in it
 * If resource 7 from Config_50009 is true, the list must have 'ncell' in it
 */
const getNod = (config: Config_50009): string[] => {
	const nod = []

	if (config[6] === true) nod.push('gnss')

	if (config[7] === true) nod.push('ncell')

	return nod
}
