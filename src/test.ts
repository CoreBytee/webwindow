import { Window } from ".";

const window = new Window({
	url: "https://example.com",
	show: true,
});

window.addListener("navigate", (url) => console.log("navigate:", url));
window.addListener("close", () => console.log("close"));

// window.show()
