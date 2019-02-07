import { Observable } from "tns-core-modules/ui/core/view";
import { Page } from "tns-core-modules/ui/page";
import { StackLayout } from "tns-core-modules/ui/layouts/stack-layout";
import * as utils from "tns-core-modules/utils/utils";

let currentPage: Page;

export function onLoaded(args: any) {
    currentPage = <Page>args.object;
    currentPage.bindingContext = new ViewModel();

    setInterval(
        () => {
            utils.GC();               // <----- V8 GC invoke
            // java.lang.System.gc(); // <----- Android GC invoke
            console.log("utils.GC()");
        }, 100
    );
}

export class ViewModel extends Observable {
    public _fileName: string;
    public _isEnabled: boolean;
    private myFile: java.io.File;    // <----- UNCOMMENT THE FIX

    get fileName(): string {
        return this._fileName;
    }

    set fileName(value: string) {
        this._fileName = value;
        this.notifyPropertyChange("fileName", value)
    }

    set isEnabled(value: boolean) {
        this._isEnabled = value;
        this.notifyPropertyChange("isEnabled", value)
    }

    public onAddClickListener() {
        this.isEnabled = false;
        let root = <StackLayout>currentPage.getViewById('root');
        let btn = new android.widget.Button(root._context);
        btn.setText("ta-daa, now click!");
        root.android.addView(btn);

        let file = new java.io.File('real file');
        // this.myFile = file;             // <----- UNCOMMENT THE FIX
        btn.setOnClickListener(new android.view.View.OnClickListener(
            {
                onClick: () => {
                    this.fileName = `${file.getName()} exists at ${new Date().toTimeString()}`;
                    // this.fileName =`${this.myFile.getName()} exists at ${new Date().toTimeString()}`; // <----- UNCOMMENT THE FIX
                }
            }
        ));
    }
}
