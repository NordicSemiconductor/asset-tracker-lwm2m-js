# Battery

## Link: [here](https://github.com/NordicSemiconductor/asset-tracker-cloud-docs/blob/saga/docs/cloud-protocol/Reported.ts)

## Data

| Field | LwM2M   |
| ----- | ------- |
| v     | /3/0/7  |
| ts    | /3/0/13 |

## Details

| Field | Description                                              | Type    | Minimum       | Required |
| ----- | -------------------------------------------------------- | ------- | ------------- | -------- |
| v     | Battery reading read by the modem                        | integer | 1             | Yes      |
| ts    | Timestamp as Unix epoch with millisecond precision (UTC) | integer | 1234567890123 | Yes      |
