/* global $ */

import _ from "lodash";
import { TweenMax, TimelineMax } from "gsap/all";

const steps = [];

const windowElement = $(window);
const documentElement = $(document);

const dimensions = {
  width: windowElement.width(),
  height: windowElement.height()
};

const NAVBAR_HEIGHT = 96;

function progressReverse(timeline, props) {
  if (timeline.progressing === "reversing") return;

  // eslint-disable-next-line no-param-reassign
  timeline.progressing = "reversing";

  TweenMax.killTweensOf(timeline, { progress: true });

  TweenMax.to(timeline, timeline.progress() * timeline.totalDuration(), {
    progress: 0,
    ...props
  });
}

function progressPlay(timeline, props) {
  if (timeline.progressing === "playing") return;

  // eslint-disable-next-line no-param-reassign
  timeline.progressing = "playing";

  TweenMax.killTweensOf(timeline, { progress: true });

  TweenMax.to(timeline, (1 - timeline.progress()) * timeline.totalDuration(), {
    progress: 1,
    ...props
  });
}

// Update dimensions
steps.push(() => {
  function updateDimensions() {
    dimensions.width = windowElement.width();
    dimensions.height = windowElement.height();
  }

  updateDimensions();

  windowElement.on("resize", updateDimensions);
});

// Navbar
steps.push(() => {
  const navTransitionTimeline = new TimelineMax({
    paused: true,
    ease: "none"
  });

  navTransitionTimeline.to($(".nav-bg"), 0.2, { opacity: 1 }, 0.2);
  navTransitionTimeline.to($(".nav"), 0.4, { y: -32 }, 0);
  navTransitionTimeline.to(
    $(".nav-logo-icon"),
    0.4,
    { scale: 0.72, transformOrigin: "left" },
    0
  );
  navTransitionTimeline.to(
    $(".nav-logo-mark"),
    0.4,
    { scale: 0.88, transformOrigin: "left", x: -12 },
    0
  );
  navTransitionTimeline.to($(".nav-items"), 0.4, { x: -32, scale: 0.95 }, 0);
  navTransitionTimeline.to(
    $(".nav-rsvp-button"),
    0.4,
    { scale: 0.95, transformOrigin: "right" },
    0
  );

  documentElement.on(
    "scroll",
    _.throttle(() => {
      const progressDistance = 0.5 * dimensions.height;
      const navProgress = Math.max(
        0,
        Math.min(
          1,
          (documentElement.scrollTop() -
            (dimensions.height * 1 - NAVBAR_HEIGHT) +
            progressDistance) /
            progressDistance
        )
      );
      console.log(
        navProgress,
        documentElement.scrollTop() -
          (dimensions.height * 2 - NAVBAR_HEIGHT) +
          progressDistance,
        progressDistance
      );

      if (navProgress !== navTransitionTimeline.progress()) {
        TweenMax.killTweensOf(navTransitionTimeline, { progress: true });

        TweenMax.to(navTransitionTimeline, 0.2, {
          progress: navProgress,
          ease: "Power2.easeOut"
        });
      }
    }, 16)
  );
  console.log($(".nav"));
});

steps.forEach(step => step());
