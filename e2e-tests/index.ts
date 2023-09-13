import {
	ConnectivityMonitoring_4_urn,
	Device_3_urn,
	Location_6_urn,
	Temperature_3303_urn,
} from '@nordicsemiconductor/lwm2m-types'
import { assertThat, is, not, defined } from 'hamjest'
import { converter } from '../src/converter.js'
import { input } from './input.js'
const output = converter(input)

/**
 * Check if Device object is present in the input
 */
assertThat(input[Device_3_urn], is(defined()))

/**
 * Having known that the Device object is present in the input,
 * it is expected for objects
 *      bat
 *      dev
 * to be in the output
 */
assertThat(output['bat'], is(defined()))
assertThat(output['dev'], is(defined()))

/**
 * Check if Location object is present in the input
 */
assertThat(input[Location_6_urn], is(defined()))

/**
 * Having known that the Location object is present in the input,
 * it is expected for object
 *      gnss
 * to be in the output
 */
assertThat(output['gnss'], is(defined()))

/**
 * Temperature object was not in the input
 */
assertThat((input as never)[Temperature_3303_urn], is(not(defined())))

/**
 * Because it was not present in the input,
 * it is expected for object
 *      env
 * to not be in the output
 */
assertThat(output['env'], is(not(defined())))

/**
 * Values must be the same
 */
const ipInput = input[ConnectivityMonitoring_4_urn][4][0]
const ipOutput = output['roam']?.v.ip
assertThat(ipInput, is(ipOutput))
