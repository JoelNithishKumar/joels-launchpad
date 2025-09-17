// Light/Dark toggle
const toggleBtn = document.getElementById('modeToggle');
const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const saved = localStorage.getItem('theme');

if (saved === 'dark' || (!saved && prefersDark)) {
  document.body.classList.remove('light');
  document.body.classList.add('dark');
  if (toggleBtn) toggleBtn.textContent = '🌞 Light';
}

if (toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    toggleBtn.textContent = isDark ? '🌞 Light' : '🌙 Dark';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
}

// Render projects
const grid = document.getElementById('projectGrid');
function makeTag(t){ return `<span class="tag">${t}</span>`; }

function projectCard(p){
  // Fallback if link missing
  const href = p.link && p.link !== '#' ? p.link : 'javascript:void(0)';
  const aria = p.link && p.link !== '#' ? '' : 'aria-disabled="true"';

  // Show up to 5 tags on the card
  const tagsSmall = (p.tags || []).slice(0, 5).map(makeTag).join('');

  return `
    <a class="project" href="${href}" ${aria} data-tags="${(p.tags || []).join('|')}" ${
      aria ? 'tabindex="-1"' : 'target="_self" rel="noopener"'
    }>
      <img src="${p.cover}" alt="${p.title || 'Project'} cover" class="project-cover" />
      <div class="project-body">
        <h3 class="project-title">${p.title || ''}</h3>
        ${p.role || p.date ? `<div class="project-meta">
          ${p.role ? `<span>${p.role}</span>` : ''}${p.role && p.date ? ' · ' : ''}${p.date ? `<span>${p.date}</span>` : ''}
        </div>` : ''}
        ${p.problem ? `<p><b>Problem:</b> ${p.problem}</p>` : ''}
        ${p.solution ? `<p><b>Solution:</b> ${p.solution}</p>` : ''}
        ${p.tech ? `<p><b>Tech:</b> ${p.tech}</p>` : ''}
        ${Array.isArray(p.impact) && p.impact.length ? `<p><b>Business Impact:</b> ${p.impact.join(' · ')}</p>` : ''}
        <div class="tags">${tagsSmall}</div>
      </div>
    </a>
  `;
}

function renderProjects(list){
  if (!grid) return;
  grid.innerHTML = (list || []).map(projectCard).join('');
}

// First render
renderProjects(window.PROJECTS || []);

// Filtering
const chips = document.querySelectorAll('.chip');
chips.forEach(chip => {
  chip.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    const tag = chip.dataset.tag;
    if (tag === 'all') {
      renderProjects(window.PROJECTS || []);
      return;
    }
    const filtered = (window.PROJECTS || []).filter(p => (p.tags || []).includes(tag));
    renderProjects(filtered);
    if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
