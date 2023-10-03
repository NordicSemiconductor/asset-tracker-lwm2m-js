/**
 * First element from resource is the default option to be selected
 */
export const getFirstElementfromResource = <T>(list: T[]): T | undefined =>
	list !== undefined ? list[0] : undefined
