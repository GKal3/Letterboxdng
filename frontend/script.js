const API = "http://localhost:3000";

// ── STAR RATING INTERACTION (index.html) ─────────────
const stars = document.querySelectorAll('.star');
stars.forEach((star, i) => {
    star.addEventListener('mouseenter', () => {
        stars.forEach((s, j) => s.classList.toggle('active', j <= i));
    });
    star.addEventListener('mouseleave', () => {
        const rated = parseInt(document.querySelector('.star-rating')?.dataset.rating || 0);
        stars.forEach((s, j) => s.classList.toggle('active', j < rated));
    });
    star.addEventListener('click', () => {
        const val = parseInt(star.dataset.val);
        document.querySelector('.star-rating').dataset.rating = val;
        stars.forEach((s, j) => s.classList.toggle('active', j < val));
    });
});

// ── CARICA RECENSIONI (index.html) ───────────────────
function renderStars(n) {
    const full = Math.floor(n);
    let out = '★'.repeat(full);
    if (n % 1 >= 0.5) out += '½';
    return out || '–';
}

function getInitials(name) {
    return name.split(/[\s_]+/).map(w => w[0]?.toUpperCase()).join('').slice(0, 2);
}

if (document.getElementById("reviews")) {
    fetch(API + "/reviews")
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById("reviews");
            container.innerHTML = '';

            // ── MEDIA + ISTOGRAMMA ─────────────────────────
            if (data.length > 0) {
                const avg = data.reduce((sum, r) => sum + parseFloat(r.rating || 0), 0) / data.length;
                const avgEl = document.getElementById("avg-rating");
                if (avgEl) avgEl.textContent = avg.toFixed(1);

                // conta quante recensioni per ogni voto (1,2,3,4,5)
                const counts = {1:0, 2:0, 3:0, 4:0, 5:0};
                data.forEach(r => {
                    const v = Math.round(parseFloat(r.rating));
                    if (counts[v] !== undefined) counts[v]++;
                });

                const max = Math.max(...Object.values(counts), 1);
                const labels = {1:'1', 2:'2', 3:'3', 4:'4', 5:'5'};

                const barsEl = document.querySelector('.histogram-bars');
                if (barsEl) {
                    barsEl.innerHTML = Object.entries(counts).map(([val, count]) => `
                        <div class="hbar" style="height:${Math.max((count / max) * 100, 4)}%">
                            <span>${labels[val]}</span>
                        </div>
                    `).join('');
                }
            }
            // ───────────────────────────────────────────────

            if (data.length === 0) {
                container.innerHTML = '<p style="color:#556677;font-size:14px;padding:16px 0;">Nessuna recensione ancora. Sii il primo!</p>';
                return;
            }

            data.forEach(r => {
                const initials = getInitials(r.username || r.movie || 'U');
                const div = document.createElement('div');
                div.className = 'review';
                div.innerHTML = `
                    <div class="review-avatar">${initials}</div>
                    <div class="review-body">
                        <div class="review-header">
                            <span class="review-username">${r.username || 'Anonimo'}</span>
                            <span class="review-stars">${renderStars(parseFloat(r.rating))}</span>
                        </div>
                        <p class="review-text">${r.text}</p>
                        <div class="review-date">${r.date || ''}</div>
                    </div>
                `;
                container.appendChild(div);
            });
        });
}