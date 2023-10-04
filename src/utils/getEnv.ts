import {
	Environment,
	type EnvironmentData,
} from '@nordicsemiconductor/asset-tracker-cloud-docs/protocol'
import {
	Humidity_3304_urn,
	Pressure_3323_urn,
	Temperature_3303_urn,
	type Humidity_3304,
	type Pressure_3323,
	type Temperature_3303,
} from '../schemas/index.js'
import { validateAgainstSchema } from './validateAgainstSchema.js'
import type { ValidationError } from './ValidationError.js'
import { UndefinedLwM2MObjectWarning } from './UndefinedLwM2MObjectWarning.js'

/**
 * Defines the result type of 'getEnv' method, which will be one of the following options:
 * - result: contains the validated env object.
 * - error: contains an object indicating the object has not the expected format.
 * - error: contains an object indicating that the LwM2M object for env is undefined.
 */
type GetEnvResult =
	| { result: EnvironmentData }
	| { error: ValidationError | UndefinedLwM2MObjectWarning }

/**
 * Takes objects id 3303 (temperature), 3304 (humidity) and 3323 (pressure) from
 * 'LwM2M Asset Tracker v2' and convert into 'env' object from 'nRF Asset Tracker Reported'
 *
 * @see{@link ../../docs/environment.md}
 */
export const getEnv = ({
	temperature,
	humidity,
	pressure,
}: {
	temperature: Temperature_3303 | undefined
	humidity: Humidity_3304 | undefined
	pressure: Pressure_3323 | undefined
}): GetEnvResult => {
	if (temperature === undefined)
		return {
			error: new UndefinedLwM2MObjectWarning({
				nRFAssetTrackerReportedId: 'env',
				LwM2MObjectUrn: Temperature_3303_urn,
			}),
		}

	if (humidity === undefined)
		return {
			error: new UndefinedLwM2MObjectWarning({
				nRFAssetTrackerReportedId: 'env',
				LwM2MObjectUrn: Humidity_3304_urn,
			}),
		}

	if (pressure === undefined)
		return {
			error: new UndefinedLwM2MObjectWarning({
				nRFAssetTrackerReportedId: 'env',
				LwM2MObjectUrn: Pressure_3323_urn,
			}),
		}

	/**
	 * First instance selected when object is multiple instance
	 */
	const defaultInstance = 0

	const temp = temperature?.[defaultInstance]?.['5700']
	const hum = humidity?.[defaultInstance]?.['5700']
	const atmp = pressure?.[defaultInstance]?.['5700']
	const time = getTime({ temperature, humidity, pressure })
	const object = createEnv({ temp, hum, atmp, time })

	return validateAgainstSchema(object, Environment)
}

/**
 * The resource selected to report the timestamp value is 5518.
 * Value is in seconds and it is multiplied to transform to milliseconds.
 */
const getTime = ({
	temperature,
	humidity,
	pressure,
}: {
	temperature: Temperature_3303
	humidity: Humidity_3304
	pressure: Pressure_3323
}): number | undefined => {
	let time =
		temperature?.[0]?.['5518'] ??
		humidity?.[0]?.['5518'] ??
		pressure?.[0]?.['5518']

	if (time !== undefined) time = time * 1000

	return time
}

/**
 * Creates 'Env' object defined by 'nRF Asset Tracker Reported'.
 * @see {@link ../../docs/environment.md}
 */
const createEnv = ({
	temp,
	hum,
	atmp,
	time,
}: {
	temp: number | undefined
	hum: number | undefined
	atmp: number | undefined
	time: number | undefined
}) => ({
	v: {
		temp,
		hum,
		atmp,
	},
	ts: time,
})
