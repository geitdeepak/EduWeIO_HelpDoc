/* Hover zoom for screenshots.
   Each content image is wrapped in a link. On a device with a mouse, the image magnifies under the pointer
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

      // magnify around the pointer, so the part under the mouse is the part you see larger
      wrap.addEventListener("mousemove", function (event) {
        var box = wrap.getBoundingClientRect();
        var x = ((event.clientX - box.left) / box.width) * 100;
        var y = ((event.clientY - box.top) / box.height) * 100;
        img.style.transformOrigin = x + "% " + y + "%";
      });

      wrap.addEventListener("mouseleave", function () {
        img.style.transformOrigin = "50% 50%";
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setup);
  } else {
    setup();
  }
})();
