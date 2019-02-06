# An app with markingMode:none enabled

This repo includes a {N} app with `markingMode: none` enabled. It reporoduces 2 common errors related to using this feature. To make it crash:

1. Run the app:
```bash
tns run android
```
2. Click on `ADD BUTTON WITH CLICK LISTENER` button to create a native Android button with a native `click` callback.
3. Click the generated button intermittently.

At some time (within a minute) the app will crash with either of the following errors:
- `Error: com.tns.NativeScriptException: Attempt to use cleared object reference id=<some-object-id-number>`
- `The JavaScript instance no longer has available Java instance counterpart`
