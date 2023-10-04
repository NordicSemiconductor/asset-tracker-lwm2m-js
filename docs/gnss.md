# GNSS

## Link: [here](https://github.com/NordicSemiconductor/asset-tracker-cloud-docs/blob/saga/docs/cloud-protocol/Reported.ts)

## Data

| Field | LwM2M                                                                              |
| ----- | ---------------------------------------------------------------------------------- |
| lng   | /6/0/1                                                                             |
| lat   | /6/0/0                                                                             |
| acc   | /6/0/3                                                                             |
| alt   | /6/0/2                                                                             |
| spd   | /6/0/6                                                                             |
| hdg   | [value not provided](../adr/004-nrf-asset-tracker-reported-values-not-provided.md) |
| ts    | /6/0/5                                                                             |

## Details

| Field | Description                                              | Type    | Minimum       | Maximum | Required |
| ----- | -------------------------------------------------------- | ------- | ------------- | ------- | -------- |
| lng   | Longitude                                                | number  | -180          | 180     | Yes      |
| lat   | Latitude                                                 | number  | -90           | 90      | Yes      |
| acc   | Accuracy (2D 1-sigma) in meters                          | number  | 0             |         | No       |
| alt   | Altitude above WGS-84 ellipsoid in meters                | number  |               |         | Yes      |
| spd   | Horizontal speed in meters                               | number  | 0             |         | Yes      |
| hdg   | Heading of movement in degrees                           | number  | 0             | 360     | No       |
| ts    | Timestamp as Unix epoch with millisecond precision (UTC) | integer | 1234567890123 |         | Yes      |
