import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const pages = [
  ["/", "Gabriel Mitsuru"],
  ["/projetos/sinalvortex.html", "SinalVortex"],
  ["/projetos/repcortex.html", "RepCortex"],
  ["/en/index.html", "Gabriel Mitsuru"],
  ["/en/projetos/sinalvortex.html", "SinalVortex"],
  ["/en/projetos/repcortex.html", "RepCortex"],
];
for (const [path, name] of pages) {
  for (const width of [390, 768, 1440]) {
    for (const theme of ["light", "dark"]) {
      test(`${path} / ${width} / ${theme}`, async ({ page }, testInfo) => {
        const failures = [];
        page.on("pageerror", (error) => failures.push(error.message));
        page.on("console", (message) => {
          if (message.type() === "error") failures.push(message.text());
        });
        page.on("response", (response) => {
          if (response.url().includes("127.0.0.1") && response.status() >= 400)
            failures.push(`${response.status()} ${response.url()}`);
        });
        await page.setViewportSize({ width, height: 960 });
        await page.emulateMedia({
          colorScheme: theme,
          reducedMotion: "reduce",
        });
        await page.addInitScript(
          (value) => localStorage.setItem("theme", value),
          theme,
        );
        await page.goto(path);
        await page.evaluate(() => document.fonts.ready);
        await expect(page.locator("h1")).toHaveCount(1);
        await expect(page.locator("h1")).toContainText(
          name === "Gabriel Mitsuru" ? "Gabriel" : name,
        );
        await expect(page.locator("html")).toHaveClass(
          theme === "dark" ? /dark/ : /^$/,
        );
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
        expect(
          await page.evaluate(
            () =>
              document.fonts.check("600 24px Bricolage") &&
              document.fonts.check('400 18px "Source Sans"'),
          ),
        ).toBe(true);
        const invalidLinks = await page.evaluate(() =>
          [...document.querySelectorAll('a[href^="#"]')]
            .filter((a) => !document.getElementById(a.hash.slice(1)))
            .map((a) => a.hash),
        );
        expect(invalidLinks).toEqual([]);
        const accessibility = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze();
        expect(accessibility.violations).toEqual([]);
        await page.screenshot({
          path: testInfo.outputPath(`${name}-${width}-${theme}.png`),
          fullPage: true,
        });
        expect(failures).toEqual([]);
      });
    }
  }
}
test("Navigation, theme persistence, keyboard and reduced motion", async ({
  page,
}) => {
  await page.addInitScript(() => {
    if (!localStorage.getItem("theme")) localStorage.setItem("theme", "light");
  });
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Pular para o conteúdo" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#conteudo$/);
  await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
  await page.getByRole("button", { name: "Ativar tema escuro" }).click();
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.getByRole("link", { name: "Explorar projetos" }).click();
  await expect(page).toHaveURL(/#projetos$/);
  await expect(
    page.locator(".site-header nav a[aria-current]"),
  ).toHaveAttribute("href", "#projetos");
  await page
    .getByRole("link", { name: "Explorar estudo de caso" })
    .first()
    .click();
  await expect(page).toHaveURL(/sinalvortex.html$/);
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.getByRole("link", { name: "Todos os projetos" }).click();
  await expect(page).toHaveURL(/index.html#projetos$/);
  await page.getByRole("tab", { name: "RepCortex" }).click();
  await page.getByRole("link", { name: "Explorar estudo de caso" }).click();
  await expect(page).toHaveURL(/repcortex.html$/);
});
test("Language switch keeps the current page and translates interactive feedback", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("link", { name: "English" }).click();
  await expect(page).toHaveURL(/\/en\/index.html$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(
    page.getByRole("heading", { name: "My projects" }),
  ).toBeVisible();
  await page.getByRole("tab", { name: "RepCortex" }).click();
  await page.getByRole("link", { name: "Explore case study" }).click();
  await expect(page).toHaveURL(/\/en\/projetos\/repcortex.html$/);
  await page.getByRole("link", { name: "Portuguese" }).click();
  await expect(page).toHaveURL(/\/projetos\/repcortex.html$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
  await page.getByRole("link", { name: "English" }).click();
  await page.getByRole("link", { name: "SinalVortex" }).last().click();
  await expect(page).toHaveURL(/\/en\/projetos\/sinalvortex.html$/);
  await page.getByRole("button", { name: "What if it fails?" }).click();
  await expect(page.getByRole("status")).toContainText("Simulated failure", {
    timeout: 6000,
  });
  await expect(
    page.getByRole("button", { name: "Pause animations" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Switch to light theme" }).click();
  await expect(
    page.getByRole("button", { name: "Switch to dark theme" }),
  ).toBeVisible();
});
test("All content and navigation remain available without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  for (const [path] of pages) {
    await page.goto(`http://127.0.0.1:4173${path}`);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator(".theme-toggle")).toBeHidden();
    await expect(page.locator("main")).toBeVisible();
    await expect(
      page.locator('a[href="mailto:gabrielkameoka@gmail.com"]').first(),
    ).toBeAttached();
  }
  await page.goto("http://127.0.0.1:4173/projetos/sinalvortex.html");
  await page.getByRole("link", { name: "Todos os projetos" }).click();
  await expect(page).toHaveURL(/index.html#projetos$/);
  await context.close();
});
test("Theme still works if storage is blocked", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new Error("Storage unavailable");
      },
    });
  });
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  await page.getByRole("button", { name: "Ativar tema claro" }).click();
  await expect(page.locator("html")).not.toHaveClass(/dark/);
});

test("Interactive diagram traces delivery and failure without calling a backend", async ({
  page,
}) => {
  const requests = [];
  page.on("request", (request) => {
    if (["fetch", "xhr"].includes(request.resourceType()))
      requests.push(request.url());
  });
  await page.goto("/projetos/sinalvortex.html");
  const diagram = page.locator(".interactive-system");
  await diagram.getByRole("button", { name: "Enviar mensagem" }).click();
  await expect(diagram.locator('[data-flow="api"]')).toHaveClass(/flow-active/);
  await expect(
    diagram.getByRole("button", { name: "E se falhar?" }),
  ).toBeDisabled();
  await expect(diagram.getByRole("status")).toContainText("Pronto.", {
    timeout: 6000,
  });
  await expect(
    diagram.getByRole("button", { name: "E se falhar?" }),
  ).toBeEnabled();
  await diagram.getByRole("button", { name: "E se falhar?" }).click();
  await expect(diagram.getByRole("status")).toContainText("Falha simulada", {
    timeout: 6000,
  });
  await expect(diagram.locator(".delivery strong")).toHaveText("DLQ");
  await expect(
    diagram.getByRole("button", { name: "Enviar mensagem" }),
  ).toBeEnabled();
  await diagram.getByRole("button", { name: "Enviar mensagem" }).click();
  await expect(diagram.getByRole("status")).toContainText("Pronto.", {
    timeout: 6000,
  });
  await expect(diagram.locator(".delivery strong")).toHaveText("Mailpit");
  expect(requests).toEqual([]);
});

test("Simulation works by keyboard with reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/projetos/sinalvortex.html");
  const trigger = page.getByRole("button", { name: "E se falhar?" });
  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("status")).toContainText("Falha simulada");
  expect(
    await page
      .locator(".interactive-system")
      .evaluate((element) => getComputedStyle(element).transform),
  ).toBe("none");
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
});

test("Workspace source tabs support keyboard navigation and remain readable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/projetos/sinalvortex.html");
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.getByRole("tab", { name: "Fluxo da mensagem" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Código-fonte" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(page.locator("#code-panel")).toBeVisible();
  await expect(page.locator("#flow-panel")).toBeHidden();
  await expect(page.locator(".source-code")).toContainText("EnqueueAsync");
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.keyboard.press("Home");
  await expect(page.locator("#flow-panel")).toBeVisible();
});

test("Motion can be paused and the preference persists", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/projetos/sinalvortex.html");
  await page.getByRole("button", { name: "Pausar animações" }).click();
  await expect(page.locator("body")).toHaveClass(/motion-paused/);
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Ativar animações" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Enviar mensagem" }).click();
  await expect(page.getByRole("status")).toContainText("Pronto.");
  await page.getByRole("button", { name: "Ativar animações" }).click();
  await expect(page.locator("body")).not.toHaveClass(/motion-paused/);
});
