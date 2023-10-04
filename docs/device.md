# Device

## Link: [here](https://github.com/NordicSemiconductor/asset-tracker-cloud-docs/blob/v31.0.0/docs/cloud-protocol/Reported.ts)

## Data

| Field | LwM2M                                                                              |
| ----- | ---------------------------------------------------------------------------------- |
| imei  | /3/0/2                                                                             |
| iccid | [value not provided](../adr/004-nrf-asset-tracker-reported-values-not-provided.md) |
| modV  | /3/0/3                                                                             |
| brdV  | /3/0/0                                                                             |
| ts    | /3/0/13                                                                            |

## Details

| Field | Description                                              | Type    | Min Length    | Max Length | Examples                 | Required |
| ----- | -------------------------------------------------------- | ------- | ------------- | ---------- | ------------------------ | -------- |
| imei  | Board IMEI                                               | string  | 15            | 16         | ["352656106111232"]      | Yes      |
| iccid | SIM ICCID                                                | string  | 19            | 20         | ["89450421180216216095"] | No       |
| modV  | Modem Firmware Version                                   | string  | 1             |            | ["mfw_nrf9160_1.0.0"]    | Yes      |
| brdV  | Board Version                                            | string  | 1             |            | ["thingy91_nrf9160"]     | Yes      |
| ts    | Timestamp as Unix epoch with millisecond precision (UTC) | integer | 1234567890123 |            |                          | Yes      |
