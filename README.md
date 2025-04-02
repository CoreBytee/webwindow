# webwindow

Wrapper around `tr1ckydev/webview-bun` to not freeze the main event loop.

## 📦 Installation

To install `@corebyte/webwindow` using `bun`:

```bash
bun add @corebyte/webwindow
```

## 🖥️ Usage

Before creating a window, ensure you call `Window.check()` at the first line of your index file to verify the environment is properly set up:

```javascript
import { Window } from '@corebyte/webwindow';

Window.check(); 
```

Here's a basic example of how to use `@corebyte/webwindow`:

```javascript
import { Window } from "@corebyte/webwindow";

const window = new Window({
  title: "My Web Window",
  url: "https://example.com",
  size: { width: 800, height: 600 },
});

window.on("close", () => {
  console.log("Window closed");
});
```

> **Note:** Every time you edit a property of the window, the window needs to reload for the changes to take effect.

## ✨ Features

- Non-blocking main event loop.
- Simple API for creating and managing web windows.
- Built on top of [`tr1ckydev/webview-bun`](https://github.com/tr1ckydev/webview-bun).

## 📚 API

### `new Window(options)`

Creates a new web window.

#### Options:
- `title` (string): The title of the window.
- `url` (string): The URL to load in the window.
- `size` (PartialSize): The size settings of the window.
- `show` (boolean): If the window is initially shown.

#### Returns:
An instance of the web window with event listeners and control methods.

### 🛠️ Properties

- `title` (string): The current title of the window. Can be updated, but the window must reload for changes to take effect.
- `url` (string): The current URL loaded in the window. Can be updated, but the window must reload for changes to take effect.
- `size` (object): The current size of the window, with the following structure:
  - `width` (number): The width of the window.
  - `height` (number): The height of the window.
- `isVisible` (boolean): Indicates whether the window is currently visible.

### ⚙️ Functions

- `show()`: Makes the window visible.
- `hide()`: Hides the window.
- `reload()`: Reloads the content of the window.
- `close()`: Closes the window.
- `setTitle(title: string)`: Updates the title of the window. Requires a reload to take effect.
- `setSize(width: number, height: number)`: Updates the size of the window. Requires a reload to take effect.
- `navigate(url: string)`: Navigates the window to a new URL. Requires a reload to take effect.
- `on(event: string, callback: Function)`: Registers an event listener for the specified event (e.g., `close`, `resize`).

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## 📜 License

This project is licensed under the MIT License.
