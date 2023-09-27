import { parseURN } from '@nordicsemiconductor/lwm2m-types'
import type {
	LwM2MAssetTrackerV2,
	nRFAssetTrackerReportedType,
} from 'src/converter.js'

/**
 * Warning handler type
 * @see https://github.com/MLopezJ/asset-tracker-lwm2m-js/blob/saga/adr/007-warning-and-error-handling.md
 */
export class UndefinedLwM2MObjectWarning extends Error {
	undefinedLwM2MObject: {
		ObjectID: string
		ObjectVersion: string
		LWM2MVersion: string
	}

	constructor({
		nRFAssetTrackerReportedId,
		LwM2MObjectUrn,
	}: {
		nRFAssetTrackerReportedId: keyof nRFAssetTrackerReportedType
		LwM2MObjectUrn: keyof LwM2MAssetTrackerV2
	}) {
		const LwM2MObjectInfo = parseURN(LwM2MObjectUrn)
		super(
			`'${nRFAssetTrackerReportedId}' object can not be created because LwM2M object id '${LwM2MObjectInfo.ObjectID}' is undefined`,
		)
		this.undefinedLwM2MObject = LwM2MObjectInfo
	}
}
