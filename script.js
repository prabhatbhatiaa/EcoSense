document.addEventListener('DOMContentLoaded', () => {

    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    
    const currentTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', currentTheme);

    themeToggleBtn.addEventListener('click', () => {
        let theme = body.getAttribute('data-theme');
        let newTheme = theme === 'light' ? 'dark' : 'light';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');
    });

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if(navLinks.classList.contains('nav-active')){
                navLinks.classList.remove('nav-active');
            }
        });
    });

    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href').includes(current)) {
                a.classList.add('active');
            }
        });
    });

    const counters = document.querySelectorAll('.counter');
    let hasCounted = false;

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasCounted) {
                counters.forEach(counter => {
                    const updateCount = () => {
                        const target = +counter.getAttribute('data-target');
                        const count = +counter.innerText;
                        const speed = 200; 
                        const inc = target / speed;

                        if (count < target) {
                            counter.innerText = Math.ceil(count + inc);
                            setTimeout(updateCount, 10);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    updateCount();
                });
                hasCounted = true;
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    const moistureVal = document.getElementById('moisture-val');
    const moistureCircle = document.getElementById('moisture-circle');
    const moistureTrend = document.getElementById('moisture-trend');
    
    const aqiVal = document.getElementById('aqi-val');
    const aqiBar = document.getElementById('aqi-bar');
    const aqiTrend = document.getElementById('aqi-trend');
    const aqiStatusText = document.getElementById('aqi-status-text');
    
    const pumpStatus = document.getElementById('pump-status');
    const tankVal = document.getElementById('tank-val');
    const syncTime = document.getElementById('sync-time');

    let lastMoisture = null;
    let lastAqi = null;

    async function fetchHardwareData() {
        try {
            const response = await fetch('data.json');
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            updateDashboard(data);
        } catch (error) {
            console.error(error);
        }
    }

    function updateDashboard(data) {
        const now = new Date();
        syncTime.innerText = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

        moistureVal.innerText = `${data.moisture}%`;
        moistureCircle.setAttribute('stroke-dasharray', `${data.moisture}, 100`);

        if (lastMoisture !== null) {
            let moistureDiff = data.moisture - lastMoisture;
            if (moistureDiff > 0) {
                moistureTrend.innerText = `↑ ${moistureDiff}%`;
                moistureTrend.className = "sensor-trend trend-up";
            } else if (moistureDiff < 0) {
                moistureTrend.innerText = `↓ ${Math.abs(moistureDiff)}%`;
                moistureTrend.className = "sensor-trend trend-down";
            } else {
                moistureTrend.innerText = "Stable";
                moistureTrend.className = "sensor-trend trend-up";
            }
        }
        lastMoisture = data.moisture;

        if (data.pumpActive) {
            pumpStatus.innerText = "PUMPING";
            pumpStatus.className = "badge warning";
        } else {
            pumpStatus.innerText = "STANDBY";
            pumpStatus.className = "badge active";
        }

        tankVal.innerText = `${data.tankLevel}%`;

        aqiVal.innerText = data.aqi;
        let aqiPercentage = Math.min(100, (data.aqi / 200) * 100);
        aqiBar.style.width = `${aqiPercentage}%`;

        if (lastAqi !== null) {
            let aqiDiff = data.aqi - lastAqi;
            if (aqiDiff > 0) {
                aqiTrend.innerText = `↑ ${aqiDiff} ppm`;
                aqiTrend.className = "sensor-trend trend-down";
            } else if (aqiDiff < 0) {
                aqiTrend.innerText = `↓ ${Math.abs(aqiDiff)} ppm`;
                aqiTrend.className = "sensor-trend trend-up";
            } else {
                aqiTrend.innerText = "Stable";
                aqiTrend.className = "sensor-trend trend-up";
            }
        }
        lastAqi = data.aqi;

        if (data.aqi > 150) {
            aqiBar.style.background = "#eab308";
            aqiStatusText.innerText = "Poor";
            aqiStatusText.style.color = "#eab308";
        } else {
            aqiBar.style.background = "var(--accent-aqua)";
            aqiStatusText.innerText = "Moderate";
            aqiStatusText.style.color = "var(--text-main)";
        }
    }

    fetchHardwareData();
    setInterval(fetchHardwareData, 3000);

});