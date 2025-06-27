import { env } from "bun";
import { TypedEmitter } from "tiny-typed-emitter";
import { SizeHint, Webview } from "webview-bun";

export type Size = {
    width: number;
    height: number;
    constraint: SizeHint;
};

export type PartialSize =
    | {
        width: number;
        height: number;
        constraint?: SizeHint;
    }
    | ({
        width: number;
        height: number;
    } & {
        constraint: SizeHint;
    });

export { SizeHint as SizeConstraint } from "webview-bun";

function fillSizeDefaults(size: PartialSize, currentSize: Size): Size {
    return {
        width: size.width ?? currentSize.width,
        height: size.height ?? currentSize.height,
        constraint: size.constraint ?? currentSize.constraint ?? SizeHint.NONE,
    };
}

function setWebviewSize(webview: Webview, size: Size) {
    webview.size = {
        width: size.width,
        height: size.height,
        hint: size.constraint
    };
}

const DEFAULT_SIZE = { width: 400, height: 400, constraint: SizeHint.NONE }

interface WindowEvents {
    close: () => void
    navigate: (url: string) => void;
}

export class Window extends TypedEmitter<WindowEvents> {
    private _debug: boolean = false;
    private _title: string;
    private _url: string;
    private _size: Size;
    private _shown: boolean;
    private _webview: Webview | null = null;
    constructor(
        options: {
            debug?: boolean;
            title?: string;
            url: string;
            size?: PartialSize;
            show?: boolean
        }
    ) {
        super()

        this._debug = options.debug ?? false;
        this._title = options.title || "Bun";
        this._url = options.url;
        this._size = fillSizeDefaults(options.size ?? DEFAULT_SIZE, DEFAULT_SIZE);
        this._shown = false;

        if (options.show) this.show()
    }

    get title() {
        return this._title;
    }

    get url() {
        return this._url;
    }

    get size() {
        return this._size;
    }

    get shown() {
        return this._shown;
    }

    /**
     * Shows the window
     * @throws If the window is already shown
     */
    show() {
        if (this._shown) throw new Error("Window already shown");

        this._webview = new Webview(this._debug)
        this._webview.title = this._title;
        setWebviewSize(this._webview, this._size);
        this._webview.bind("_webview_navigate", (url: string) => this.emit("navigate", url))
        this._webview.init("window._webview_navigate(location.href)")
        this._webview.navigate(this._url);
        this._webview.runNonBlocking(() => this.emit("close"))

        this._shown = true;
    }

    /**
     * Hides the window
     * @throws If the window is already hidden
     */
    hide() {
        if (!this._shown) throw new Error("Window already hidden");

        this._webview!.destroy()
        this._webview = null;
        this._shown = false;
    }

    /**
     * Closes the window if it exists.
     */
    close() {
        if (!this._shown) return;
        this.hide()
    }

    /**
     * Reloads the window.
     * If the window is not shown, it will be shown again.
     * @throws If the webview is not initialized
     */
    reload() {
        if (!this._webview) throw new Error("Webview not initialized");
        this._webview.eval("window.location.reload()");
    }

    /**
     * Evaluates code in the webview.
     * @param code The code to evaluate in the webview.
     * @throws If the webview is not initialized
     */
    evaluate(code: string) {
        if (!this._webview) throw new Error("Webview not initialized");
        this._webview.eval(code);
    }

    /**
     * Set the title of the window. 
     * Only applies after reloading the window.
     * @param title The new title
     */
    setTitle(title: string) {
        this._title = title;
        if (this._webview) this._webview.title = title;
    }

    /**
     * Set the size of the window. 
     * @param size The new size
     */
    setSize(size: PartialSize) {
        this._size = fillSizeDefaults(size, this._size);
        if (this._webview) setWebviewSize(this._webview, this._size);
    }

    /**
     * Set the url of the window. 
     * @param url The new url
     */
    setURL(url: string) {
        this._url = url;
        if (this._webview)
            this._webview.navigate(url);
    }
}