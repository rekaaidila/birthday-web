

/* =====================================
   1. NAVIGASI PILIHAN LAGU
===================================== */

document.querySelectorAll(".song-card").forEach((card) => {
  card.addEventListener("click", () => {
    const selectedSong = card.dataset.song;
    if (!selectedSong) return;

    sessionStorage.setItem("selectedSong", selectedSong);
    window.location.href = "./birthday.html";
  });
});


/* =====================================
   2. DAFTAR LAGU YOUTUBE
===================================== */

const songVideos = {
  beijing: {
    title: "For Those of Us Who Try to Keep Remembering — Beijing Connection",
    videoId: "5xKQJ2wPv7Y"
  },
  you: {
    title: "Photograph: The Trees & You — COLORCODE",
    videoId: "MlY4urRBJms"
  },
  night: {
    title: "another night awake with you on your mind — eleventwelfth",
    videoId: "9KuLFSbVPew"
  },
  cats: {
    title: "Voyager — Xdinary Heroes",
    videoId: "Tf0-4tzskLA"
  }
};


/* =====================================
   3. ELEMEN HALAMAN BIRTHDAY
===================================== */

const startScreen = document.getElementById("start-screen");
const playButton = document.getElementById("play-button");
const playMessage = document.querySelector(".start-hint");

const songTitle = document.getElementById("song-title");
const youtubePlayer = document.getElementById("youtube-player");

const confettis = document.querySelectorAll(
  ".birthday-effects img.effect-gif, " +
  ".birthday-effects img.effect-gif2"
);

const balloonContainer = document.querySelector(".balloon-container");
const balloons = [...document.querySelectorAll(".balloon")];


/* =====================================
   4. ANIMASI BALON
===================================== */

let balloonAnimationStarted = false;
let balloonAnimationFrame = null;

if (balloonContainer && balloons.length) {
  const balloonWidth = 100;
  const landingY = -3;

  const states = balloons.map((el, i) => ({
    el,
    x: Math.max(
      0,
      Math.min(
        window.innerWidth - balloonWidth,
        window.innerWidth * (0.08 + i * 0.19)
      )
    ),
    y: window.innerHeight + 50 + i * 80,
    vx: 0,
    radius: balloonWidth / 2,
    floatSpeed: 5 + Math.random() * 2,
    reachedTop: false
  }));

  const mouse = {
    x: -1000,
    y: -1000,
    active: false
  };

  balloons.forEach((balloon) => {
    balloon.style.position = "absolute";
    balloon.style.left = "0";
    balloon.style.top = "0";
    balloon.style.width = `${balloonWidth}px`;
    balloon.style.height = "auto";
    balloon.style.pointerEvents = "auto";
  });

  window.addEventListener("pointermove", (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
    mouse.active = true;
  });

  window.addEventListener("blur", () => {
    mouse.active = false;
  });

  window.addEventListener("pointerout", (event) => {
    if (!event.relatedTarget) mouse.active = false;
  });

  function animateBalloons() {
    const width = window.innerWidth;

    states.forEach((b) => {
      if (!b.reachedTop) {
        b.y -= b.floatSpeed;

        if (b.y <= landingY) {
          b.y = landingY;
          b.reachedTop = true;
        }
        return;
      }

      if (mouse.active) {
        const centerX = b.x + b.radius;
        const centerY = b.y + b.radius;
        const dx = centerX - mouse.x;
        const dy = centerY - mouse.y;
        const distance = Math.hypot(dx, dy);

        if (distance < 100 && distance > 0) {
          const force = (100 - distance) * 0.12;
          b.vx += (dx / distance) * force;
        }
      }

      b.x += b.vx;
      b.vx *= 0.97;
      b.y = landingY;

      if (b.x < 0) {
        b.x = 0;
        b.vx = Math.abs(b.vx) * 0.75;
      }

      if (b.x + balloonWidth > width) {
        b.x = width - balloonWidth;
        b.vx = -Math.abs(b.vx) * 0.75;
      }
    });

    // Tabrakan sederhana antarbalon.
    for (let i = 0; i < states.length; i++) {
      for (let j = i + 1; j < states.length; j++) {
        const a = states[i];
        const b = states[j];

        if (!a.reachedTop || !b.reachedTop) continue;

        const dx = (b.x + b.radius) - (a.x + a.radius);
        const distance = Math.abs(dx);
        const minDistance = a.radius + b.radius;

        if (distance < minDistance) {
          const direction = dx >= 0 ? 1 : -1;
          const overlap = minDistance - distance;

          a.x -= direction * overlap * 0.5;
          b.x += direction * overlap * 0.5;

          a.vx -= direction * 1.5;
          b.vx += direction * 1.5;

          a.x = Math.max(0, Math.min(width - balloonWidth, a.x));
          b.x = Math.max(0, Math.min(width - balloonWidth, b.x));
        }
      }
    }

    states.forEach((b) => {
      b.el.style.transform = `translate(${b.x}px, ${b.y}px)`;
    });

    balloonAnimationFrame = requestAnimationFrame(animateBalloons);
  }

  window.startBalloonAnimation = () => {
    if (balloonAnimationStarted) return;
    balloonAnimationStarted = true;
    animateBalloons();
  };
}





/* =====================================
   5. MULAI KEJUTAN ULANG TAHUN
===================================== */

let birthdayStarted = false;

// Volume lagu YouTube: 0–100.
const BIRTHDAY_SONG_VOLUME = 13;

// Elemen lilin dan crown sesuai HTML/CSS.
function getBirthdayCandle() {
  return document.querySelector(".birthday-first .candle");
}

function getBirthdayCrown() {
  return document.querySelector(".birthday-frame .crown");
}

function setBirthdaySongVolume() {
  const iframe = youtubePlayer?.querySelector("iframe");
  if (!iframe?.contentWindow) return;

  iframe.contentWindow.postMessage(
    JSON.stringify({
      event: "command",
      func: "setVolume",
      args: [BIRTHDAY_SONG_VOLUME]
    }),
    "https://www.youtube.com"
  );
}

function startBirthdaySurprise() {
  if (!startScreen || !playButton || birthdayStarted) return;

  birthdayStarted = true;
  sessionStorage.setItem("birthdayStarted", "true");
  playButton.disabled = true;

  startScreen.classList.add("hide");

  const selectedSong = sessionStorage.getItem("selectedSong");
  const currentSong = songVideos[selectedSong];

  /* =====================================
     MUSIK YOUTUBE
  ===================================== */

  if (currentSong && songTitle && youtubePlayer) {
    songTitle.textContent = currentSong.title;

    const iframe = document.createElement("iframe");

    iframe.src =
      `https://www.youtube.com/embed/${currentSong.videoId}` +
      `?autoplay=1` +
      `&loop=1` +
      `&playlist=${currentSong.videoId}` +
      `&enablejsapi=1` +
      `&origin=${encodeURIComponent(window.location.origin)}`;

    iframe.title = currentSong.title;
    iframe.allow =
      "autoplay; encrypted-media; picture-in-picture; fullscreen";
    iframe.allowFullscreen = true;

    youtubePlayer.replaceChildren(iframe);

    [500, 1000, 2000, 3500].forEach((delay) => {
      window.setTimeout(setBirthdaySongVolume, delay);
    });
  } else if (songTitle) {
    songTitle.textContent = "Belum ada lagu yang dipilih 🎵";
  }

  /* =====================================
     AMBIL ELEMEN ANIMASI
  ===================================== */

  const candle = getBirthdayCandle();
  const crown = getBirthdayCrown();

  if (!candle) {
    console.warn(
      'Lilin tidak ditemukan. Periksa selector ".birthday-first .candle".'
    );
  }

  if (!crown) {
    console.warn(
      'Crown tidak ditemukan. Periksa selector ".birthday-frame .crown".'
    );
  }

  /* =====================================
     RESET ANIMASI LILIN DAN CROWN
  ===================================== */

  if (candle) {
    candle.classList.remove("show");
    candle.style.animation = "none";
    candle.style.opacity = "0";
    candle.style.visibility = "hidden";

    // Memaksa browser menerapkan kondisi awal.
    void candle.offsetWidth;

    candle.style.removeProperty("animation");
    candle.style.removeProperty("opacity");
    candle.style.removeProperty("visibility");
  }

  if (crown) {
    crown.classList.remove("show");
    crown.style.animation = "none";
    crown.style.opacity = "0";
    crown.style.visibility = "hidden";

    void crown.offsetWidth;

    crown.style.removeProperty("animation");
    crown.style.removeProperty("opacity");
    crown.style.removeProperty("visibility");
  }

  /* =====================================
     CONFETTI
  ===================================== */

  confettis.forEach((confetti) => {
    confetti.classList.add("show");

    window.setTimeout(() => {
      confetti.classList.remove("show");
    }, 4000);
  });

  /* =====================================
     BALON FLOATING
  ===================================== */

  if (window.startBalloonAnimation) {
    window.startBalloonAnimation();
  }

  /* =====================================
     LILIN TURUN
     Mulai 1,2 detik setelah Play.
  ===================================== */

  window.setTimeout(() => {
    if (!candle) return;

    candle.classList.add("show");
  }, 1200);

  /* =====================================
     CROWN MUNCUL
     Lilin mulai pada 1,2 detik dan animasinya
     berlangsung 1,5 detik.
  ===================================== */

  window.setTimeout(() => {
    if (!crown) return;

    crown.classList.add("show");
  }, 2800);

  /* =====================================
     HILANGKAN START SCREEN
  ===================================== */

  window.setTimeout(() => {
    if (startScreen) {
      startScreen.style.display = "none";
    }
  }, 500);
}

if (playButton) {
  playButton.addEventListener("click", startBirthdaySurprise);
}


















/* =====================================
   ANIMASI SCROLL DAN FOTO MUSEUM
===================================== */

(function () {
  function initScrollAnimations() {
    const revealElements = document.querySelectorAll(".scroll-reveal");
    const museumItems = document.querySelectorAll(
      "#section-2 .museum-item"
    );

    if (!("IntersectionObserver" in window)) {
      revealElements.forEach((el) => el.classList.add("is-visible"));
      museumItems.forEach((el) => el.classList.add("photo-visible"));
      return;
    }

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle(
            "is-visible",
            entry.isIntersecting
          );
        });
      },
      { threshold: 0.01 }
    );

    revealElements.forEach((el) => revealObserver.observe(el));

    const museumObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle(
            "photo-visible",
            entry.isIntersecting
          );
        });
      },
      { threshold: 0.01 }
    );

    museumItems.forEach((el) => museumObserver.observe(el));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initScrollAnimations, {
      once: true
    });
  } else {
    initScrollAnimations();
  }
})();




/* =====================================
   FADE ANTAR-SECTION SAAT SCROLL
===================================== */

(function () {
  function initSectionFade() {
    const sections = document.querySelectorAll(".birthday-page section");

    if (!sections.length) return;

    if (!("IntersectionObserver" in window)) {
      sections.forEach((section) =>
        section.classList.add("section-active")
      );
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("section-active");
          } else {
            entry.target.classList.remove("section-active");
          }
        });
      },
      {
        threshold: 0.15
      }
    );

    sections.forEach((section) => observer.observe(section));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSectionFade, {
      once: true
    });
  } else {
    initSectionFade();
  }
})();










/* =====================================
   6. LIGHTBOX MUSEUM
===================================== */

document.addEventListener("DOMContentLoaded", () => {
  const lightbox = document.getElementById("photo-lightbox");
  const lightboxImage = document.getElementById("lightbox-image");
  const lightboxFrame = document.getElementById("lightbox-frame-overlay");
  const lightboxDescription = document.getElementById("lightbox-description");
  const closeButton = document.querySelector(".lightbox-close");

  if (
    !lightbox ||
    !lightboxImage ||
    !lightboxFrame ||
    !lightboxDescription ||
    !closeButton
  ) {
    return;
  }

  const zoomClasses = [
    "zoom-frame7",
    "zoom-frame5",
    "zoom-frame7-z4",
    "zoom-frame7-z16",
    "zoom-frame5-z5"
  ];

  document.querySelectorAll("#section-2 .museum-item").forEach((item) => {
    const photo = item.querySelector(".photo-inside-frame");
    const frame = item.querySelector(".frame-overlay");

    if (!photo || !frame) return;

    photo.style.cursor = "zoom-in";

    photo.addEventListener("click", () => {
      lightboxImage.src = photo.src;
      lightboxImage.alt = photo.alt || "Selected memory";

      lightboxFrame.src = frame.src;
      lightboxFrame.alt = "";

      lightboxDescription.textContent =
        item.dataset.description || "";

      // Reset kelas sebelum menerapkan bentuk dan zoom foto.
      lightboxImage.className = "lightbox-photo";

      if (item.classList.contains("oval")) {
        lightboxImage.classList.add("lightbox-photo-oval");
      } else if (item.classList.contains("square")) {
        lightboxImage.classList.add("lightbox-photo-square");
      }

      zoomClasses.forEach((className) => {
        if (item.classList.contains(className)) {
          lightboxImage.classList.add(className);
        }
      });

      lightbox.classList.add("active");
      document.body.classList.add("lightbox-open");
    });
  });

  function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.classList.remove("lightbox-open");

    lightboxImage.src = "";
    lightboxFrame.src = "";
    lightboxDescription.textContent = "";
  }

  closeButton.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      lightbox.classList.contains("active")
    ) {
      closeLightbox();
    }
  });
});
















/* =====================================
   7. SECTION 3 — MODAL, AUDIO, FLEA
===================================== */

document.addEventListener("DOMContentLoaded", () => {
  const section = document.getElementById("section-3");
  if (!section) return;

  const certificateModal = document.getElementById("certificate-modal");
  const letterModal = document.getElementById("birthday-letter-modal");

  const shermaAudio = document.getElementById("sherma-audio");
  const shermaGif = section.querySelector(".sherma-gif");
  const fleaLayer = document.getElementById("flea-flight-layer");

  const openCertificateButton = document.getElementById("open-certificate");
  const openLetterButton = document.getElementById("open-birthday-letter");

  // Volume audio menggunakan skala 0–1.
  const SHERMA_VOLUME = 0.20;

  // Volume musik YouTube menggunakan skala 0–100.
  const BACKGROUND_VOLUME = 30;

  let backgroundWasPlaying = false;
  let letterOpen = false;

  /* =====================================
     BACKGROUND MUSIC — YOUTUBE
  ===================================== */

  function getYouTubeFrame() {
    return document.getElementById("youtube-player")
      ?.querySelector("iframe") || null;
  }

  function sendYouTubeCommand(func, args = []) {
    const frame = getYouTubeFrame();
    if (!frame?.contentWindow) return;

    frame.contentWindow.postMessage(
      JSON.stringify({
        event: "command",
        func,
        args
      }),
      "https://www.youtube.com"
    );
  }

  function setBackgroundVolume() {
    sendYouTubeCommand("setVolume", [BACKGROUND_VOLUME]);
  }

  function pauseBackgroundMusic() {
    if (!getYouTubeFrame()) {
      backgroundWasPlaying = false;
      return;
    }

    backgroundWasPlaying = true;
    sendYouTubeCommand("pauseVideo");
  }

  function resumeBackgroundMusic() {
    if (!backgroundWasPlaying) return;

    setBackgroundVolume();
    sendYouTubeCommand("playVideo");

    backgroundWasPlaying = false;
  }

  // Terapkan volume saat iframe YouTube ditambahkan atau diganti.
  const youtubePlayerElement = document.getElementById("youtube-player");

  if (youtubePlayerElement) {
    const observer = new MutationObserver(() => {
      [500, 1000, 2000].forEach((delay) => {
        window.setTimeout(setBackgroundVolume, delay);
      });
    });

    observer.observe(youtubePlayerElement, {
      childList: true,
      subtree: true
    });
  }

  /* =====================================
     MODAL & SCROLL
  ===================================== */

  function anyModalOpen() {
    return Boolean(
      certificateModal?.classList.contains("active") ||
      letterModal?.classList.contains("active")
    );
  }

  function syncPageScroll() {
    document.body.style.overflow = anyModalOpen() ? "hidden" : "";
  }

  function openModal(modal) {
    if (!modal) return;

    modal.classList.add("active");
    syncPageScroll();
  }

  function closeCertificate() {
    certificateModal?.classList.remove("active");
    syncPageScroll();
  }

  function closeBirthdayLetter() {
    if (!letterModal?.classList.contains("active")) return;

    letterModal.classList.remove("active");

    if (shermaAudio) {
      shermaAudio.pause();
      shermaAudio.currentTime = 0;
    }

    if (shermaGif) {
      shermaGif.style.display = "none";
    }

    letterOpen = false;
    syncPageScroll();
    resumeBackgroundMusic();
  }

  /* =====================================
     TOMBOL SERTIFIKAT FOTO
  ===================================== */

  if (openCertificateButton && certificateModal) {
    openCertificateButton.addEventListener("click", () => {
      openModal(certificateModal);
    });
  }

  /* =====================================
     AUDIO SHERMA
  ===================================== */

  if (shermaAudio) {
    shermaAudio.pause();
    shermaAudio.currentTime = 0;
    shermaAudio.volume = SHERMA_VOLUME;
    shermaAudio.loop = true;
  }

  if (shermaGif) {
    shermaGif.style.display = "none";
  }

  if (openLetterButton && letterModal) {
    openLetterButton.addEventListener("click", () => {
      if (letterOpen) return;

      letterOpen = true;

      pauseBackgroundMusic();
      openModal(letterModal);

      if (shermaGif) {
        shermaGif.style.display = "block";
      }

      if (shermaAudio) {
        shermaAudio.pause();
        shermaAudio.currentTime = 0;
        shermaAudio.volume = SHERMA_VOLUME;
        shermaAudio.loop = true;

        shermaAudio.play().catch((error) => {
          console.warn("Lagu Sherma gagal diputar:", error);
        });
      }
    });
  }

 



  
  /* =====================================
     TOMBOL X MODAL
  ===================================== */

  document.querySelectorAll("[data-close-modal]").forEach((button) => {
    button.addEventListener("click", () => {
      const modalId = button.dataset.closeModal;

      if (modalId === "certificate-modal") {
        closeCertificate();
      } else if (modalId === "birthday-letter-modal") {
        closeBirthdayLetter();
      }
    });
  });

  /* =====================================
     KLIK AREA GELAP UNTUK MENUTUP
  ===================================== */

  [certificateModal, letterModal].forEach((modal) => {
    if (!modal) return;

    modal.addEventListener("click", (event) => {
      if (event.target !== modal) return;

      if (modal === certificateModal) {
        closeCertificate();
      } else if (modal === letterModal) {
        closeBirthdayLetter();
      }
    });
  });

  /* =====================================
     ESCAPE UNTUK MENUTUP MODAL
  ===================================== */

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    if (letterModal?.classList.contains("active")) {
      closeBirthdayLetter();
    } else if (certificateModal?.classList.contains("active")) {
      closeCertificate();
    }
  });

  /* =====================================
     FLEA — UKURAN 200 PX
  ===================================== */

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  function createFlea() {
    if (!fleaLayer || reducedMotion.matches) return;

    const flea = document.createElement("img");
    flea.src = "img/flea.gif";
    flea.alt = "";
    flea.className = "flea-flyer";

    const fleaSize = 200;
    const width = section.clientWidth;
    const height = section.clientHeight;

    flea.style.width = `${fleaSize}px`;
    flea.style.height = `${fleaSize}px`;
    flea.style.objectFit = "contain";

    const directions = [
      () => ({
        sx: -fleaSize,
        sy: Math.random() * height,
        ex: width + fleaSize,
        ey: Math.random() * height
      }),
      () => ({
        sx: width + fleaSize,
        sy: Math.random() * height,
        ex: -fleaSize,
        ey: Math.random() * height
      }),
      () => ({
        sx: Math.random() * width,
        sy: -fleaSize,
        ex: Math.random() * width,
        ey: height + fleaSize
      }),
      () => ({
        sx: Math.random() * width,
        sy: height + fleaSize,
        ex: Math.random() * width,
        ey: -fleaSize
      }),
      () => ({
        sx: -fleaSize,
        sy: -fleaSize,
        ex: width + fleaSize,
        ey: height + fleaSize
      }),
      () => ({
        sx: width + fleaSize,
        sy: -fleaSize,
        ex: -fleaSize,
        ey: height + fleaSize
      }),
      () => ({
        sx: -fleaSize,
        sy: height + fleaSize,
        ex: width + fleaSize,
        ey: -fleaSize
      }),
      () => ({
        sx: width + fleaSize,
        sy: height + fleaSize,
        ex: -fleaSize,
        ey: -fleaSize
      })
    ];

    const path =
      directions[Math.floor(Math.random() * directions.length)]();

    const duration = 5000 + Math.random() * 3000;

    flea.style.setProperty("--start-x", `${path.sx}px`);
    flea.style.setProperty("--start-y", `${path.sy}px`);
    flea.style.setProperty("--end-x", `${path.ex}px`);
    flea.style.setProperty("--end-y", `${path.ey}px`);
    flea.style.animationDuration = `${duration}ms`;

    fleaLayer.appendChild(flea);

    window.setTimeout(() => {
      flea.remove();

      if (section.isConnected && !reducedMotion.matches) {
        createFlea();
      }
    }, duration);
  }

  createFlea();
  window.setTimeout(createFlea, 1800);
  window.setTimeout(createFlea, 3900);
});
