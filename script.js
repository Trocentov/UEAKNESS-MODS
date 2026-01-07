// === Админ проверка ===
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

// === Сборки ===
function getBuilds() {
    let builds = localStorage.getItem("builds");
    return builds ? JSON.parse(builds) : [];
}

function saveBuilds(builds) {
    localStorage.setItem("builds", JSON.stringify(builds));
}

function addBuild(title, preview, description, download) {
    const builds = getBuilds();
    builds.push({
        title,
        preview,
        description,
        download,
        date: new Date().toLocaleString()
    });
    saveBuilds(builds);
}

function editBuild(index, title, preview, description, download) {
    const builds = getBuilds();
    builds[index] = {
        title, preview, description, download, date: builds[index].date
    };
    saveBuilds(builds);
}

function deleteBuild(index) {
    const builds = getBuilds();
    builds.splice(index,1);
    saveBuilds(builds);
}

// === Рендер сборок ===
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
                <a class="btn" href="${b.download}" target="_blank">Скачать</a>
            </div>
            <div class="build-buttons">
                ${isAdmin() ? `<button class="btn admin-only" onclick="editBuildPrompt(${idx})">Редактировать</button>` : ''}
                ${isAdmin() ? `<button class="btn admin-only" onclick="deleteBuild(${idx}); renderBuilds('${containerId}');">Удалить</button>` : ''}
            </div>
        `;
        container.appendChild(buildDiv);
    });

    // Показ кнопки "Добавить сборку" только для админа
    const addBtn = document.getElementById("addBuildBtn");
    if(addBtn) addBtn.style.display = isAdmin() ? "inline-block" : "none";
}

// === Редактирование через prompt ===
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

// === Показ формы добавления сборки ===
function showAddBuildForm() {
    const form = document.getElementById("addBuildForm");
    form.style.display = form.style.display === "block" ? "none" : "block";
}

// === Отправка формы добавления сборки ===
function submitAddBuildForm(e) {
    e.preventDefault();
    const title = document.getElementById("newTitle").value;
    const preview = document.getElementById("newPreview").value;
    const description = document.getElementById("newDescription").value;
    const download = document.getElementById("newDownload").value;
    if(title && preview && description && download){
        addBuild(title, preview, description, download);
        renderBuilds("buildsContainer");
        document.getElementById("addBuildForm").reset();
        document.getElementById("addBuildForm").style.display = "none";
    }
}