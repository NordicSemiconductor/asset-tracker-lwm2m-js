# GNSS

[`GNSS` definition in nRF Asset Tracker cloud protocol](https://github.com/NordicSemiconductor/asset-tracker-cloud-docs/blob/v31.0.0/docs/cloud-protocol/Reported.ts#L134)

## LwM2M data mapping

| Field | LwM2M                                                                              |
| ----- | ---------------------------------------------------------------------------------- |
| `lng` | `/6/0/1`                                                                           |
| `lat` | `/6/0/0`                                                                           |
| `acc` | `/6/0/3`                                                                           |
| `alt` | `/6/0/2`                                                                           |
| `spd` | `/6/0/6`                                                                           |
| `hdg` | [value not provided](../adr/004-nrf-asset-tracker-reported-values-not-provided.md) |
| `ts`  | `/6/0/5`                                                                           |
