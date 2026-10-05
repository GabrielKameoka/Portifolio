const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const english = document.documentElement.lang.startsWith("en");
const copy = english
  ? {
      reduced: "Reduced motion is enabled in your system",
      resume: "▶ Resume animations",
      pause: "Ⅱ Pause animations",
      worker: "Delivery, retries, and DLQ",
      captured: "Email captured locally",
      following: "Following the message…",
      retry: "Temporary failure · retrying",
      exhausted: "Retries exhausted",
      retained: "Message retained for investigation",
      complete: "Processing complete",
      failed:
        "Simulated failure: after the retries, the message stays in the DLQ.",
      done: "Done. In the local demo, Mailpit would capture the email.",
    }
  : {
      reduced: "Movimento reduzido pelo sistema",
      resume: "▶ Ativar animações",
      pause: "Ⅱ Pausar animações",
      worker: "Entrega, retry e DLQ",
      captured: "E-mail capturado localmente",
      following: "Acompanhando a mensagem…",
      retry: "Falha temporária · nova tentativa",
      exhausted: "Tentativas esgotadas",
      retained: "Mensagem retida para investigação",
      complete: "Processamento concluído",
      failed: "Falha simulada: após as tentativas, a mensagem fica na DLQ.",
      done: "Pronto. Na demo local, o e-mail seria capturado no Mailpit.",
    };
const motionButton = document.querySelector(".motion-toggle");
let paused = false;
try {
  paused = localStorage.getItem("motion-paused") === "true";
} catch {
  /* Optional preference. */
}
const motionDisabled = () => paused || reducedMotion.matches;
const syncMotion = () => {
  document.body.classList.toggle("motion-paused", motionDisabled());
  if (motionDisabled())
    document.getAnimations().forEach((animation) => animation.cancel());
  if (!motionButton) return;
  motionButton.hidden = false;
  motionButton.disabled = reducedMotion.matches;
  motionButton.setAttribute("aria-pressed", String(motionDisabled()));
  motionButton.textContent = reducedMotion.matches
    ? copy.reduced
    : paused
      ? copy.resume
      : copy.pause;
};
motionButton?.addEventListener("click", () => {
  paused = !paused;
  try {
    localStorage.setItem("motion-paused", String(paused));
  } catch {
    /* Still works in this visit. */
  }
  syncMotion();
});
reducedMotion.addEventListener("change", syncMotion);
syncMotion();

// A single opening sequence; the document never depends on animation to be visible.
const opening = document.querySelectorAll(".name-line");
if (!motionDisabled()) {
  opening.forEach((line, index) =>
    line.animate(
      [
        { opacity: 0, transform: "translateY(32px) rotate(2deg)" },
        { opacity: 1, transform: "translateY(0) rotate(0deg)" },
      ],
      {
        duration: 800,
        delay: 90 + index * 110,
        easing: "cubic-bezier(.16,1,.3,1)",
        fill: "backwards",
      },
    ),
  );
}

// Reading progress follows native scrolling without intercepting it.
let scrollPending = false;
const updateProgress = () => {
  scrollPending = false;
  const distance = document.documentElement.scrollHeight - innerHeight;
  document.documentElement.style.setProperty(
    "--reading-progress",
    distance > 0 ? String(Math.min(1, Math.max(0, scrollY / distance))) : "0",
  );
};
addEventListener(
  "scroll",
  () => {
    if (!scrollPending) {
      scrollPending = true;
      requestAnimationFrame(updateProgress);
    }
  },
  { passive: true },
);
addEventListener("resize", updateProgress);
updateProgress();

// Reveal the project, decision and tool groups once as they enter the workspace.
const previews = document.querySelectorAll(
  ".project-evidence, .review-diagram, .notes-grid article, .skills-grid article, .experience-list article, .section-heading h2",
);
const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      if (!motionDisabled())
        entry.target.animate(
          [
            { opacity: 0.45, transform: "translateX(20px)" },
            { opacity: 1, transform: "translateX(0)" },
          ],
          { duration: 650, easing: "cubic-bezier(.16,1,.3,1)" },
        );
      observer.unobserve(entry.target);
    }
  },
  { threshold: 0.2 },
);
previews.forEach((preview) => observer.observe(preview));

const diagram = document.querySelector(".interactive-system");
if (diagram) {
  const controls = diagram.querySelector(".flow-controls");
  const buttons = [...controls.querySelectorAll("button")];
  const status = controls.querySelector(".flow-status");
  const nodes = [...diagram.querySelectorAll("[data-flow]")];
  const workerCaption = diagram.querySelector('[data-flow="worker"] > span');
  const deliveryTitle = diagram.querySelector(".delivery strong");
  const deliveryCaption = diagram.querySelector(".delivery > span:last-child");
  let running = false;
  controls.hidden = false;

  const pause = () =>
    new Promise((resolve) => setTimeout(resolve, motionDisabled() ? 0 : 560));
  const activate = (key) => {
    nodes.forEach((node) => {
      if (node.classList.contains("flow-active"))
        node.classList.add("flow-complete");
      node.classList.toggle("flow-active", node.dataset.flow === key);
    });
  };
  const simulate = async (failure) => {
    if (running) return;
    running = true;
    buttons.forEach((button) => {
      button.disabled = true;
    });
    diagram.classList.remove("flow-failed");
    nodes.forEach((node) =>
      node.classList.remove("flow-active", "flow-complete"),
    );
    workerCaption.textContent = copy.worker;
    deliveryTitle.textContent = "Mailpit";
    deliveryCaption.textContent = copy.captured;
    status.textContent = copy.following;
    try {
      for (const step of ["api", "database", "queue", "worker"]) {
        activate(step);
        await pause();
      }
      if (failure) {
        diagram.classList.add("flow-failed");
        workerCaption.textContent = copy.retry;
        await pause();
        workerCaption.textContent = copy.exhausted;
        deliveryTitle.textContent = "DLQ";
        deliveryCaption.textContent = copy.retained;
      } else {
        workerCaption.textContent = copy.complete;
      }
      activate("delivery");
      status.textContent = failure ? copy.failed : copy.done;
      await pause();
      nodes.forEach((node) => {
        if (node.classList.contains("flow-active"))
          node.classList.add("flow-complete");
        node.classList.remove("flow-active");
      });
    } finally {
      running = false;
      buttons.forEach((button) => {
        button.disabled = false;
      });
    }
  };
  buttons.forEach((button) =>
    button.addEventListener("click", () =>
      simulate(button.dataset.simulate === "failure"),
    ),
  );

  // The diagram reacts to a mouse, while touch, keyboard and reduced-motion stay still.
  let tiltFrame;
  const resetTilt = () => {
    cancelAnimationFrame(tiltFrame);
    diagram.style.removeProperty("--tilt-x");
    diagram.style.removeProperty("--tilt-y");
  };
  diagram.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse" || motionDisabled()) return;
    cancelAnimationFrame(tiltFrame);
    tiltFrame = requestAnimationFrame(() => {
      const rect = diagram.getBoundingClientRect();
      diagram.style.setProperty(
        "--tilt-x",
        `${((event.clientX - rect.left - rect.width / 2) / rect.width) * 5}deg`,
      );
      diagram.style.setProperty(
        "--tilt-y",
        `${(-(event.clientY - rect.top - rect.height / 2) / rect.height) * 4}deg`,
      );
    });
  });
  diagram.addEventListener("pointerleave", resetTilt);
  reducedMotion.addEventListener("change", () => {
    resetTilt();
    if (reducedMotion.matches)
      document.getAnimations().forEach((animation) => animation.cancel());
  });
}

// The source is an actual excerpt. Tabs are only enabled when their behavior exists.
const tabs = [...document.querySelectorAll('.workspace-tabs [role="tab"]')];
function selectTab(tab, moveFocus = false) {
  for (const candidate of tabs) {
    const selected = candidate === tab;
    candidate.setAttribute("aria-selected", String(selected));
    candidate.tabIndex = selected ? 0 : -1;
    document.getElementById(candidate.getAttribute("aria-controls")).hidden =
      !selected;
  }
  if (moveFocus) tab.focus();
  const panel = document.getElementById(tab.getAttribute("aria-controls"));
  if (!motionDisabled())
    panel.animate(
      [
        { transform: "translateY(9px)" },
        { transform: "translateY(0)" },
      ],
      { duration: 320, easing: "cubic-bezier(.16,1,.3,1)" },
    );
}
if (tabs.length) {
  document.querySelector(".workspace-tabs").hidden = false;
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectTab(tab));
    tab.addEventListener("keydown", (event) => {
      const offsets = { ArrowRight: 1, ArrowLeft: -1 };
      if (!(event.key in offsets) && !["Home", "End"].includes(event.key))
        return;
      event.preventDefault();
      const next =
        event.key === "Home"
          ? 0
          : event.key === "End"
            ? tabs.length - 1
            : (index + offsets[event.key] + tabs.length) % tabs.length;
      selectTab(tabs[next], true);
    });
  });
}
if (!motionDisabled()) {
  const workspace = document.querySelector(".hero-art");
  workspace?.animate(
    [
      { opacity: 0, transform: "translateY(36px) scale(.97)" },
      { opacity: 1, transform: "translateY(0) scale(1)" },
    ],
    {
      duration: 1000,
      delay: 140,
      easing: "cubic-bezier(.16,1,.3,1)",
      fill: "backwards",
    },
  );
  document
    .querySelectorAll(".interactive-system .system-node")
    .forEach((node, index) => {
      node.animate(
        [
          { opacity: 0.1, transform: "translateY(9px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        {
          duration: 500,
          delay: 320 + index * 130,
          easing: "ease-out",
          fill: "backwards",
        },
      );
    });
}

const projectTabs = [
  ...document.querySelectorAll('.project-choices [role="tab"]'),
];
if (projectTabs.length) {
  document.querySelector(".project-choices").hidden = false;
  const showProject = (tab, focus = false) => {
    for (const candidate of projectTabs) {
      const selected = candidate === tab;
      candidate.setAttribute("aria-selected", String(selected));
      candidate.tabIndex = selected ? 0 : -1;
      document.getElementById(candidate.getAttribute("aria-controls")).hidden =
        !selected;
    }
    if (focus) tab.focus();
  };
  projectTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => showProject(tab));
    tab.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key))
        return;
      event.preventDefault();
      const next =
        event.key === "Home"
          ? 0
          : event.key === "End"
            ? projectTabs.length - 1
            : (index +
                (event.key === "ArrowRight" ? 1 : -1) +
                projectTabs.length) %
              projectTabs.length;
      showProject(projectTabs[next], true);
    });
  });
  showProject(projectTabs[0]);
}
