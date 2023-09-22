# ADR 007: Warning and Error handling

## Warning

It is consider a warning when an object from `LwM2M Asset Tracker v2` is
undefined. The consequence of an object being undefined is that the depended
objects from `nRF Asset Tracker Reported` are not going to be generated. See
[ADR 006 - Result Generation](./006-result-generation.md) for more information.

This situation is communicated through the `onWarning` callback to the user.

```typescript
const onWarningCallback = (warning) => console.log(warning);
const onErrorCallback = (error) => console.log(error);

const result = converter(
  lwM2MAssetTrackerV2,
  onWarningCallback, // here
  onErrorCallback,
);
```

## Error

It is consider an error when the conversion from `LwM2M Asset Tracker v2` object
to `nRF Asset Tracker Reported` object was not successful.

This situation is communicated through the `onError` callback to the user..

```typescript
const onWarningCallback = (warning) => console.log(warning);
const onErrorCallback = (error) => console.log(error);

const result = converter(
  lwM2MAssetTrackerV2,
  onWarningCallback,
  onErrorCallback, // here
);
```
