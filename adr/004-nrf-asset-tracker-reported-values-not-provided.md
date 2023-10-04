# ADR: 004 'nRF Asset Tracker reported' values not provided

`nRF Asset Tracker Reported` is expecting the following objects as input.

| nRF Asset Tracker Reported    |
| ----------------------------- |
| [bat](.../docs/battery.md)    |
| [dev](../docs/device.md)      |
| [roam](../docs/roaming.md)    |
| [env](../docs/environment.md) |
| [cfg](../docs/config.md)      |
| [gnss](../docs/gnss.md)       |

However, the equivalent values of

- `hdg` from `gnss` object
- `iccid` from `dev` object
- `band` from `roam` object
- `eest` from `roam` object

Are not provided by `asset_tracker_v2` firmware in the LwM2M protocol version.

For that reason the output of this project will ignore them.

An example of `roam` object is:

```
"roam": {
    "v": {
      "nw": "NB-IoT",
      "rsrp": -97,
      "area": 12,
      "mccmnc": 24202,
      "cell": 33703719,
      "ip": "10.81.183.99"
    },
    "ts": 1563968743666
  }
```

> `band` and `eest` are not part of the output
