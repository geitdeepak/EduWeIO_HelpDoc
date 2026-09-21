/* Gentle hover zoom for screenshots.
   Each content image is wrapped in a link. On a device with a mouse, the image grows slightly while the pointer is over it
   (the styles are in stylesheets/extra.css). Clicking, or tapping on a phone, opens the full image in a new tab. */
(function () {
  function setup() {
    var images = document.querySelectorAll(".md-typeset figure img, .md-typeset p > img");

    images.forEach(function (img) {
      if (img.closest(".eduwe-zoom") || img.closest("a")) {
        return;
      }

      var wrap = document.createElement("a");
      wrap.className = "eduwe-zoom";
      wrap.href = img.currentSrc || img.src;
      wrap.target = "_blank";
      wrap.rel = "noopener";

      img.parentNode.insertBefore(wrap, img);
      wrap.appendChild(img);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setup);
  } else {
    setup();
  }
})();
