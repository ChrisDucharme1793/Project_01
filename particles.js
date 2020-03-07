// Materialize - BUBBLES
const particlesJSON = {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 500,
      },
    },
    color: {
      value: '#ffff99',
    },
    shape: {
      type: 'circle',
      stroke: {
        width: 2,
        color: '#D9FFFFFF',
      },
      polygon: {
        nb_sides: 6,
      },
      image: {
        src: 'img/github.svg',
        width: 100,
        height: 100,
      },
    },
    opacity: {
      value: 0.5,
      random: true,
    },
    size: {
      value: 30,
      random: true,
    },
    line_linked: {
      enable: false,
      distance: 200,
      color: '#FFFFFF',
      opacity: 0.3,
      width: 2,
    },
    move: {
      enable: true,
      speed: 5,
      direction: 'top',
      random: true,
      straight: true,
      out_mode: 'out',
      bounce: false,
      attract: {
        enable: false,
        rotateX: 600,
        rotateY: 1200,
      },
    },
  },
  interactivity: {
    detect_on: 'canvas',
    events: {
      onhover: {
        enable: false,
        mode: ['grab', 'bubble'],
      },
      onclick: {
        enable: true,
        mode: 'push',
      },
      resize: true,
    },
    modes: {
      grab: {
        distance: 400,
        line_linked: {
          opacity: 0.7,
        },
      },
      bubble: {
        distance: 600,
        size: 12,
        duration: 1,
        opacity: 0.8,
        speed: 2,
      },
      repulse: {
        distance: 400,
        duration: 0.4,
      },
      push: {
        particles_nb: 20,
      },
      remove: {
        particles_nb: 10,
      },
    },
  },
  retina_detect: true,
};

// var particlesJS = ("#particles-js", particlesJSON)
particlesJS('particles-js', particlesJSON);
// console.log(particlesJS)
