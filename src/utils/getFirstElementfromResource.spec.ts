import assert from 'node:assert'
import { describe, it } from 'node:test'
import { getFirstElementfromResource } from './getFirstElementfromResource.js'

void describe('getFirstElementfromResource', () => {
	;[
		[[1, 2, 3], 1],
		[['a', 'b', 'c'], 'a'],
		[[], undefined],
	].forEach(([list, expected]) => {
		void it(`should pick ${expected} from ${list}`, () => {
			const result = getFirstElementfromResource(list as unknown[])
			assert.equal(expected, result)
			assert.equal(typeof expected, typeof result)
		})
	})
})
