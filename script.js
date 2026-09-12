// ---------- Footer year ----------
document.getElementById("year").textContent = new Date().getFullYear();

// ---------- Tabs (RefRemote iterations) ----------
document.querySelectorAll(".tabs").forEach((tabGroup) => {
  const tabs = tabGroup.querySelectorAll(".tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");

      const targetId = tab.dataset.target;
      const panels = tabGroup.parentElement.querySelectorAll(".tab-panel");
      panels.forEach((p) => p.classList.toggle("active", p.id === targetId));
    });
  });
});

// ---------- Missing-media placeholders ----------
// Any <img class="media-img"> or <video class="media-video"> whose source
// file doesn't exist gets swapped for a labeled placeholder box, so it's
// obvious what to add and where it belongs.

function buildPlaceholder(kind, label, src, wide) {
  const icons = { photo: "📷", schematic: "🗺", render: "🧩", video: "▶" };
  const box = document.createElement("div");
  box.className = "media-placeholder";
  box.innerHTML = `
    <div class="ph-icon">${icons[kind] || "🖼"}</div>
    <div class="ph-label">${label}</div>
    <div class="ph-path">${src}</div>
  `;
  return box;
}

// Because script.js runs at the end of <body>, a locally-served 404 can
// fail (and fire its "error" event) before we ever attach a listener for
// it. So for images we also do a synchronous check: a failed <img> is left
// with complete === true and naturalWidth === 0, which we can detect
// immediately without waiting on an event.
document.querySelectorAll("img.media-img").forEach((img) => {
  const swap = () => {
    const label = img.dataset.label || "Image";
    const kind = img.dataset.kind || "photo";
    const placeholder = buildPlaceholder(kind, label, img.getAttribute("src"));
    img.replaceWith(placeholder);
  };
  if (img.complete && img.naturalWidth === 0) {
    swap();
  } else {
    img.addEventListener("error", swap, { once: true });
  }
});

// Videos don't expose as clean a synchronous "already failed" flag, so we
// attach the listener up front AND re-check shortly after in case the
// error already landed before this ran.
document.querySelectorAll("video.media-video").forEach((video) => {
  const source = video.querySelector("source");
  let swapped = false;

  function handleVideoError() {
    if (swapped) return;
    swapped = true;
    const label = video.dataset.label || "Video";
    const wide = video.closest(".media-item-wide") !== null;
    const src = source ? source.getAttribute("src") : "";
    const placeholder = buildPlaceholder("video", label, src, wide);
    video.replaceWith(placeholder);
  }

  video.addEventListener("error", handleVideoError, true);
  if (source) source.addEventListener("error", handleVideoError, true);

  setTimeout(() => {
    if (video.error || video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) {
      handleVideoError();
    }
  }, 300);
});

// ---------- Lightbox for photos / schematics / renders ----------
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxClose = document.getElementById("lightbox-close");

function openLightbox(src, alt) {
  lightboxImg.src = src;
  lightboxImg.alt = alt || "";
  lightbox.hidden = false;
}

function closeLightbox() {
  lightbox.hidden = true;
  lightboxImg.src = "";
}

document.addEventListener("click", (e) => {
  const img = e.target.closest("img.media-img");
  if (img && img.complete && img.naturalWidth > 0) {
    openLightbox(img.src, img.alt);
  }
});

lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !lightbox.hidden) closeLightbox();
});
