# ADR 005: Element selected when LwM2M resource is multiple instance

When a LwM2M resource is array type by definition its means that it could has
multiple values. The default value to be picked in order to build the result is
the first of the array.

For example for the resource id 7 of the next Device object

```TypeScript
const example = {
			[Device_3_urn]: {
				'0': 'Nordic Semiconductor ASA',
				'1': 'Thingy:91',
				'2': '351358815340515',
				'3': '22.8.1+0',
				'7': [2754, 0, 1, 2, 3, 4, 5, 6, 7],
				'13': 1675874731,
				'16': 'UQ',
				'19': '3.2.1',
			},
		}
```

The element to be picked is

```JSON

{
    "7": [2754],
}
```

More details in
"[select first element when LwM2M resource is an array](../src/converter.spec.ts)"
test.
