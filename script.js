// Общий скрипт для admin.html и builds.html
let builds = JSON.parse(localStorage.getItem("builds") || "[]");

// Для обычных пользователей — рендерим только скачать
function renderBuilds(userType = "user") {
    const container = document.getElementById("buildsContainer");
    container.innerHTML = "";

    builds.forEach((b, idx) => {
        const buildDiv = document.createElement("div");
        buildDiv.className = "build";

        buildDiv.innerHTML = `
            <div class="build-info">
                <h2>${b.title}</h2>
                <p>${b.description}</p>
            </div>
            <div class="build-buttons">
                <a href="${b.download}" class="button">Скачать</a>
                ${userType === "admin" ? `
                    <button onclick="editBuild(${idx})">✏️</button>
                    <button onclick="deleteBuild(${idx})">🗑️</button>
                ` : ""}
            </div>
        `;

        container.appendChild(buildDiv);
    });
}

// Админ: добавление новой сборки
function addBuild() {
    const title = prompt("Название сборки:");
    const description = prompt("Описание сборки:");
    const preview = prompt("Ссылка на превью (jpg/png):", "preview.jpg");
    const download = prompt("Ссылка на скачивание:");

    if(title && description && download) {
        builds.push({title, description, preview, download});
        localStorage.setItem("builds", JSON.stringify(builds));
        renderBuilds("admin");
    }
}

function editBuild(idx) {
    const b = builds[idx];
    const title = prompt("Название сборки:", b.title);
    const description = prompt("Описание сборки:", b.description);
    const preview = prompt("Ссылка на превью:", b.preview);
    const download = prompt("Ссылка на скачивание:", b.download);

    builds[idx] = {title, description, preview, download};
    localStorage.setItem("builds", JSON.stringify(builds));
    renderBuilds("admin");
}

function deleteBuild(idx) {
    if(confirm("Удалить эту сборку?")) {
        builds.splice(idx, 1);
        localStorage.setItem("builds", JSON.stringify(builds));
        renderBuilds("admin");
    }
}

// Рендер для обычных пользователей
function loadUserBuilds() {
    renderBuilds("user");
}