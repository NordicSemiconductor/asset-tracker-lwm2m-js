# Environment

## Link: [here](https://github.com/NordicSemiconductor/asset-tracker-cloud-docs/blob/saga/docs/cloud-protocol/Reported.ts)

## Data

| Field | LwM2M                                        |
| ----- | -------------------------------------------- |
| temp  | /3303/0/5700                                 |
| hum   | /3304/0/5700                                 |
| atmp  | /3323/0/5700                                 |
| ts    | /3303/0/5518 or /3304/0/5518 or /3323/0/5518 |

## Details

| Field | Description                                              | Type    | Minimum       | Maximum | Required |
| ----- | -------------------------------------------------------- | ------- | ------------- | ------- | -------- |
| temp  | Temperature reading from external sensor                 | number  |               |         | Yes      |
| hum   | Humidity reading from external sensor                    | number  | 1             | 100     | Yes      |
| atmp  | Atmospheric pressure reading from external sensor in kPa | number  | 0             |         | Yes      |
| ts    | Timestamp as Unix epoch with millisecond precision (UTC) | integer | 1234567890123 |         | Yes      |
