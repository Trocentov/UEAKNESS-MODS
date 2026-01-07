const isAdmin = localStorage.getItem('admin') === '1';
const addBtn = document.getElementById('addBtn');
const buildsDiv = document.getElementById('builds');

if (addBtn && isAdmin) addBtn.style.display = 'inline-block';

const builds = JSON.parse(localStorage.getItem('builds') || '[]');

function render() {
  buildsDiv.innerHTML = '';
  builds.forEach((b,i)=>{
    buildsDiv.innerHTML += `
    <div class="build">
      <img src="${b.preview}">
      <div class="build-content">
        <h3>${b.title}</h3>
        <p>${b.desc}</p>
        <small>Дата: ${b.date}</small>
      </div>
      <div class="build-footer">
        <a class="btn" href="${b.link}" target="_blank">Скачать</a>
        ${isAdmin ? `<div>
          <button class="btn" onclick="edit(${i})">✏</button>
          <button class="btn" onclick="del(${i})">🗑</button>
        </div>`:''}
      </div>
    </div>`;
  });
}
render();

if (addBtn)
addBtn.onclick = ()=>{
  const b = {
    title: prompt('Название'),
    preview: prompt('Превью 1280x720'),
    desc: prompt('Описание'),
    link: prompt('Ссылка'),
    date: new Date().toLocaleDateString()
  };
  builds.push(b);
  localStorage.setItem('builds', JSON.stringify(builds));
  render();
};

function del(i){
  builds.splice(i,1);
  localStorage.setItem('builds', JSON.stringify(builds));
  render();
}

function edit(i){
  builds[i].title = prompt('Название', builds[i].title);
  builds[i].desc = prompt('Описание', builds[i].desc);
  builds[i].link = prompt('Ссылка', builds[i].link);
  localStorage.setItem('builds', JSON.stringify(builds));
  render();
}