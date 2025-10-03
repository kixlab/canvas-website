window.HELP_IMPROVE_VIDEOJS = false;

var INTERP_BASE = "./static/interpolation/stacked";
var NUM_INTERP_FRAMES = 240;

var interp_images = [];
function preloadInterpolationImages() {
  for (var i = 0; i < NUM_INTERP_FRAMES; i++) {
    var path = INTERP_BASE + "/" + String(i).padStart(6, "0") + ".jpg";
    interp_images[i] = new Image();
    interp_images[i].src = path;
  }
}

function setInterpolationImage(i) {
  var image = interp_images[i];
  image.ondragstart = function () {
    return false;
  };
  image.oncontextmenu = function () {
    return false;
  };
  $("#interpolation-image-wrapper").empty().append(image);
}

$(document).ready(function () {
  $(".navbar-burger").click(function () {
    $(".navbar-burger").toggleClass("is-active");
    $(".navbar-menu").toggleClass("is-active");
  });

  var BREAKPOINT_QUERY = "(max-width: 1024px)";
  var mql = window.matchMedia(BREAKPOINT_QUERY);
  function isMobileOrTablet() {
    return mql.matches;
  }
  var currentLayout = null; // 'layout-6' | 'layout-4'
  var carouselInstance = null; // vanilla carousel instance

  function createMediaElement(tag, attrs) {
    var el = document.createElement(tag);
    for (var k in attrs) {
      if (k === "className") {
        el.className = attrs[k];
      } else if (k === "text") {
        el.textContent = attrs[k];
      } else {
        el.setAttribute(k, attrs[k]);
      }
    }
    return el;
  }

  function buildSlideGroup(gid, layout, taskType) {
    var group = document.createElement("div");
    group.className = "slide-group " + layout;

    // 1) first: image
    var imgSrc;
    if (taskType === "replication") {
      imgSrc = "./static/samples/replication/" + gid + "/" + gid + ".png";
    } else if (taskType === "attribute-update") {
      imgSrc =
        "./static/samples/modification/task-1/" +
        gid +
        "/" +
        gid +
        "-target.png";
    } else if (taskType === "component-insertion") {
      imgSrc =
        "./static/samples/modification/task-2/" +
        gid +
        "/" +
        gid +
        "-target.png";
    } else if (taskType === "mode-change") {
      imgSrc =
        "./static/samples/modification/task-3/" +
        gid +
        "/" +
        gid +
        "-target.png";
    }

    // Create image container with GT label
    var imgContainer = document.createElement("div");
    imgContainer.style.position = "relative";
    imgContainer.style.marginBottom = "10px";

    var img = createMediaElement("img", {
      src: imgSrc,
      alt: gid + " reference image",
      loading: "lazy",
    });

    // Add GT label
    var gtLabel = document.createElement("div");
    gtLabel.style.textAlign = "center";
    gtLabel.style.fontWeight = "bold";
    gtLabel.style.marginTop = "5px";
    gtLabel.style.color = "#666";
    gtLabel.textContent = taskType === "replication" ? "GT" : "Target (GT)";

    // Function to update GT label font size
    function updateGTLabelFontSize() {
      var fontSize = "12px"; // mobile default
      if (window.innerWidth >= 768) {
        fontSize = "15px"; // tablet and desktop
      }
      gtLabel.style.fontSize = fontSize;
    }

    // Set initial font size
    updateGTLabelFontSize();

    // Update font size on resize
    window.addEventListener("resize", updateGTLabelFontSize);

    imgContainer.appendChild(img);
    imgContainer.appendChild(gtLabel);
    group.appendChild(imgContainer);

    // Desktop videos order (5 videos): gpt4.1, gpt4o, gemini2.5pro, gemini2.5flash, claude3.5sonnet
    var desktopModels = [
      "gpt-4.1",
      "gpt-4o",
      "gemini-2.5-pro",
      "gemini-2.5-flash",
      "claude-3-5-sonnet",
    ];
    // Mobile/Tablet videos order (3 videos): gpt4.1, gemini2.5pro, claude3.5sonnet
    var mobileModels = ["gpt-4.1", "gemini-2.5-pro", "claude-3-5-sonnet"];

    var models = layout === "layout-6" ? desktopModels : mobileModels;
    for (var i = 0; i < models.length; i++) {
      var model = models[i];
      var videoSrc;
      if (taskType === "replication") {
        videoSrc =
          "./static/samples/replication/" +
          gid +
          "/replication_" +
          model +
          "_" +
          gid +
          ".mp4";
      } else if (taskType === "attribute-update") {
        videoSrc =
          "./static/samples/modification/task-1/" +
          gid +
          "/modification_" +
          model +
          "_" +
          gid +
          ".mp4";
      } else if (taskType === "component-insertion") {
        videoSrc =
          "./static/samples/modification/task-2/" +
          gid +
          "/modification_" +
          model +
          "_" +
          gid +
          ".mp4";
      } else if (taskType === "mode-change") {
        videoSrc =
          "./static/samples/modification/task-3/" +
          gid +
          "/modification_" +
          model +
          "_" +
          gid +
          ".mp4";
      }

      // Create video container with label
      var videoContainer = document.createElement("div");
      videoContainer.style.position = "relative";
      videoContainer.style.marginBottom = "14px";

      var video = createMediaElement("video", {
        src: videoSrc,
        autoplay: "",
        muted: "",
        playsinline: "",
        preload: "metadata",
      });
      // Explicitly set a source node with type for better browser compatibility
      try {
        var source = document.createElement("source");
        source.setAttribute("src", videoSrc);
        source.setAttribute("type", "video/mp4");
        video.appendChild(source);
      } catch (e) {}
      // Explicitly attempt to play on load
      video.addEventListener("canplay", function () {
        var v = this;
        try {
          v.muted = true;
          var playPromise = v.play();
          if (playPromise && typeof playPromise.catch === "function") {
            playPromise.catch(function (e) {});
          }
        } catch (e) {}
      });

      // Also try to play when loadeddata event fires
      video.addEventListener("loadeddata", function () {
        var v = this;
        try {
          v.muted = true;
          var playPromise = v.play();
          if (playPromise && typeof playPromise.catch === "function") {
            playPromise.catch(function (e) {});
          }
        } catch (e) {}
      });

      // Add model label
      var label = document.createElement("div");
      label.style.textAlign = "center";
      label.style.fontWeight = "bold";
      label.style.marginTop = "5px";
      label.style.color = "#666";
      label.textContent = model;

      // Function to update model label font size
      function updateModelLabelFontSize() {
        var fontSize = "12px"; // mobile default
        if (window.innerWidth >= 768) {
          fontSize = "15px"; // tablet and desktop
        }
        label.style.fontSize = fontSize;
      }

      // Set initial font size
      updateModelLabelFontSize();

      // Update font size on resize
      window.addEventListener("resize", updateModelLabelFontSize);

      videoContainer.appendChild(video);
      videoContainer.appendChild(label);
      group.appendChild(videoContainer);
    }

    return group;
  }

  function detachCarousel(taskType) {
    // Find the correct carousel container based on task type
    var container;
    if (taskType === "replication") {
      container = document.getElementById("results-carousel");
    } else {
      container = document.getElementById(taskType + "-results-carousel");
    }

    if (!container) return;
    try {
      if (carouselInstance && carouselInstance.destroy)
        carouselInstance.destroy();
    } catch (e) {}
    carouselInstance = null;
    container.innerHTML = "";

    // Remove existing pagination and navigation buttons
    var wrapper = container.parentNode;
    if (wrapper) {
      var existingPagination = wrapper.querySelector(".carousel-pagination");
      if (existingPagination) {
        existingPagination.remove();
      }
    }

    // Remove navigation buttons from hero-body
    var heroBody = container.closest(".hero-body");
    if (heroBody) {
      var existingNavButtons = heroBody.querySelectorAll(".carousel-nav");
      existingNavButtons.forEach(function (btn) {
        btn.remove();
      });
    }
  }

  function attachCarousel(taskType) {
    // Find the correct carousel container based on task type
    var container;
    if (taskType === "replication") {
      container = document.getElementById("results-carousel");
    } else {
      container = document.getElementById(taskType + "-results-carousel");
    }

    if (!container) {
      return;
    }

    // Clear existing content
    container.innerHTML = "";

    // Add slides based on task type
    var gids = [];
    if (taskType === "replication") {
      gids = [
        "gid1-22",
        "gid6-27",
        "gid11-16",
        "gid20-88",
        "gid29-36",
        "gid68-81",
        "gid74-18",
      ];
    } else if (taskType === "attribute-update") {
      gids = [
        "color_adjustment-gid1",
        "corner_radius_change-gid61",
        "position_adjustment-gid81",
        "size_adjustment-gid21",
        "text_content_change-gid41",
      ];
    } else if (taskType === "component-insertion") {
      gids = ["gid1", "gid15", "gid28"];
    } else if (taskType === "mode-change") {
      gids = ["gid10-1", "gid12-3", "gid23-7"];
    }

    // Create slide groups
    var layout = isMobileOrTablet() ? "layout-4" : "layout-6";
    gids.forEach(function (gid) {
      var slideGroup = buildSlideGroup(gid, layout, taskType);
      container.appendChild(slideGroup);
    });

    // Build track wrapper
    var items = Array.prototype.slice.call(container.children);
    var track = document.createElement("div");
    track.className = "vanilla-carousel-track";
    // minimal inline styles to avoid CSS dependency
    container.style.overflow = "hidden";
    container.style.position = "relative";
    track.style.display = "flex";
    track.style.willChange = "transform";
    track.style.transition = "transform 400ms ease";

    // move items into track and set item basis
    items.forEach(function (item) {
      item.style.flex = "0 0 100%";
      item.style.maxWidth = "100%";
      track.appendChild(item);
    });
    container.appendChild(track);

    var state = {
      container: container,
      track: track,
      get length() {
        return track.children.length;
      },
      index: 0,
      width: container.clientWidth,
      loop: true,
      autoTimer: null,
      goTo: function (nextIndex) {
        if (this.length === 0) return;
        if (this.loop) {
          this.index = (nextIndex + this.length) % this.length;
        } else {
          this.index = Math.max(0, Math.min(nextIndex, this.length - 1));
        }
        var offset = -this.index * this.width;
        this.track.style.transform = "translate3d(" + offset + "px,0,0)";
        
        var currentSlide = this.track.children[this.index];
        if (currentSlide) {
          var videos = currentSlide.querySelectorAll("video");
          videos.forEach(function (video) {
            try {
              video.currentTime = 0;
              video.muted = true;
              video.play().catch(function (e) {});
            } catch (e) {}
          });
        }
        
        autoPlayVisibleVideos();
      },
      next: function () {
        this.goTo(this.index + 1);
      },
      prev: function () {
        this.goTo(this.index - 1);
      },
      refresh: function () {
        this.width = this.container.clientWidth;
        // ensure each child uses 100% width of container
        for (var i = 0; i < this.track.children.length; i++) {
          this.track.children[i].style.width = this.width + "px";
        }
        this.goTo(this.index);
      },
      destroy: function () {
        if (this.autoTimer) {
          clearInterval(this.autoTimer);
          this.autoTimer = null;
        }
        // unwrap items back to container root
        var children = Array.prototype.slice.call(this.track.children);
        children.forEach(function (child) {
          container.appendChild(child);
        });
        if (this.track.parentNode)
          this.track.parentNode.removeChild(this.track);
        container.style.overflow = "";
        container.style.position = "";
      },
    };

    // simple auto advance every 6s
    // state.autoTimer = setInterval(function(){ state.next(); }, 6000);

    carouselInstance = state;
    // initial layout
    state.refresh();

    // Remove CSS variable to allow natural sizing for all viewports
    var wrapper = container.parentNode;
    wrapper.style.removeProperty("--container-width");

    // Also update on resize
    function updateContainerWidth() {
      // Remove CSS variable to allow natural sizing
      wrapper.style.removeProperty("--container-width");
    }

    // Update width when carousel refreshes
    var originalRefresh = state.refresh;
    state.refresh = function () {
      originalRefresh.call(this);
      updateContainerWidth();
    };

    // Add navigation buttons to hero-body
    var heroBody = container.closest(".hero-body");
    if (heroBody) {
      var prevButton = createMediaElement("button", {
        className: "carousel-nav prev",
        "aria-label": "Previous slide",
      });
      prevButton.innerHTML = "&#10094;";
      var nextButton = createMediaElement("button", {
        className: "carousel-nav next",
        "aria-label": "Next slide",
      });
      nextButton.innerHTML = "&#10095;";

      heroBody.appendChild(prevButton);
      heroBody.appendChild(nextButton);
    }

    prevButton.addEventListener("click", function () {
      state.prev();
    });
    nextButton.addEventListener("click", function () {
      state.next();
    });

    // Pagination
    var paginationContainer = createMediaElement("div", {
      className: "carousel-pagination",
    });
    var dots = [];

    for (var i = 0; i < state.length; i++) {
      var dot = createMediaElement("button", {
        className: "carousel-dot",
        "data-index": i,
        "aria-label": "Go to slide " + (i + 1),
      });
      paginationContainer.appendChild(dot);
      dots.push(dot);
      dot.addEventListener("click", function () {
        var dotIndex = parseInt(this.getAttribute("data-index"), 10);
        state.goTo(dotIndex);
      });
    }
    container.parentNode.appendChild(paginationContainer);

    function updatePagination() {
      dots.forEach(function (dot, index) {
        if (index === state.index) {
          dot.classList.add("active");
        } else {
          dot.classList.remove("active");
        }
      });
    }

    var originalGoTo = state.goTo;
    state.goTo = function (nextIndex) {
      originalGoTo.call(this, nextIndex);
      updatePagination();
    };

    updatePagination();

    // allow keyboard navigation
    container.setAttribute("tabindex", "0");
    container.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") {
        state.next();
      } else if (e.key === "ArrowLeft") {
        state.prev();
      }
    });

    // Ensure autoplay for initial slide videos
    setTimeout(function () {
      autoPlayVisibleVideos();
      // Force play videos in the first slide
      var firstSlide = container.querySelector(".item");
      if (firstSlide) {
        var videos = firstSlide.querySelectorAll("video");
        videos.forEach(function (video) {
          try {
            video.muted = true;
            video.play().catch(function (e) {});
          } catch (e) {}
        });
      }
    }, 100);

    // Additional autoplay attempts with longer delays
    setTimeout(function () {
      autoPlayVisibleVideos();
    }, 1000);

    setTimeout(function () {
      autoPlayVisibleVideos();
    }, 2000);
  }

  function rebuildResultsCarousel(force, taskType) {
    // Find the correct carousel container based on task type
    var container;
    if (taskType === "replication") {
      container = document.getElementById("results-carousel");
    } else {
      container = document.getElementById(taskType + "-results-carousel");
    }

    if (!container) {
      return;
    }

    var nextLayout = isMobileOrTablet() ? "layout-4" : "layout-6";

    // Force rebuild if layout type has changed
    var layoutChanged = currentLayout !== nextLayout;

    // Only skip rebuild if layout hasn't changed and not forced
    if (!force && !layoutChanged && container.children.length > 0) {
      return; // nothing to do
    }

    detachCarousel(taskType);
    // Keep layout width for measurements, avoid visibility:hidden which yields 0 width
    var prevOpacity = container.style.opacity;
    container.style.opacity = "0";

    // Use taskType to determine gids
    var gids = [];
    if (taskType === "replication") {
      gids = [
        "gid1-22",
        "gid6-27",
        "gid11-16",
        "gid20-88",
        "gid29-36",
        "gid68-81",
        "gid74-18",
      ];
    } else if (taskType === "attribute-update") {
      gids = [
        "color_adjustment-gid1",
        "corner_radius_change-gid61",
        "position_adjustment-gid81",
        "size_adjustment-gid21",
        "text_content_change-gid41",
      ];
    } else if (taskType === "component-insertion") {
      gids = ["gid1", "gid15", "gid28"];
    } else if (taskType === "mode-change") {
      gids = ["gid10-1", "gid12-3", "gid23-7"];
    }

    var layout = nextLayout;

    for (var g = 0; g < gids.length; g++) {
      var gid = gids[g];
      var item = document.createElement("div");
      item.className = "item";
      var group = buildSlideGroup(gid, layout, taskType);
      item.appendChild(group);
      container.appendChild(item);
    }

    attachCarousel(taskType);

    // Show after initialization
    container.style.opacity = prevOpacity || "";
    currentLayout = nextLayout;
  }

  function autoPlayVisibleVideos() {
    // Find the currently visible carousel container
    var visibleCarousel = document.querySelector(
      '.task-carousel[style*="block"], .task-carousel:not([style*="none"])',
    );
    if (!visibleCarousel) {
      visibleCarousel = document.getElementById("results-carousel");
    }

    var container = visibleCarousel
      ? visibleCarousel.querySelector(".carousel")
      : document.getElementById("results-carousel");
    if (!container) return;
    var items = container.querySelectorAll(".item");
    for (var i = 0; i < items.length; i++) {
      var isActive = carouselInstance && i === carouselInstance.index;
      var vids = items[i].querySelectorAll("video");
      vids.forEach(function (v) {
        try {
          v.muted = true;
          if (isActive) {
            v.play().catch(function (e) {});
          } else {
            v.pause();
          }
        } catch (e) {}
      });
    }
  }

  rebuildResultsCarousel(true, "replication");

  // Additional autoplay triggers for initial load
  setTimeout(function () {
    autoPlayVisibleVideos();
  }, 500);

  setTimeout(function () {
    autoPlayVisibleVideos();
  }, 1500);

  setTimeout(function () {
    autoPlayVisibleVideos();
  }, 3000);
  // Debounced rebuild only when breakpoint actually changes
  var lastIsMobile = isMobileOrTablet();
  window.addEventListener("resize", function () {
    if (window.__rebuildTimeout) clearTimeout(window.__rebuildTimeout);
    window.__rebuildTimeout = setTimeout(function () {
      var isMobileNow = isMobileOrTablet();
      var shouldRebuild = false;

      // Check if layout should change
      var currentLayoutType = lastIsMobile ? "layout-4" : "layout-6";
      var newLayoutType = isMobileNow ? "layout-4" : "layout-6";

      if (currentLayoutType !== newLayoutType) {
        shouldRebuild = true;
      }

      if (shouldRebuild) {
        lastIsMobile = isMobileNow;
        rebuildResultsCarousel(true);
      } else if (carouselInstance && carouselInstance.refresh) {
        carouselInstance.refresh();
        // Remove CSS variable to allow natural sizing
        var container = document.getElementById("results-carousel");
        if (container && container.parentNode) {
          var wrapper = container.parentNode;
          wrapper.style.removeProperty("--container-width");
        }
      }
    }, 150);
  });
  // Rebuild on media query change/orientation change explicitly
  if (mql && mql.addEventListener) {
    mql.addEventListener("change", function () {
      lastIsMobile = isMobileOrTablet();
      rebuildResultsCarousel(true);
    });
  } else if (mql && mql.addListener) {
    // Safari fallback
    mql.addListener(function () {
      lastIsMobile = isMobileOrTablet();
      rebuildResultsCarousel(true);
    });
  }
  window.addEventListener("orientationchange", function () {
    if (window.__rebuildTimeout) clearTimeout(window.__rebuildTimeout);
    window.__rebuildTimeout = setTimeout(function () {
      rebuildResultsCarousel(true);
    }, 200);
  });

  // Only initialize slider if elements exist
  if (document.querySelector("#interpolation-slider")) {
    preloadInterpolationImages();

    $("#interpolation-slider").on("input", function (event) {
      setInterpolationImage(this.value);
    });
    setInterpolationImage(0);
    $("#interpolation-slider").prop("max", NUM_INTERP_FRAMES - 1);

    // No external slider library; rely on native range input
  }

  // Task button switching logic
  function switchTaskCarousel(taskType) {
    // Hide all carousels
    document.querySelectorAll(".task-carousel").forEach(function (carousel) {
      carousel.style.display = "none";
    });

    // Show selected carousel
    var selectedCarousel = document.getElementById(taskType + "-carousel");
    if (selectedCarousel) {
      selectedCarousel.style.display = "block";
    }

    // Update button states
    document.querySelectorAll(".task-button").forEach(function (button) {
      button.classList.remove("is-primary");
    });

    var activeButton = document.querySelector('[data-task="' + taskType + '"]');
    if (activeButton) {
      activeButton.classList.add("is-primary");
    }

    // Rebuild carousel for the selected task type
    rebuildResultsCarousel(true, taskType);
  }

  // Add event listeners to task buttons
  document.querySelectorAll(".task-button").forEach(function (button) {
    button.addEventListener("click", function () {
      var taskType = this.getAttribute("data-task");
      switchTaskCarousel(taskType);
    });
  });

  function replayAllVideos(taskType) {
    var visibleCarousel = document.querySelector(
      '.task-carousel[style*="block"], .task-carousel:not([style*="none"])',
    );
    if (!visibleCarousel) {
      visibleCarousel = document.getElementById("results-carousel");
    }

    var container = visibleCarousel
      ? visibleCarousel.querySelector(".carousel")
      : document.getElementById("results-carousel");
    if (!container) return;

    var videos = container.querySelectorAll("video");

    if (videos.length === 0) {
      var slideGroups = container.querySelectorAll(".slide-group");
      for (var i = 0; i < slideGroups.length; i++) {
        var groupVideos = slideGroups[i].querySelectorAll("video");
        videos = groupVideos;
        break;
      }
    }

    if (videos.length === 0) return;

    videos.forEach(function (video) {
      try {
        video.currentTime = 0;
        video.muted = true;
        video.play().catch(function (e) {});
      } catch (e) {}
    });
  }

  function addReplayButtonListeners() {
    var replayButton = document.getElementById("replay-replication");

    if (replayButton) {
      replayButton.addEventListener("click", function () {
        var visibleCarousel = document.querySelector(
          '.task-carousel[style*="block"], .task-carousel:not([style*="none"])',
        );
        if (visibleCarousel) {
          var taskType = visibleCarousel.id.replace("-carousel", "");
          replayAllVideos(taskType);
        }
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", addReplayButtonListeners);
  } else {
    addReplayButtonListeners();
  }
});
