// Проверка администратора
const ADMIN_USERNAME = "winged";
const ADMIN_PASSWORD = "142531";

function isAdmin() {
    return localStorage.getItem("adminLogged") === "true";
}

function loginAdmin(username, password) {
    if(username === ADMIN_USERNAME && password === ADMIN_PASSWORD){
        localStorage.setItem("adminLogged", "true");
        return true;
    }
    return false;
}

function logoutAdmin() {
    localStorage.removeItem("adminLogged");
    window.location.href = "index.html";
}

// Сборки
function getBuilds() {
    let builds = localStorage.getItem("builds");
    if(builds) return JSON.parse(builds);
    return [];
}

function saveBuilds(builds) {
    localStorage.setItem("builds", JSON.stringify(builds));
}

// Добавление сборки
function addBuild(title, preview, description, download) {
    let builds = getBuilds();
    builds.push({
        title, preview, description, download,
        date: new Date().toLocaleString()
    });
    saveBuilds(builds);
}

// Редактирование сборки
function editBuild(index, title, preview, description, download) {
    let builds = getBuilds();
    builds[index] = {title, preview, description, download, date: builds[index].date};
    saveBuilds(builds);
}

// Удаление
function deleteBuild(index) {
    let builds = getBuilds();
    builds.splice(index, 1);
    saveBuilds(builds);
}

// Отображение сборок
function renderBuilds(containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    const builds = getBuilds();
    builds.forEach((b, idx) => {
        const buildDiv = document.createElement("div");
        buildDiv.className = "build";

        buildDiv.innerHTML = `
            <img src="${b.preview}" alt="${b.title}">
            <div class="build-info">
                <h2>${b.title}</h2>
                <p>${b.description}</p>
                <p><small>Опубликовано: ${b.date}</small></p>
            </div>
            <div class="admin-buttons">
                <a class="btn" href="${b.download}" target="_blank">Скачать</a>
                ${isAdmin() ? `<button onclick="editBuildPrompt(${idx})" class="btn admin-only">Редактировать</button>` : ''}
                ${isAdmin() ? `<button onclick="deleteBuild(${idx}); renderBuilds('${containerId}');" class="btn admin-only">Удалить</button>` : ''}
            </div>
        `;
        container.appendChild(buildDiv);
    });
}

// Подсказка редактирования
function editBuildPrompt(idx) {
    const builds = getBuilds();
    const b = builds[idx];
    const title = prompt("Название сборки:", b.title);
    const preview = prompt("Ссылка на превью 1280x720:", b.preview);
    const description = prompt("Описание сборки:", b.description);
    const download = prompt("Ссылка на скачивание:", b.download);
    if(title && preview && description && download){
        editBuild(idx, title, preview, description, download);
        renderBuilds("buildsContainer");
    }
}

// Добавление через форму админа
function showAddBuildForm() {
    const form = document.getElementById("addBuildForm");
    form.style.display = form.style.display === "block" ? "none" : "block";
}

function submitAddBuildForm() {
    const title = document.getElementById("newTitle").value;
    const preview = document.getElementById("newPreview").value;
    const description = document.getElementById("newDescription").value;
    const download = document.getElementById("newDownload").value;
    if(title && preview && description && download){
        addBuild(title, preview, description, download);
        renderBuilds("buildsContainer");
        document.getElementById("addBuildForm").reset();
    }
}