import {
	ConnectivityMonitoring_4_urn,
	Device_3_urn,
	Humidity_3304_urn,
	Location_6_urn,
	parseURN,
	Pressure_3323_urn,
	Temperature_3303_urn,
} from '@nordicsemiconductor/lwm2m-types'

import { describe } from 'node:test'
import assert from 'node:assert'

/**
 * Idea: I want to link the ADR 008 with a test, because otherwise that could be lose when the context change
 *
 * @see https://github.com/MLopezJ/asset-tracker-lwm2m-js/blob/saga/adr/008-default-lwm2m-version.md
 */
void describe('defaultLwM2MVersions()', () => {
	const LwM2MAssetTrackerV2 = [
		Device_3_urn,
		ConnectivityMonitoring_4_urn,
		Location_6_urn,
		Temperature_3303_urn,
		Humidity_3304_urn,
		Pressure_3323_urn,
	]

	LwM2MAssetTrackerV2.forEach((object) => {
		const temp = parseURN(object)

		switch (temp.ObjectID) {
			case '3':
				assert.equal(temp.ObjectVersion, '1.2')
				assert.equal(temp.LWM2MVersion, '1.1')
				break
			case '4':
				assert.equal(temp.ObjectVersion, '1.3')
				assert.equal(temp.LWM2MVersion, '1.1')
				break
			case '6':
				assert.equal(temp.ObjectVersion, '1.0')
				assert.equal(temp.LWM2MVersion, '1.0')
				break
			default:
				// 3303, 3304, 3323
				assert.equal(temp.ObjectVersion, '1.1')
				assert.equal(temp.LWM2MVersion, '1.0')
				break
		}
	})
})
