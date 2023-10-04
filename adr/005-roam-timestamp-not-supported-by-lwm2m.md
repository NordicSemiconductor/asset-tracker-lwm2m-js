# ADR 005: Roam timestamp is not supported by LwM2M object 4

The roam object expecting by `nRF Asset Tracker reported` is creating using the
object 4 from LwM2M (Connectivity Monitoring). See
[roam - data transition](../docs/roaming.md) for more information.

However, the Connectivity Monitoring (4) object has not a resource to support
timestamp, which is something required in the roam object.

For that reason, the resource 13 from object id 3 (device) will be used there.
