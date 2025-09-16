// Light/Dark toggle
const toggleBtn = document.getElementById('modeToggle');
const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const saved = localStorage.getItem('theme');

if (saved === 'dark' || (!saved && prefersDark)) {
  document.body.classList.remove('light');
  document.body.classList.add('dark');
  toggleBtn.textContent = '🌞 Light';
}

toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  toggleBtn.textContent = isDark ? '🌞 Light' : '🌙 Dark';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Render projects
const grid = document.getElementById('projectGrid');
function makeTag(t){ return `<span class="tag">${t}</span>` }
function projectCard(p){
  const tagsSmall = p.tags.slice(0, 5).map(makeTag).join('');
  return `
  <article class="project" data-tags="${p.tags.join('|')}">
    <img src="${p.cover}" alt="${p.title} cover" class="project-cover" />
    <div class="project-body">
      <h3 class="project-title">${p.title}</h3>
      <div class="project-meta">
        <span>${p.role}</span> · <span>${p.date}</span>
      </div>
      <p><b>Problem:</b> ${p.problem}</p>
      <p><b>Solution:</b> ${p.solution}</p>
      <p><b>Tech:</b> ${p.tech}</p>
      <p><b>Business Impact:</b> ${p.impact.join(' · ')}</p>
      <div class="tags">${tagsSmall}</div>
    </div>
  </article>`;
}
function renderProjects(list){
  grid.innerHTML = list.map(projectCard).join('');
}
renderProjects(window.PROJECTS);

// Filtering
const chips = document.querySelectorAll('.chip');
chips.forEach(chip => {
  chip.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    const tag = chip.dataset.tag;
    if (tag === 'all') { renderProjects(window.PROJECTS); return; }
    const filtered = window.PROJECTS.filter(p => p.tags.includes(tag));
    renderProjects(filtered);
    grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
