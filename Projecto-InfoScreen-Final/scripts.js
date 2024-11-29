document.addEventListener('DOMContentLoaded', () => {
    // Forzar pantalla completa al iniciar
    const requestFullscreen = () => {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) { // Firefox
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari, Opera
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) { // IE/Edge
            document.documentElement.msRequestFullscreen();
        }
    };

    requestFullscreen();

    // Bloquear F11 y ALT+TAB
    document.addEventListener('keydown', (event) => {
        if (event.key === 'F11' || (event.altKey && event.key === 'Tab')) {
            event.preventDefault();
        }
    });

    // Deshabilitar clic derecho
    document.addEventListener('contextmenu', (event) => event.preventDefault());

    // Lógica de pestañas
    const tabs = document.querySelectorAll('.tablink');
    const contents = document.querySelectorAll('.tabcontent');
    const defaultTab = 'notices';

    contents.forEach(content => content.style.display = 'none');
    document.getElementById(defaultTab).style.display = 'block';

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            contents.forEach(content => content.style.display = 'none');
            document.getElementById(tab.dataset.tab).style.display = 'block';
        });
    });

    // Slot Machine Game
    const symbols = ["🧱", "💻", "📝", "⚒️"];
    const reels = [
        document.getElementById("reel1"),
        document.getElementById("reel2"),
        document.getElementById("reel3")
    ];
    const resultMessage = document.getElementById("resultMessage");
    const winVideo = document.getElementById("winVideo");

    function getRandomSymbol() {
        return symbols[Math.floor(Math.random() * symbols.length)];
    }

    function startSpin() {
        reels.forEach(reel => reel.classList.add('spin'));
    }

    function stopSpin(reel) {
        reel.classList.remove('spin');
        const randomSymbol = getRandomSymbol();
        reel.textContent = randomSymbol;
        return randomSymbol;
    }

    document.getElementById("spinButton").addEventListener("click", () => {
        resultMessage.textContent = "";
        winVideo.style.display = 'none';
        winVideo.pause();
        winVideo.currentTime = 0;

        startSpin();

        const results = [];

        setTimeout(() => results.push(stopSpin(reels[0])), 1000);
        setTimeout(() => results.push(stopSpin(reels[1])), 1500);
        setTimeout(() => {
            results.push(stopSpin(reels[2]));

            if (results[0] === results[1] && results[1] === results[2]) {
                resultMessage.textContent = "¡Ganaste!";
                showWinVideo();
            } else {
                resultMessage.textContent = "Inténtalo de nuevo.";
            }
        }, 2000);
    });

    function showWinVideo() {
        winVideo.style.display = 'block';
        winVideo.play().catch((error) => {
            console.log("Autoplay bloqueado. Reproduciendo manualmente.");
            winVideo.muted = true;
            winVideo.play();
            setTimeout(() => winVideo.muted = false, 200);
        });

        if (winVideo.requestFullscreen) winVideo.requestFullscreen();

        winVideo.onended = () => winVideo.style.display = 'none';
    }

    // Modo Editor Login
    const loginForm = document.getElementById('loginForm');
    const developerContent = document.getElementById('developerContent');
    const logoutBtn = document.getElementById('logoutBtn');

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username === 'admin' && password === 'admin') {
            loginForm.style.display = 'none';
            developerContent.style.display = 'block';
        } else {
            alert('Credenciales incorrectas');
        }
    });

    logoutBtn.addEventListener('click', () => {
        loginForm.style.display = 'block';
        developerContent.style.display = 'none';
    });

    // Cargar y guardar Avisos
    const loadNotices = () => {
        const savedNotices = localStorage.getItem('notices');
        const noticesContent = document.getElementById('noticesContent');
        noticesContent.innerHTML = savedNotices ?
            savedNotices.split('\n').map(notice => `<p>${notice}</p>`).join('') :
            '<p>No hay avisos por el momento.</p>';
    };

    document.getElementById('saveNoticesBtn').addEventListener('click', () => {
        const newNotices = document.getElementById('editNotices').value;
        localStorage.setItem('notices', newNotices);
        loadNotices();
        alert('Avisos guardados exitosamente.');
    });

    loadNotices();

    // Efectos de audio para hover y clic
    const hoverAudio = document.getElementById('audio-hover');
    const clickAudio = document.getElementById('audio-click');
    const menuItems = document.querySelectorAll('.menu-item');

    const playAudio = (audioElement) => {
        audioElement.currentTime = 0;
        audioElement.play();
    };

    menuItems.forEach(item => {
        item.addEventListener('mouseenter', () => playAudio(hoverAudio));
        item.addEventListener('click', () => playAudio(clickAudio));
    });

    // Música de fondo
    const backgroundAudio = document.getElementById('background-audio');
    backgroundAudio.volume = 0.05;

    const playBackgroundMusic = () => {
        if (backgroundAudio.paused) {
            backgroundAudio.play().catch((error) => {
                console.log("Error en la reproducción automática: " + error.message);
            });
        }
    };

    document.addEventListener('click', () => {
        playBackgroundMusic();
    });

    // Subir archivo Excel
    document.getElementById('uploadExcel').addEventListener('change', function (e) {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = function (event) {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const scheduleData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
            const tableBody = document.getElementById('scheduleContent');
            tableBody.innerHTML = "";

            scheduleData.forEach((row, rowIndex) => {
                const tr = document.createElement('tr');
                row.forEach(cell => {
                    const td = document.createElement(rowIndex === 0 ? 'th' : 'td');
                    td.textContent = cell || '';
                    tr.appendChild(td);
                });
                tableBody.appendChild(tr);
            });
        };

        reader.readAsArrayBuffer(file);
    });

    // Modo oscuro
    const toggle = document.getElementById('toggleMode');
    toggle.addEventListener('change', () => document.body.classList.toggle('dark-mode'));

    // Botón de pantalla completa
    const fullscreenButton = document.getElementById("fullscreenButton");
    fullscreenButton.addEventListener("click", () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            document.documentElement.requestFullscreen().catch(err => {
                console.warn(`Error al entrar en pantalla completa: ${err}`);
            });
        }
    });
});
