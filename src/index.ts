const APP_NAME = "Browser Share Lab";

function html(body: string, init: ResponseInit = {}): Response {
	const headers = new Headers(init.headers);
	headers.set("content-type", "text/html; charset=utf-8");

	return new Response(body, {
		...init,
		headers,
	});
}

function text(body: string, contentType: string): Response {
	return new Response(body, {
		headers: {
			"content-type": contentType,
			"cache-control": "no-store",
		},
	});
}

function escapeHtml(value: unknown): string {
	return String(value)
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");
}

function basePage(content: string): string {
	return `<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="theme-color" content="#111314">
	<link rel="manifest" href="/manifest.webmanifest">
	<title>${APP_NAME}</title>
	<style>
		:root {
			color-scheme: light;
			--ink: #111314;
			--muted: #66706a;
			--paper: #f6f3ec;
			--panel: #fffcf4;
			--line: #d8d0c1;
			--accent: #0b7f68;
			--hot: #cf3f2f;
			--code: #202522;
		}
		* { box-sizing: border-box; }
		body {
			margin: 0;
			background:
				linear-gradient(90deg, rgba(17, 19, 20, 0.045) 1px, transparent 1px),
				linear-gradient(rgba(17, 19, 20, 0.045) 1px, transparent 1px),
				var(--paper);
			background-size: 28px 28px;
			color: var(--ink);
			font: 16px/1.55 ui-serif, Georgia, Cambria, "Times New Roman", serif;
		}
		main {
			width: min(960px, calc(100% - 32px));
			margin: 0 auto;
			padding: 32px 0 48px;
		}
		header {
			display: grid;
			grid-template-columns: 1fr auto;
			gap: 20px;
			align-items: end;
			padding: 24px 0 20px;
			border-bottom: 3px solid var(--ink);
		}
		h1 {
			margin: 0;
			font: 800 clamp(2.4rem, 9vw, 5.8rem)/0.88 ui-sans-serif, system-ui, sans-serif;
			letter-spacing: 0;
			text-transform: uppercase;
			max-width: 720px;
		}
		.badge {
			justify-self: start;
			border: 2px solid var(--ink);
			padding: 8px 10px;
			font: 700 0.78rem/1 ui-sans-serif, system-ui, sans-serif;
			text-transform: uppercase;
			background: var(--hot);
			color: white;
			box-shadow: 5px 5px 0 var(--ink);
			white-space: nowrap;
		}
		.grid {
			display: grid;
			grid-template-columns: minmax(0, 1.05fr) minmax(280px, 0.95fr);
			gap: 18px;
			margin-top: 18px;
		}
		.panel {
			border: 2px solid var(--ink);
			background: var(--panel);
			box-shadow: 7px 7px 0 rgba(17, 19, 20, 0.18);
			padding: 18px;
		}
		h2 {
			margin: 0 0 12px;
			font: 800 1.05rem/1.1 ui-sans-serif, system-ui, sans-serif;
			text-transform: uppercase;
			letter-spacing: 0;
		}
		p { margin: 0 0 12px; color: var(--muted); }
		.actions {
			display: flex;
			flex-wrap: wrap;
			gap: 10px;
			margin-top: 14px;
		}
		a.button, button {
			appearance: none;
			border: 2px solid var(--ink);
			background: var(--accent);
			color: white;
			cursor: pointer;
			display: inline-flex;
			align-items: center;
			min-height: 42px;
			padding: 0 14px;
			text-decoration: none;
			font: 800 0.85rem/1 ui-sans-serif, system-ui, sans-serif;
			text-transform: uppercase;
			box-shadow: 4px 4px 0 var(--ink);
		}
		button.secondary, a.secondary { background: var(--panel); color: var(--ink); }
		form {
			display: grid;
			gap: 10px;
		}
		label {
			display: grid;
			gap: 5px;
			font: 800 0.78rem/1 ui-sans-serif, system-ui, sans-serif;
			text-transform: uppercase;
		}
		input, textarea {
			width: 100%;
			border: 2px solid var(--ink);
			background: white;
			color: var(--ink);
			font: 0.95rem/1.4 ui-sans-serif, system-ui, sans-serif;
			padding: 10px;
			border-radius: 0;
		}
		textarea { min-height: 92px; resize: vertical; }
		.result {
			display: grid;
			gap: 12px;
		}
		.kv {
			display: grid;
			grid-template-columns: 150px minmax(0, 1fr);
			border: 2px solid var(--ink);
			background: white;
		}
		.kv dt, .kv dd {
			margin: 0;
			padding: 10px;
			border-bottom: 1px solid var(--line);
			min-width: 0;
			overflow-wrap: anywhere;
		}
		.kv dt {
			font: 800 0.78rem/1.2 ui-sans-serif, system-ui, sans-serif;
			text-transform: uppercase;
			background: #ece5d8;
			border-right: 1px solid var(--line);
		}
		.kv dt:last-of-type, .kv dd:last-of-type { border-bottom: 0; }
		code, pre {
			font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		}
		pre {
			margin: 0;
			padding: 12px;
			overflow: auto;
			background: var(--code);
			color: #f9f3df;
			border: 2px solid var(--ink);
			white-space: pre-wrap;
			overflow-wrap: anywhere;
		}
		.notice {
			border-left: 8px solid var(--hot);
			padding-left: 12px;
			color: var(--ink);
		}
		@media (max-width: 760px) {
			main { width: min(100% - 20px, 960px); padding-top: 14px; }
			header, .grid { grid-template-columns: 1fr; }
			.badge { justify-self: start; }
			.kv { grid-template-columns: 1fr; }
			.kv dt { border-right: 0; }
		}
	</style>
</head>
<body>
	<main>
		<header>
			<h1>${APP_NAME}</h1>
			<div class="badge">PWA Share Target</div>
		</header>
		${content}
	</main>
	<script>
		if ("serviceWorker" in navigator) {
			navigator.serviceWorker.register("/sw.js");
		}
		const shareButton = document.querySelector("[data-share-self]");
		if (shareButton) {
			shareButton.hidden = !navigator.share;
			shareButton.addEventListener("click", async () => {
				await navigator.share({
					title: "Browser Share Lab",
					text: "Shared from the test page",
					url: location.origin + "/sample"
				});
			});
		}
	</script>
</body>
</html>`;
}

function renderHome(): Response {
	return html(
		basePage(`<section class="grid">
	<div class="panel">
		<h2>Install target</h2>
		<p class="notice">Install this app from Android Chrome, then open another browser page and use Share.</p>
		<p>The share sheet should send title, selected text, URL, and compatible files to <code>/share</code>.</p>
		<div class="actions">
			<a class="button" href="/manifest.webmanifest">Manifest</a>
			<a class="button secondary" href="/share">Empty result</a>
			<button class="secondary" type="button" data-share-self>Share this page</button>
		</div>
	</div>
	<div class="panel">
		<h2>Manual POST</h2>
		<form action="/share" method="post" enctype="multipart/form-data">
			<label>Title <input name="title" value="Manual title"></label>
			<label>Text <textarea name="text">Manual text payload</textarea></label>
			<label>URL <input name="url" value="https://example.com/article"></label>
			<label>Files <input name="files" type="file" multiple></label>
			<button type="submit">Send</button>
		</form>
	</div>
</section>`),
	);
}

function renderManifest(origin: string): Response {
	const manifest = {
		name: APP_NAME,
		short_name: "Share Lab",
		description: "A minimal Cloudflare Worker PWA for testing Web Share Target payloads.",
		id: "/",
		start_url: "/",
		scope: "/",
		display: "standalone",
		background_color: "#f6f3ec",
		theme_color: "#111314",
		icons: [
			{
				src: `${origin}/icon.svg`,
				sizes: "any",
				type: "image/svg+xml",
				purpose: "any maskable",
			},
		],
		share_target: {
			action: "/share",
			method: "POST",
			enctype: "multipart/form-data",
			params: {
				title: "title",
				text: "text",
				url: "url",
				files: [
					{
						name: "files",
						accept: ["image/*", "text/plain", "application/pdf"],
					},
				],
			},
		},
	};

	return text(JSON.stringify(manifest, null, 2), "application/manifest+json; charset=utf-8");
}

function renderServiceWorker(): Response {
	return text(
		`self.addEventListener("install", (event) => {
	self.skipWaiting();
});

self.addEventListener("activate", (event) => {
	event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", () => {});
`,
		"text/javascript; charset=utf-8",
	);
}

function renderIcon(): Response {
	return text(
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
	<rect width="512" height="512" fill="#111314"/>
	<path d="M108 144h296v224H108z" fill="#f6f3ec"/>
	<path d="M150 190h212v32H150zm0 66h148v32H150zm0 66h92v32h-92z" fill="#111314"/>
	<circle cx="362" cy="318" r="54" fill="#0b7f68"/>
	<path d="M334 318h56m-28-28v56" stroke="#f6f3ec" stroke-width="20" stroke-linecap="square"/>
</svg>`,
		"image/svg+xml; charset=utf-8",
	);
}

async function renderShare(request: Request): Promise<Response> {
	if (request.method === "GET") {
		return html(
			basePage(`<section class="panel">
	<h2>Shared payload</h2>
	<p class="notice">No share payload was received. Open this page through Android Share after installing the PWA.</p>
	<div class="actions"><a class="button" href="/">Back</a></div>
</section>`),
		);
	}

	if (request.method !== "POST") {
		return new Response("Method Not Allowed", {
			status: 405,
			headers: { allow: "GET, POST" },
		});
	}

	const form = await request.formData();
	const fields = ["title", "text", "url"].map((name) => {
		const value = form.get(name);
		return `<dt>${escapeHtml(name)}</dt><dd>${value ? escapeHtml(value) : "<em>empty</em>"}</dd>`;
	});

	const files = form.getAll("files").filter((value): value is File => typeof value !== "string");

	const fileRows =
		files.length > 0
			? files
					.map(
						(file) =>
							`<dt>${escapeHtml(file.name || "(unnamed)")}</dt><dd>${escapeHtml(file.type || "unknown type")} / ${file.size} bytes</dd>`,
					)
					.join("")
			: `<dt>files</dt><dd><em>empty</em></dd>`;

	const rawEntries = [...form.entries()].map(([key, value]) => {
		if (typeof value === "string") {
			return { key, type: "field", value };
		}
		return {
			key,
			type: "file",
			name: value.name,
			mime: value.type,
			size: value.size,
		};
	});

	return html(
		basePage(`<section class="grid">
	<div class="panel result">
		<h2>Shared payload</h2>
		<dl class="kv">${fields.join("")}</dl>
		<h2>Files</h2>
		<dl class="kv">${fileRows}</dl>
		<div class="actions"><a class="button" href="/">Back</a></div>
	</div>
	<div class="panel">
		<h2>Raw form data</h2>
		<pre>${escapeHtml(JSON.stringify(rawEntries, null, 2))}</pre>
	</div>
</section>`),
	);
}

export default {
	async fetch(request, _env, _ctx): Promise<Response> {
		const url = new URL(request.url);

		if (url.pathname === "/") {
			return renderHome();
		}
		if (url.pathname === "/manifest.webmanifest") {
			return renderManifest(url.origin);
		}
		if (url.pathname === "/sw.js") {
			return renderServiceWorker();
		}
		if (url.pathname === "/icon.svg") {
			return renderIcon();
		}
		if (url.pathname === "/share") {
			return renderShare(request);
		}

		return html(
			basePage(`<section class="panel">
	<h2>Not found</h2>
	<p class="notice"><code>${escapeHtml(url.pathname)}</code> is not available.</p>
	<div class="actions"><a class="button" href="/">Back</a></div>
</section>`),
			{ status: 404 },
		);
	},
} satisfies ExportedHandler<Env>;
