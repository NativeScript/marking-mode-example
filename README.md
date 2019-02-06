# An app with markingMode:none enabled

This repo includes a {N} app with `markingMode: none` enabled. It reporoduces 2 common errors related to using this feature. 

## To make it crash

1. Run the app:
```bash
tns run android
```
2. Click on `ADD BUTTON WITH CLICK LISTENER` button to create a native Android button with a native `click` callback.
3. Click the generated button intermittently (until crash).

At some time (within a minute) the app will crash with either of the following errors:
- `Error: com.tns.NativeScriptException: Attempt to use cleared object reference id=<some-object-id-number>`
- `The JavaScript instance no longer has available Java instance counterpart`

## To fix it

Find the "UNCOMMENT THE FIX" lines in `home-page.ts` and uncomment them.

## But wait, what happened? (explanation)

Consider this method from our example:

```js
public onAddClickListener() {
    let root = <StackLayout>currentPage.getViewById('root');
    let btn = new android.widget.Button(root._context);
    btn.setText("ta-daa, now click!");
    root.android.addView(btn);

    let file = new java.io.File('real file');

    btn.setOnClickListener(new android.view.View.OnClickListener(
        {
            onClick: () => {
                this.fileName = `${file.getName()} exists at ${new Date().toTimeString()}`;
            }
        }
    ));
}
```

If you look in `onAddClickListener()` handler in the `ViewModel`, you will see that:
1. A native Android `android.widget.Button` is created and added to the page. 
2. A native `java.io.File` is created. 
3. An OnClickListener interface implementation is set to the button, and inside we **call file.getName()**. 

So, the `java.io.File` instance is enclosed by the native button's `onClick` callback implementation, but with `markingMode: none` enabled the framework longer takes care of finding out that connection. When GC happens in V8 or in Android the `java.io.File` instance (or its native representation) is GC'ed. This can result in either Java or JavaScript instance missing and upon calling of the `onClick` the app crashes with any of the a.m. errors.

... to be continued