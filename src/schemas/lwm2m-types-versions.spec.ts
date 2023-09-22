import {
	ConnectivityMonitoring_4_urn,
	Device_3_urn,
	Humidity_3304_urn,
	Location_6_urn,
	Pressure_3323_urn,
	Temperature_3303_urn,
} from './index.js'

import { describe, test } from 'node:test'
import assert from 'node:assert'
import { parseURN } from '@nordicsemiconductor/lwm2m-types'

/**
 * @see {@link ../../documents/data-transition.md}
 */
void describe('ensure that objects referenced from @nordicsemiconductor/lwm2m-types have the correct LwM2M and object versions', () => {
	;[
		[3, Device_3_urn, '1.2', '1.1'],
		[4, ConnectivityMonitoring_4_urn, '1.3', '1.1'],
		[6, Location_6_urn, '1.0', '1.0'],
		[3303, Temperature_3303_urn, '1.1', '1.0'],
		[3304, Humidity_3304_urn, '1.1', '1.0'],
		[3323, Pressure_3323_urn, '1.1', '1.0'],
	].forEach(
		([objectVersion, urn, expectedObjectVersion, expectedLwM2MVersion]) => {
			void test(`that Object ${objectVersion} has ObjectVersion ${expectedObjectVersion} and LwM2M version ${expectedLwM2MVersion}`, () => {
				const { ObjectVersion, LWM2MVersion } = parseURN(urn as string)
				assert.equal(ObjectVersion, expectedObjectVersion)
				assert.equal(LWM2MVersion, expectedLwM2MVersion)
			})
		},
	)
})
