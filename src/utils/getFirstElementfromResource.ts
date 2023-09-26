/**
 * First element from resource is the default option to be selected
 * @see https://github.com/MLopezJ/asset-tracker-lwm2m-js/blob/saga/adr/005-element-selected-when-multiple-resource.md
 */
export const getFirstElementfromResource = <T>(list: T[]): T | undefined =>
	list !== undefined ? list[0] : undefined
