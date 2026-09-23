import { chromium } from "@playwright/test";
import { readFileSync } from "node:fs";
const font = readFileSync(
  "src/assets/fonts/bricolage-grotesque-latin.woff2",
).toString("base64");
const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  await page.setContent(`<!doctype html><html lang="pt-BR"><head><style>
  @font-face{font-family:Bricolage;src:url(data:font/woff2;base64,${font})}
  *{box-sizing:border-box}body{margin:0;background:#101310;color:#e1e8db;font-family:Bricolage,sans-serif;padding:65px 80px}
  header{display:flex;justify-content:space-between;align-items:center;color:#a0cf8d;font-size:22px}.mark{font-size:48px;font-weight:800;letter-spacing:-4px}
  main{display:flex;align-items:center;justify-content:space-between;margin-top:55px}h1{font-size:104px;letter-spacing:-7px;line-height:.95;font-weight:600;margin:0}h1 span{color:#a0cf8d}
  aside{width:340px;padding:35px;background:#1b2419;color:white;border-radius:12px;transform:rotate(-2deg)}aside p{font-size:25px;line-height:1.4;margin:0}aside small{display:block;margin-top:32px;font-size:16px;color:#a6b6a0}
  footer{margin-top:48px;font-size:23px;color:#a2aea0}
  </style></head><body><header><span class="mark">gm.</span><span>Portfólio de desenvolvimento</span></header><main><h1>Gabriel<br>Mitsuru<span>.</span></h1><aside><p>Backend.<br>Dados.<br>Decisões de engenharia.</p><small>.NET · Angular · PostgreSQL</small></aside></main><footer>Projetos, escolhas técnicas e aprendizados.</footer></body></html>`);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: "src/assets/img/social-preview.png" });
} finally {
  await browser.close();
}
