import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  return renderPath("/");
}

async function renderPath(pathname) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set(
    "test",
    String(process.pid) + "-" + Date.now() + "-" + pathname,
  );
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost" + pathname, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("installs Google Tag Manager in the head and body on every route", async () => {
  for (const pathname of ["/", "/thank-you"]) {
    const response = await renderPath(pathname);
    assert.equal(response.status, 200);
    const html = await response.text();

    const headStart = html.indexOf("<head");
    const headEnd = html.indexOf("</head>");
    const scriptIndex = html.indexOf('id="google-tag-manager"');
    assert.ok(headStart >= 0 && scriptIndex > headStart && scriptIndex < headEnd);
    assert.match(
      html,
      /googletagmanager\.com\/gtm\.js\?id=[\s\S]*?GTM-T2XZHHNT/i,
    );

    const bodyStart = html.indexOf("<body");
    const bodyContentStart = html.indexOf(">", bodyStart);
    const noscriptIndex = html.indexOf("<noscript", bodyContentStart);
    const mainIndex = html.indexOf("<main", bodyContentStart);
    assert.ok(
      bodyStart >= 0 &&
        noscriptIndex > bodyContentStart &&
        mainIndex > noscriptIndex,
    );
    assert.match(
      html,
      /<noscript><iframe[^>]+googletagmanager\.com\/ns\.html\?id=GTM-T2XZHHNT/i,
    );
  }
});

test("server-renders the Skin Boosters & IV Drips landing page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Better skin quality begins beneath the surface\./i);
  assert.match(html, /Primary skin concern/i);
  assert.match(html, /class="custom-select-trigger"/i);
  assert.match(html, /aria-haspopup="listbox"/i);
  assert.match(html, /SKINVIVE™/i);
  assert.match(html, /RD1 Skin Renewal Protocol/i);
  assert.match(html, /Profhilo® Protocol/i);
  assert.match(html, /Different concerns need different protocols\./i);
  assert.match(html, /class="compare-table"/i);
  assert.match(html, /Your treatment journey/i);
  assert.match(html, /Your IV wellness experience/i);
  assert.match(html, /Will a skin booster change my facial shape\?/i);
  assert.match(html, /Skin Booster &amp; IV Drips Treatments Hyderabad/i);
  assert.match(html, /https:\/\/iv-drip\.drnishitaranka\.in\//i);
  assert.match(html, /name="robots" content="index, follow"/i);
  assert.match(
    html,
    /property="og:url" content="https:\/\/iv-drip\.drnishitaranka\.in\/"/i,
  );
  assert.match(
    html,
    /property="og:site_name" content="Dr\. Nishita&#x27;s Clinic"/i,
  );
  assert.match(
    html,
    /rel="icon" href="https:\/\/iv-drip\.drnishitaranka\.in\/favicon\.png"/i,
  );
});

test("renders a responsive noindex thank-you page and redirects after successful capture", async () => {
  const response = await renderPath("/thank-you");
  assert.equal(response.status, 200);
  const html = await response.text();
  const [pageSource, thankYouStyles] = await Promise.all([
    readFile(new URL("../app/skin-boosters-landing.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/thank-you/thank-you.module.css", import.meta.url), "utf8"),
  ]);

  assert.match(html, /Your consultation request is with our clinic team/i);
  assert.match(html, /Skin Booster and IV Wellness/i);
  assert.match(html, /What happens next/i);
  assert.match(html, /name="robots" content="noindex, nofollow"/i);
  assert.match(pageSource, /window\.location\.assign\("\/thank-you"\)/);
  assert.match(thankYouStyles, /grid-template-columns:\s*minmax\(0, 1\.14fr\)/);
  assert.match(thankYouStyles, /@media \(max-width: 760px\)[\s\S]*?grid-template-columns:\s*1fr/);
});

test("retains the dark-pink conversion and mobile interaction patterns", async () => {
  const [pageSource, styles] = await Promise.all([
    readFile(new URL("../app/skin-boosters-landing.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(pageSource, /className="custom-select-trigger"/);
  assert.match(styles, /\.custom-select-menu\s*\{[\s\S]*?bottom:\s*calc\(100% \+ 9px\)/);
  assert.match(styles, /\.custom-select\[data-open="true"\] \.custom-select-menu/);
  assert.match(styles, /@media \(max-width: 560px\)[\s\S]*?\.site-header \.call-link\s*\{\s*display:\s*none/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /\.compare-table-section/);
  assert.match(styles, /\.iv-benefit-section/);
  assert.match(styles, /\.terms-disclaimer-section/);
});

test("queues every consultation form answer with source attribution", async () => {
  const pageSource = await readFile(
    new URL("../app/skin-boosters-landing.tsx", import.meta.url),
    "utf8",
  );

  assert.match(pageSource, /https:\/\/api\.drnishitaranka\.in\/v1\/leads/);
  assert.match(pageSource, /landingPage:\s*"Skin Boosters & IV Drips"/);
  assert.match(pageSource, /treatmentAreas:\s*\[area\]/);
  assert.match(pageSource, /referrer:\s*document\.referrer \|\| "Direct \/ none"/);
  assert.match(pageSource, /utmSource:/);
  assert.match(pageSource, /utmMedium:/);
  assert.match(pageSource, /utmCampaign:/);
  assert.match(pageSource, /utmContent:/);
  assert.match(pageSource, /utmTerm:/);
  assert.match(pageSource, /searchParams\.get\("gclid"\)[\s\S]*?searchParams\.get\("gcl_id"\)/);
  assert.match(pageSource, /formAnswers:\s*\{ "Primary skin concern": area \}/);
  assert.match(pageSource, /disabled=\{isSubmitting\}/);
});
