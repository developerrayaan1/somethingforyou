function toggleMusic() {
  var audio = document.getElementById("myAudio");
  if (audio) {
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  }
}

(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const stars = $('#stars');
  for (let i = 0; i < 100; i++) {
    const dot = document.createElement('i');
    dot.className = 'star-dot';
    dot.style.left = `${Math.random() * 100}%`;
    dot.style.top = `${Math.random() * 100}%`;
    dot.style.setProperty('--dur', `${2 + Math.random() * 4}s`);
    dot.style.animationDelay = `${Math.random() * 4}s`;
    dot.style.opacity = `${.25 + Math.random() * .7}`;
    stars.appendChild(dot);
  }
  $$('.letter-stars, .game-stars').forEach((layer, index) => {
    for (let i = 0; i < 55; i++) {
      const dot = document.createElement('i');
      dot.className = 'star-dot';
      dot.style.left = `${Math.random() * 100}%`;
      dot.style.top = `${Math.random() * 100}%`;
      dot.style.setProperty('--dur', `${2 + Math.random() * 4}s`);
      dot.style.animationDelay = `${Math.random() * 4}s`;
      layer.appendChild(dot);
    }
  });

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .12 });
  $$('.reveal').forEach(el => revealObserver.observe(el));

  const nav = $('#nav'), menuToggle = $('#menuToggle');
  menuToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.textContent = open ? '×' : '☰';
  });
  $$('#nav a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open'); menuToggle.setAttribute('aria-expanded', 'false'); menuToggle.textContent = '☰';
  }));

  const flowerThoughts = {
    rose: ['A rose for the little moments that make an ordinary day feel special.'],
    rose2: ['A reminder that beautiful things do not always need a reason to bloom.'],
    tulip: ['For fresh starts, soft colours, and the quiet joy of being yourself.'],
    lily: ['A little bit of calm for wherever your thoughts happen to wander.']
  };
  $$('.plant').forEach(plant => plant.addEventListener('click', () => {
    const key = plant.dataset.flower;
    $('#flowerNote').innerHTML = `<span class="note-icon">✧</span><p>${flowerThoughts[key][0]}</p>`;
    plant.animate([{transform:'translateY(0) scale(1)'},{transform:'translateY(-12px) scale(1.12)'},{transform:'translateY(0) scale(1)'}], {duration:550,easing:'ease-out'});
  }));

  const leafButton = $('#leafButton'), fallingLeaves = $('#fallingLeaves');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function dropLeaf(container, persistent = false) {
    if (!container || reduceMotion) return;
    const leaf = document.createElement('span');
    leaf.className = 'leaf-fall';
    leaf.textContent = ['✦', '❧', '✿', '❋'][Math.floor(Math.random() * 4)];
    leaf.style.left = `${Math.random() * 100}%`;
    leaf.style.setProperty('--falltime', `${7 + Math.random() * 7}s`);
    leaf.style.setProperty('--drift', `${-70 + Math.random() * 140}px`);
    leaf.style.fontSize = `${.65 + Math.random() * .8}rem`;
    leaf.style.animationDelay = `${Math.random() * 2}s`;
    container.appendChild(leaf);
    setTimeout(() => leaf.remove(), 16000);
  }
  if (!reduceMotion) {
    // Gentle, continuous falling leaves in the autumn section and occasional leaves in the garden.
    setInterval(() => dropLeaf(fallingLeaves, true), 650);
    const gardenLeaves = document.createElement('div');
    gardenLeaves.className = 'garden-leaves';
    $('.garden-scene').appendChild(gardenLeaves);
    setInterval(() => dropLeaf(gardenLeaves, true), 1700);

    // Butterflies drift across the garden at different heights and speeds.
    const butterflyLayer = $('#butterflies');
    for (let i = 0; i < 4; i++) {
      const butterfly = document.createElement('span');
      butterfly.className = `butterfly butterfly-${i + 1}`;
      butterfly.innerHTML = '<i></i><b></b>';
      butterflyLayer.appendChild(butterfly);
    }
  }
  leafButton.addEventListener('click', () => {
    for (let i = 0; i < 24; i++) {
      setTimeout(() => dropLeaf(fallingLeaves), i * 70);
    }
    leafButton.innerHTML = 'A little autumn, just for a moment <span>✦</span>';
  });

  // Add a gentle parallax response to the hero moon and a soft pointer glow in the garden.
  const hero = $('.hero');
  hero.addEventListener('pointermove', event => {
    if (reduceMotion || event.pointerType === 'touch') return;
    const rect = hero.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    const moon = $('.hero-moon');
    moon.style.transform = `translate(${x * 16}px, ${y * 12}px)`;
  });
  $('.garden-scene').addEventListener('pointermove', event => {
    if (event.pointerType === 'touch') return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--glow-x', `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty('--glow-y', `${event.clientY - rect.top}px`);
  });
})();