# Roaming

[`RoamingInfo` definition in nRF Asset Tracker cloud protocol](https://github.com/NordicSemiconductor/asset-tracker-cloud-docs/blob/v31.0.0/docs/cloud-protocol/Reported.ts#L44)

## LwM2M data mapping

| Field    | LwM2M                                                                              |
| -------- | ---------------------------------------------------------------------------------- |
| `band`   | [value not provided](../adr/004-nrf-asset-tracker-reported-values-not-provided.md) |
| `nw`     | `/4/0/0`                                                                           |
| `rsrp`   | `/4/0/2`                                                                           |
| `area`   | `/4/0/12`                                                                          |
| `mccmnc` | `/4/0/10` & `/4/0/9`                                                               |
| `cell`   | `/4/0/8`                                                                           |
| `ip`     | `/4/0/4`                                                                           |
| `eest`   | [value not provided](../adr/004-nrf-asset-tracker-reported-values-not-provided.md) |
| `ts`     | [`/3/0/13`](../adr/005-roam-timestamp-not-supported-by-lwm2m.md)                   |
