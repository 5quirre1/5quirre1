(async function () {
    const res = await fetch('/misc/components/goals/stuff.json');
    const DATA = await res.json();

    const goals = DATA.goals;
    const money = DATA.my_money;

    function parseCost(str) {
        return parseFloat(String(str).replace(/[^0-9.]/g, '')) || 0;
    }

    function fmt(n) {
        return '$' + n.toFixed(2);
    }

    function fmtCost(str) {
        const n = parseCost(str);
        return String(str).startsWith('~') ? '~' + fmt(n) : fmt(n);
    }

    const costs = goals.map(g => parseCost(g.cost));
    const total = costs.reduce((a, b) => a + b, 0);
    const pct = total > 0 ? Math.min(100, (money / total) * 100) : 100;

    document.getElementById('money-display').textContent = fmt(money);
    document.getElementById('progress-label').textContent = Math.round(pct) + '%';

    const cardsEl = document.getElementById('goals-cards');
    const waypointsEl = document.getElementById('waypoints');
    const statsEl = document.getElementById('goals-stats');

    let running = 0;
    let countBought = 0;
    let countAffordable = 0;

    const cardRefs = [];

    goals.forEach((goal, idx) => {
        running += costs[idx];

        const pos = total > 0 ? (running / total) * 100 : 100;
        const canAfford = money >= running;
        const reached = canAfford || goal.bought;

        if (goal.bought) countBought++;
        else if (canAfford) countAffordable++;

        const shell = document.createElement('div');
        shell.className = 'goal-card-shell';

        const btn = document.createElement('div');
        btn.className = 'goal-card-btn';

        const btnIcon = document.createElement('img');
        btnIcon.className = 'goal-card-btn-icon';
        btnIcon.src = goal.bought
            ? '/assets/icons/tick.png'
            : '/assets/icons/cross.png';
        btnIcon.alt = goal.bought ? 'bought' : 'not bought';

        const btnName = document.createElement('div');
        btnName.className = 'goal-card-btn-name';

        const nameWrap = document.createElement('div');
        nameWrap.className = 'marquee-wrap';

        const nameSpan = document.createElement('span');

        nameWrap.appendChild(nameSpan);
        btnName.appendChild(nameWrap);

        maybeMarquee(nameSpan, goal.name);

        const btnCost = document.createElement('span');
        btnCost.className = 'goal-card-btn-cost';
        btnCost.textContent = fmtCost(goal.cost);

        btn.appendChild(btnIcon);
        btn.appendChild(btnName);
        btn.appendChild(btnCost);

        const expand = document.createElement('div');
        expand.className = 'goal-card-expand';

        const expandInner = document.createElement('div');
        expandInner.className = 'goal-card-expand-inner';

        const expandContent = document.createElement('div');
        expandContent.className = 'goal-card-expand-content';

        const statusEl = document.createElement('span');

        let statusText = 'saving up';
        let statusClass = '';

        if (goal.bought) {
            statusText = 'purchased';
            statusClass = 'purchased';
        } else if (canAfford) {
            statusText = 'can afford';
            statusClass = 'can-afford';
        }

        statusEl.className = 'goal-card-status ' + statusClass;
        statusEl.textContent = statusText;

        expandContent.appendChild(statusEl);

        const closeBtn = document.createElement('div');
        closeBtn.className = 'goal-card-expand-close';
        closeBtn.textContent = 'close';

        expandInner.appendChild(expandContent);
        expandInner.appendChild(closeBtn);
        expand.appendChild(expandInner);

        shell.appendChild(btn);
        shell.appendChild(expand);

        cardsEl.appendChild(shell);

        const wp = document.createElement('div');
        wp.className = 'goals-waypoint' + (reached ? ' reached' : '');
        wp.style.left = pos + '%';

        const wpLabel = document.createElement('span');
        wpLabel.className = 'goals-waypoint-label';
        wpLabel.textContent = fmtCost(goal.cost);

        wp.appendChild(wpLabel);
        waypointsEl.appendChild(wp);

        cardRefs.push({ shell, btn, expand, closeBtn, wp });

        function open() {
            cardRefs.forEach(r => {
                r.expand.classList.remove('open');
                r.shell.classList.remove('open');
            });

            shell.classList.add('open');
            expand.classList.add('open');
        }

        function close() {
            shell.classList.remove('open');
            expand.classList.remove('open');
        }

        btn.addEventListener('click', () => {
            if (expand.classList.contains('open')) close();
            else open();
        });

        wp.addEventListener('click', () => {
            if (expand.classList.contains('open')) close();
            else open();
        });

        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            close();
        });
    });

    const statDefs = [
        { num: goals.length, label: 'total' },
        { num: countBought, label: 'bought' },
        { num: countAffordable, label: 'affordable' },
        { num: goals.length - countBought, label: 'remaining' }
    ];

    statDefs.forEach(s => {
        const stat = document.createElement('div');

        stat.className = 'goals-stat';

        stat.innerHTML = `
            <span class="goals-stat-num">${s.num}</span>
            <span class="goals-stat-label">${s.label}</span>
        `;

        statsEl.appendChild(stat);
    });

    setTimeout(() => {
        document.getElementById('bar-fill').style.width = pct + '%';
    }, 80);

    if (window.initMarquees) window.initMarquees();
})();