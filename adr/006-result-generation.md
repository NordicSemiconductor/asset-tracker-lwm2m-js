# ADR 006: Result generation

One characteristic of this conversion process is that both input
(`LwM2M Asset Tracker v2`) and output (`nRF Asset Tracker Reported`) structure
type has all its objects as optional values.

Input:

```
{
	[Device_3_urn]?: Device_3
	[ConnectivityMonitoring_4_urn]?: ConnectivityMonitoring_4
	[Location_6_urn]?: Location_6
	[Temperature_3303_urn]?: Temperature_3303
	[Humidity_3304_urn]?: Humidity_3304
	[Pressure_3323_urn]?: Pressure_3323
	[Config_50009_urn]?: Config_50009
}

```

Output:

```
{
	cfg: Type.Optional(Config),
	dev: Type.Optional(Device),
	roam: Type.Optional(RoamingInfo),
	bat: Type.Optional(Battery),
	env: Type.Optional(Environment),
	gnss: Type.Optional(GNSS),
}

```

Is important to notice that the consequence of one object not being present in
the input is that the object/s of the output which are dependent of it to be
generated will not be returned in the output.

For example, the LwM2M object 6 - Location is used to create the GNSS object in
the output. If object 6 is missing, the GNSS object will not be part of the
output.

See [data transition](documents/data-transition.md) for check the dependencies
between LwM2M objects and nRF Asset Tracker objects.

See
[test - "should create output even when some expected objects in the input are missing"](../src/converter.spec.ts)
for more examples.
