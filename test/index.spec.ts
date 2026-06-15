import {
	env,
	createExecutionContext,
	waitOnExecutionContext,
	SELF,
} from "cloudflare:test";
import { describe, it, expect } from "vitest";
import worker from "../src/index";

const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe("Browser Share Lab worker", () => {
	it("serves the PWA shell", async () => {
		const request = new IncomingRequest("http://example.com");
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);

		await waitOnExecutionContext(ctx);

		expect(response.headers.get("content-type")).toContain("text/html");
		expect(await response.text()).toContain("Browser Share Lab");
	});

	it("serves a web share target manifest", async () => {
		const response = await SELF.fetch("https://example.com/manifest.webmanifest");
		const manifest = await response.json<{
			share_target: {
				action: string;
				method: string;
				params: { title: string; text: string; url: string };
			};
		}>();

		expect(manifest.share_target.action).toBe("/share");
		expect(manifest.share_target.method).toBe("POST");
		expect(manifest.share_target.params).toMatchObject({
			title: "title",
			text: "text",
			url: "url",
		});
	});

	it("renders posted share payloads", async () => {
		const form = new FormData();
		form.set("title", "Shared title");
		form.set("text", "Selected text");
		form.set("url", "https://example.com/post");

		const response = await SELF.fetch("https://example.com/share", {
			method: "POST",
			body: form,
		});
		const body = await response.text();

		expect(response.headers.get("content-type")).toContain("text/html");
		expect(body).toContain("Shared title");
		expect(body).toContain("Selected text");
		expect(body).toContain("https://example.com/post");
	});
});
