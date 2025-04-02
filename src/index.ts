import { SizeHint, Webview } from "webview-bun";
import cluster, { type Worker } from "node:cluster";
import { env } from "bun";
import EventEmitter from "node:events";

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

const DEFAULT_SIZE = { width: 400, height: 400, constraint: SizeHint.NONE }

export class Window extends EventEmitter {
    /**
     * Checks if this is the worker and if the webview needs to be opened.
     * Must be called at the top of your index file.
     */
    static check() {
        if (!env.WEBVIEW_DATA) return;

        const data = JSON.parse(env.WEBVIEW_DATA);
        const webview = new Webview();
        webview.title = data.title;
        webview.size = data.size;

        webview.navigate(data.url);
        webview.run();
        process.exit(0);
    }

    private _title: string;
    private _url: string;
    private _size: Size;
    private _shown: boolean;
    private _worker: Worker | undefined;
    constructor(
        options: {
            title?: string;
            url: string;
            size?: PartialSize;
            show?: boolean
        }
    ) {
        super()

        this._title = options.title || "Bun";
        this._url = options.url;
        this._size = fillSizeDefaults(options.size ?? DEFAULT_SIZE, DEFAULT_SIZE);
        this._shown = options.show ?? true;

        if (this._shown) this.show();
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

        this._worker = cluster.fork({
            WEBVIEW_DATA: JSON.stringify({
                title: this._title,
                url: this._url,
                size: {
                    width: this._size.width,
                    height: this._size.height,
                    hint: this._size.constraint,
                },
            }),
        });

        this._worker.on("exit", () => {
            this._shown = false;
            this.emit("close");
        })

        this._shown = true;
    }

    /**
     * Hides the window
     * @throws If the window is already hidden
     */
    hide() {
        if (!this._shown) throw new Error("Window already hidden");

        this._worker?.kill();
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
     */
    reload() {
        this.close();
        this.show();
    }

    /**
     * Set the title of the window. 
     * Only applies after reloading the window.
     * @param title The new title
     */
    setTitle(title: string) {
        this._title = title;
    }

    /**
     * Set the size of the window. 
     * Only applies after reloading the window.
     * @param size The new size
     */
    setSize(size: PartialSize) {
        this._size = fillSizeDefaults(size, this._size);
    }

    /**
     * Set the url of the window. 
     * Only applies after reloading the window.
     * @param url The new url
     */
    setURL(url: string) {
        this._url = url;
    }
}