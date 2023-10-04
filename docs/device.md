# Device

[`DeviceValue` definition in nRF Asset Tracker cloud protocol](https://github.com/NordicSemiconductor/asset-tracker-cloud-docs/blob/v31.0.0/docs/cloud-protocol/Reported.ts#L6)

## LwM2M data mapping

| Field   | LwM2M                                                                              |
| ------- | ---------------------------------------------------------------------------------- |
| `imei`  | `/3/0/2``                                                                          |
| `iccid` | [value not provided](../adr/004-nrf-asset-tracker-reported-values-not-provided.md) |
| `modV`  | `/3/0/3``                                                                          |
| `brdV`  | `/3/0/0``                                                                          |
| `ts`    | `/3/0/13``                                                                         |
