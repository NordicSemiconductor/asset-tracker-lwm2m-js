import { type Config_50009, Config_50009_urn } from '../schemas/Config_50009.js'
import {
	Config,
	type ConfigData,
} from '@nordicsemiconductor/asset-tracker-cloud-docs/protocol'
import { validateAgainstSchema } from './validateAgainstSchema.js'
import { ValidationError, UndefinedLwM2MObjectWarning } from '../converter.js'

/**
 * Defines the result type of 'getCfg' method, which will be one of the following options:
 * - result: contains the validated cfg object.
 * - error: contains an object indicating the object has not the expected format.
 * - warning: contains an object indicating that the LwM2M object for cfg is undefined.
 */
type GetCfgResult =
	| { result: ConfigData }
	| { error: ValidationError }
	| { warning: UndefinedLwM2MObjectWarning }

/**
 * Takes object id 50009 (config) from 'LwM2M Asset Tracker v2' and convert into 'cfg' object from 'nRF Asset Tracker Reported'
 * @see https://github.com/MLopezJ/asset-tracker-cloud-coiote-azure-converter-js/blob/saga/documents/config.md
 */
export const getCfg = (config?: Config_50009): GetCfgResult => {
	if (config === undefined)
		return {
			warning: new UndefinedLwM2MObjectWarning({
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
