# ADR 004: Instance selected when LwM2M object is multiple instance

When a LwM2M object is array type by definition its means that it could has
multiple instances. The default instance to be picked in order to build the
result is the first of the array.

For example for the next Temperature object

```TypeScript

const example = {
    [Temperature_3303_urn]: [
				{
					'5601': 27.18,
					'5602': 27.71,
					'5700': 27.18,
					'5701': 'Cel',
					'5518': 1675874731,
				},
				{
					'5601': 0,
					'5602': 0,
					'5700': 0,
					'5701': '',
					'5518': 0,
				},
				{
					'5601': 0,
					'5602': 0,
					'5700': 0,
					'5701': '',
					'5518': 0,
				},
			],
}
```

The value to be picked is

```JSON
{
    "5601": 27.18,
    "5602": 27.71,
    "5700": 27.18,
    "5701": "Cel",
    "5518": 1675874731,
}
```

More details in
"[select first instance when LwM2M object is an array](../src/converter.spec.ts)"
test.
