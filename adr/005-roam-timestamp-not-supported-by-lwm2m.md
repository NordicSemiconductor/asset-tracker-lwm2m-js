# ADR 005: Roam timestamp is not supported by Roam timestamp is not supported by LwM2MLwM2M

The roam object expecting by nRF Asset Tracker is creating using the object 4
from LwM2M (Connectivity Monitoring). See
[roam - data transition](../documents/roaming.md) for more information.

However, the Connectivity Monitoring (4) object has not a resource to support
timestamp, which is something required in the roam object.

For that reason, the resource 13 from the Device object (3) will be used there.
