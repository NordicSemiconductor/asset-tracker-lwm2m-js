import { parseURN } from '@nordicsemiconductor/lwm2m-types'
import type {
	LwM2MAssetTrackerV2,
	nRFAssetTrackerReportedType,
} from 'src/converter.js'

/**
 * Warning callback type
 */
export class UndefinedLwM2MObjectWarning extends Error {
	undefinedLwM2MObject: {
		ObjectID: string
		ObjectVersion: string
		LWM2MVersion: string
	}

	notCreatednRFAssetTrackerReportedObject: string

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
		this.notCreatednRFAssetTrackerReportedObject = nRFAssetTrackerReportedId
	}
}
