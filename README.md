# webwindow

Wrapper around `tr1ckydev/webview-bun` to not freeze the main event loop.

## 📦 Installation

To install `@corebyte/webwindow` using `bun`:

```bash
bun add @corebyte/webwindow
```

## 🖥️ Usage

Here's a basic example of how to use `@corebyte/webwindow`:

```javascript
import { Window } from "@corebyte/webwindow";

const window = new Window({
  title: "My Web Window", // optional, defaults to "Bun"
  url: "https://example.com", // required
  size: { width: 800, height: 600 }, // optional
  show: true, // optional, show window immediately
  debug: false // optional, enable debug mode
});

window.on("close", () => {
  console.log("Window closed");
});
window.on("navigate", (url) => {
  console.log("Navigated to:", url);
});

// Dynamically update properties
window.setTitle("New Title");
window.setSize({ width: 1024, height: 768 });
window.setURL("https://another-url.com");
window.reload();
window.evaluate("alert('Hello from webview!')");
```

## ✨ Features

- Non-blocking main event loop.
- Simple API for creating and managing web windows.
- Built on top of [`tr1ckydev/webview-bun`](https://github.com/tr1ckydev/webview-bun).

## 📚 API

### `new Window(options)`

Creates a new web window.

#### Options:
- `title` (string, optional): The title of the window. Defaults to "Bun".
- `url` (string, required): The URL to load in the window.
- `size` (PartialSize, optional): The size settings of the window.
- `show` (boolean, optional): If the window is initially shown.
- `debug` (boolean, optional): Enable debug mode.

#### Returns:
An instance of the web window with event listeners and control methods.

### 🛠️ Properties

- `title` (string): The current title of the window.
- `url` (string): The current URL loaded in the window.
- `shown` (boolean): Indicates whether the window is currently visible.
- `size` (object): The current size of the window, with the following structure:
  - `width` (number): The width of the window.
  - `height` (number): The height of the window.
  - `constraint` (SizeConstraint): The size constraint of the window.

### 📢 Events

The `Window` class emits the following events that can be listened to using the `on()` function:

- `close`: Emitted when the window is closed.
  - Callback signature: `() => void`
- `navigate`: Emitted when the window navigates to a new URL.
  - Callback signature: `(url: string) => void`

### ⚙️ Methods

- `show()`: Makes the window visible. Throws if already shown.
- `hide()`: Hides the window. Throws if already hidden.
- `reload()`: Reloads the content of the window. Throws if the webview is not initialized.
- `close()`: Closes the window.
- `setTitle(title: string)`: Updates the title of the window. Applies immediately if shown.
- `setSize(size: PartialSize)`: Updates the size of the window. Applies immediately if shown.
- `setURL(url: string)`: Navigates the window to a new URL. Applies immediately if shown.
- `evaluate(code: string)`: Evaluates JavaScript code in the webview. Throws if the webview is not initialized.
- `on(event: string, callback: Function)`: Registers an event listener for the specified event (`close`, `navigate`).

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## 📜 License

This project is licensed under the MIT License.
