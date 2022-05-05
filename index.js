const AREA_WIDTH = 160;
const AREA_HEIGHT = 80;
const hostname = "https://pix.carryhelper.ml";

const table = document.getElementById('pbarea');

let index = 0;
let connected = false;

function updatePixel(id, color) {
    const pixelEl = document.getElementById(`p_${id + 1}`);
    pixelEl.style = `background-color: ${color};`;
}

for (let i = 0; i < AREA_HEIGHT; i++) {
    const row = table.insertRow(i);
    for (let j = 0; j < AREA_WIDTH; j++) {
        const cell = row.insertCell(j);

        const content = document.createElement('div');
        content.classList.add('pix');
        content.id = 'p_' + ++index;

        cell.appendChild(content);

        row.appendChild(cell);
    }
}

const processedErrors = (type, args) => {
    let types = {
        "IncorrectColor": "Указан некорректный код цвета.",
        "IncorrectPixel": "Нет такого пикселя.",
        "NotAuthorized": "Некорректная сессия!",
        "UserCooldown": `Подождите ${args[0]} секунд!`,
        "Ended": "Битва завершена"
    };

    return types[type];
};

let userToken = localStorage.getItem('user-token');
document.getElementById(`user-form-${userToken ? 'profile' : 'login'}`).style = '';
if (userToken) {
    fetch(`${hostname}/user/getInfo`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ token: userToken })
    }).then(res => res.json()).then(x => {
        if (x.error && x.reason) return alert(processedErrors(x.reason));
        document.getElementById('user-id').innerText = x.userID;
        document.getElementById('user-tag-input').value = x.tag;
    }).catch(() => {});
}

function updateTags() {
    fetch(`${hostname}/pixels/get/tag`)
        .then(x => x.json())
        .then((data) => {
            if (!data.tags) return;
            let tags = document.getElementById('pixel-tags');

            let newTags = [];
            for (const tag of data.tags) {
                newTags.push(`${tag[0]}: ${tag[1]}\n`);
            }

            tags.innerText = newTags.join("");
        });
}

updateTags();
setInterval(() => { updateTags(); }, 30000);

let pixelMenuToggle = false;
document.getElementById('pixel-menu-toggle').onclick = (e) => {
    e.preventDefault();
    let menu = document.getElementById('pixel-menu');
    switch (pixelMenuToggle) {
        case true:
            menu.style = 'display: none;';
            pixelMenuToggle = false;
            break;
    
        case false:
            menu.style = '';
            pixelMenuToggle = true;
            break;
    }
}

let colors = document.getElementById('user-colors');
let userColors = localStorage.getItem('user-colors');
if (userColors) {
    userColors = JSON.parse(userColors);

    let newColors = [];
    for (let x of userColors) {
        newColors.push(`<div id="${x}" class="ColorPalette__color" onclick="changeColor('${x}')" style="background-color: ${x};"></div>`);
    }

    colors.innerHTML += newColors.join("");
}

document.getElementById('user-tag-submit').onclick = (e) => {
    e.preventDefault();
    let tag = document.getElementById('user-tag-input');

    fetch(`${hostname}/user/changeTag`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ tag: tag.value, token: userToken })
    }).then(res => res.json()).then(x => {
        if (x.error && x.reason) return alert(processedErrors(x.reason));
        alert('Тэг изменён!');
    }).catch(() => {});
}

const hexRegExp = /^#[0-9A-F]{6}$/i;
document.getElementById('user-color-change').onclick = (e) => {
    e.preventDefault();
    let color = document.getElementById('user-color-input');
    if (!color || !color.value || !hexRegExp.test(color.value)) return alert('Где код цвета?');

    let userColors = localStorage.getItem('user-colors');
    if (!userColors) localStorage.setItem('user-colors', JSON.stringify([color.value]));
    else {
        userColors = JSON.parse(userColors);
        if (!userColors.find(x => x == color.value)) userColors.push(color.value);
        localStorage.setItem('user-colors', JSON.stringify(userColors));
    }

    changeColor(color.value);
}

document.getElementById('user-color-reset').onclick = (e) => {
    e.preventDefault();
    let answer = confirm("Хочешь сбросить все цвета? Ты уверен в этом?");
    if (answer) {
        let userColors = localStorage.getItem('user-colors');
        if (userColors) localStorage.removeItem('user-colors');
        else return alert('У тебя же нет цветов, дурашка!');

        window.location.reload();
    }
}

document.getElementById('user-login').onclick = (e) => {
    e.preventDefault();
    let token = document.getElementById('user-token');
    if (!token || !token.value) return alert('Где токен?');
    localStorage.setItem('user-token', token.value);
    window.location.reload();
}

document.getElementById('user-logout').onclick = (e) => {
    e.preventDefault();
    localStorage.removeItem('user-token');
    window.location.reload();
}

fetch(`${hostname}/info`)
.then(res => res.json())
.then(data => document.getElementById('information').innerHTML = `Текущий сезон: ${data.season.name}<br>Игроков всего/онлайн: ${data.players.total}/${data.players.online + 1}`);

if (!localStorage.getItem('user-color')) localStorage.setItem('user-color', '#FFFFFF');
document.getElementById('user-color').innerText = localStorage.getItem('user-color');
let check = ['#FFFFFF', '#000000', '#074BF3'].includes(localStorage.getItem('user-color'));
document.getElementById('user-color').style = `color: ${check ? "gold" : "black"}; background-color: ${localStorage.getItem('user-color')};`;

function changeColor(color) {
    localStorage.setItem('user-color', color);
    document.getElementById('user-color').innerText = localStorage.getItem('user-color');
    let check = ['#FFFFFF', '#000000', '#074BF3'].includes(localStorage.getItem('user-color'));
    document.getElementById('user-color').style = `color: ${check ? "gold" : "black"}; background-color: ${localStorage.getItem('user-color')};`;
}

[...document.getElementsByClassName('pix')].forEach(el => {
    el.addEventListener('click', e => {
        e.preventDefault();

        if (!userToken) return alert('Вы не авторизованы!');

        if(connected) fetch(`${hostname}/pixels/put`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                id: Number(e.target.id.split("p_")[1] - 1),
                color: localStorage.getItem('user-color'),
                token: userToken
            })
        }).catch(() => {}).then(x => x.json()).catch(() => {}).then(x => {
            if (x.error && x.reason) return alert(processedErrors(x.reason, [x.cooldown || 0]));
        });
    });
});

const socketURL = new URL(hostname);
socketURL.protocol = 'wss';
socketURL.pathname = '/pixels/socket';

function connectSocket() {
    const ws = new WebSocket(socketURL);

    ws.onopen = () => {
        fetch(`${hostname}/pixels/get`)
            .then(x => x.json())
            .then(({ pixels }) => {
                for (const pixel of pixels) {
                    updatePixel(pixel.id, pixel.color);
                }
                connected = true;
            });
    };
    ws.onmessage = async (e) => {
        let data;
        if (e.data instanceof Blob) {
            const reader = new FileReader();
            reader.readAsText(e.data);
            data = await new Promise((r) => {
                reader.onload = () => r(JSON.parse(reader.result));
            });
        } else {
            data = JSON.parse(e.data);
        }
        switch (data.op) {
            case 'PLACE':
                updatePixel(data.id, data.color);
                break;
        
            case 'ENDED':
                document.getElementById('pixel-ended').style = '';
                break;
        }
    }

    ws.onclose = () => { connected = false; setTimeout(() => connectSocket(), 2000); }
    ws.onerror = () => ws.close();
}

connectSocket();
