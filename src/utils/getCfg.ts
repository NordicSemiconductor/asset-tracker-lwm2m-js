import type { Config_50009 } from '../schemas/Config_50009.js'
import {
	Config,
	type ConfigData,
	validateWithType,
} from '@nordicsemiconductor/asset-tracker-cloud-docs/protocol'
import { TypeError, Warning } from '../converter.js'

/**
 * Check required values and build config object, expected by nRF Asset Tracker
 *
 * @see https://github.com/MLopezJ/asset-tracker-cloud-coiote-azure-converter-js/blob/saga/documents/config.md
 * @see {@link ../../documents/config.md}
 * // TODO: Take a decision here
 */
export const getCfg = (
	config?: Config_50009,
): { result: ConfigData } | { error: Error } | { warning: Warning } => {
	if (config === undefined)
		return {
			warning: new Warning({
				name: 'warning',
				message: 'Cfg object can not be created',
				description: 'Config (50009) object is undefined',
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

	const maybeValidCfg = validateWithType(Config)(cfg)

	if ('errors' in maybeValidCfg) {
		return {
			error: new TypeError({
				name: 'type error',
				message: 'error validating type',
				description: maybeValidCfg.errors,
			}),
		}
	}

	return { result: maybeValidCfg }
}
