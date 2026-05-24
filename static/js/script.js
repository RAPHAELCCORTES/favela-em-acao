/* =========================================================================
   API SERVICES - PREPARADO PARA BANCO DE DADOS
   Quando você construir seu backend/banco de dados (Ex: Node, PHP, Python),
   basta substituir o conteúdo dentro destas funções por chamadas HTTP (fetch).
   Atualmente elas "simulam" a mesma assincronicidade (async/await)
   mas usam o LocalStorage da sua máquina.
   ========================================================================= */

   const defaultData = {
    home: {
        title: "Transformando Realidades <br/>com Cultura e Ação Social",
        teaser: "O Coletivo Favela em Ação atua transformando vidas na comunidade, promovendo educação, cultura e assistência para quem mais precisa.",
        heroImg: "/static/assets/hero.png"
    },
    campanhasSubtitle: "Juntos fazemos a diferença nas datas especiais.",
    projetos: [
        { title: "Alfabetização", desc: "Ajuda a desenvolver a leitura, a escrita, a comunicação, as ideias e os pensamentos, formando cidadãos críticos e conscientes.", category: "Educação", img: "" },
        { title: "Reforço Escolar", desc: "Ajuda os alunos a superarem dificuldades de aprendizagem, consolidando o conhecimento e melhorando o desempenho escolar.", category: "Educação", img: "" },
        { title: "Boxe", desc: "Auxilia e promove disciplina, autocontrole, coordenação motora e o seu potencial como pessoas e cidadãos.", category: "Esporte", img: "" },
        { title: "Balé Clássico", desc: "Estimula o desenvolvimento do corpo e suas potencialidades como a coordenação motora e educação postural, além de noções de musicalidade, ritmo, expressividade.", category: "Dança", img: "" },
        { title: "Contação de Histórias", desc: "Desenvolve a atenção, a concentração, o vocabulário, a memória e o raciocínio. Além disso, também estimula a curiosidade, a imaginação e a criatividade da criança.", category: "Cultura", img: "" },
        { title: "Ed. Ambiental", desc: "Formação de valores, conhecimentos e competências que contribuam para a conservação do meio ambiente.", category: "Meio Ambiente", img: "" }
    ],
    campanhas: [
        { title: "Natal em Ação", obj: "Arrecadar brinquedos e cestas básicas para promover um final de ano mais digno e feliz para as famílias cadastradas.", img: "/static/assets/campanha.png" },
        { title: "Dia das Crianças", obj: "Proporcionar um dia repleto de brincadeiras, lanches e presentes, garantindo o direito de brincar a centenas de crianças da favela.", img: "/static/assets/oficina.png" },
        { title: "Páscoa Solidária", obj: "Distribuir ovos de chocolate e realizar oficinas temáticas para reacender a esperança e o amor ao próximo.", img: "/static/assets/hero.png" }
    ]
};

const defaultComments = [
    { name: "Maria Clara", text: "Excelente iniciativa! Vocês estão mudando o bairro." },
    { name: "João Pedro", text: "Tenho muito orgulho de ver esse projeto crescer." }
];

function getCookie(name) {
    let cookieValue = null;

    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');

        for (let cookie of cookies) {
            cookie = cookie.trim();

            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }

    return cookieValue;
}

const API = {
    
    // 1. DADOS PRINCIPAIS DO SITE
   async getSiteData() {
    try {
        const responseHome = await fetch('/api/home/');
        const home = await responseHome.json();

        const responseProjetos = await fetch('/api/projetos/');
        const projetos = await responseProjetos.json();

        const responseCampanhas = await fetch('/api/campanhas/');
        const campanhas = await responseCampanhas.json();

        return {
            ...defaultData,
            home: home,
            projetos: projetos,
            campanhas: campanhas
        };

    } catch (error) {
        console.error("Erro ao carregar dados do site:", error);
        return defaultData;
    }
},

    async saveSiteData(payload) {
        return new Promise(resolve => {
            setTimeout(() => {
                // Aqui entraria: fetch('/api/atualizar', { method: 'POST', body: ... })
                localStorage.setItem('favela_AppDB', JSON.stringify(payload));
                resolve({ success: true });
            }, 300);
        });
    },

    // 2. ENVIO DE FORMULÁRIO DE CONTATO
    async submitContact(formData) {
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    const response = await fetch('/api/contato/criar/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
        },
        body: JSON.stringify(formData)
    });

    return await response.json();
},

    // 3. AUTENTICAÇÃO E LOGIN
    async login(username, password) {
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    const response = await fetch('/api/admin/login/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
        },
        body: JSON.stringify({ username, password })
    });

    return await response.json();
    },

   async logout() {
    const csrfToken = getCookie('csrftoken');

    const response = await fetch('/api/admin/logout/', {
        method: 'POST',
        headers: {
            'X-CSRFToken': csrfToken
        },
        credentials: 'same-origin'
    });

    return await response.json();
},

async checkAdminStatus() {
    const response = await fetch('/api/admin/status/');
    return await response.json();
    },

    // 4. COMENTÁRIOS E FEEDBACKS
    async getComments() {
        const response = await fetch('/api/comentarios/');
        return await response.json();
    },

    async submitComment(commentData) {
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    const response = await fetch('/api/comentarios/criar/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
        },
        body: JSON.stringify(commentData)
    });

    return await response.json();
},

async getDashboard() {
    const response = await fetch('/api/admin/dashboard/');
    return await response.json();
},

async getAdminContatos() {
    const response = await fetch('/api/admin/contatos/');
    return await response.json();
},

async deleteContato(id) {
    const csrfToken = getCookie('csrftoken');

    const response = await fetch(`/api/contatos/excluir/${id}/`, {
        method: 'DELETE',
        headers: {
            'X-CSRFToken': csrfToken
        },
        credentials: 'same-origin'
    });

    return await response.json();
},

async deleteComentario(id) {
    const csrfToken = getCookie('csrftoken');

    const response = await fetch(`/api/comentarios/excluir/${id}/`, {
        method: 'DELETE',
        headers: {
            'X-CSRFToken': csrfToken
        },
        credentials: 'same-origin'
    });

    return await response.json();
},

};

/* =========================================================================
   CORE DA APLICAÇÃO FRONT-END
   ========================================================================= */

let appData = null; // Variável global de estado

// Inicialização Assíncrona do App
async function initApp() {
    // Busca dados no "Banco" via API Service
    appData = await API.getSiteData();
    renderApp();
    loadComments();
}

async function saveData() {
    const btnSalvarList = document.querySelectorAll('.admin-section .btn-primary');
    btnSalvarList.forEach(btn => btn.innerText = "Salvando no BD...");

    await API.saveSiteData(appData);
    
    btnSalvarList.forEach(btn => btn.innerText = "Salvar Alterações");
    renderApp();
    alert("Dados salvos e sincronizados com a API com sucesso!");
}

/* Rendering Logic */
function renderApp() {
    // 1. Home Texts
    const dynHeroTitle = document.getElementById('dyn-hero-title');
    const dynHeroTeaser = document.getElementById('dyn-hero-teaser');
    const heroBg = document.getElementById('hero-section-bg');
    
    if(dynHeroTitle) dynHeroTitle.innerHTML = appData.home.title;
    if(dynHeroTeaser) dynHeroTeaser.innerHTML = appData.home.teaser;
    if(heroBg) heroBg.style.backgroundImage = `linear-gradient(to bottom, rgba(15, 76, 129, 0.7), rgba(15, 76, 129, 0.9)), url('${appData.home.heroImg}')`;

    // Admin Inputs
const editHeroTitle = document.getElementById('editHeroTitle');

if(editHeroTitle)
    editHeroTitle.value = appData.home.title.replace(/<br\s*[\/]?>/gi, " ");

const editHeroTeaser = document.getElementById('editHeroTeaser');

if(editHeroTeaser)
    editHeroTeaser.value = appData.home.teaser;

const editHeroImg = document.getElementById('editHeroImg');

if(editHeroImg)
    editHeroImg.value = "";

const editHeroImgAtual = document.getElementById('editHeroImgAtual');

if(editHeroImgAtual) {
    editHeroImgAtual.innerText = appData.home.heroImg
        ? `Imagem atual: ${appData.home.heroImg}`
        : "Sem imagem atual";
    }

    // 2. Projetos
    const projContainer = document.getElementById('projetos-container');
    const adminProjList = document.getElementById('admin-projetos-list');
    
    if(projContainer) projContainer.innerHTML = '';
    if(adminProjList) adminProjList.innerHTML = '';

    const badgeColors = ['badge-lilac', 'badge-yellow', 'badge-orange', 'badge-green'];
    const icons = ['bx-book', 'bx-book-open', 'bx-run', 'bx-music', 'bx-user-voice', 'bx-leaf'];

    appData.projetos.forEach((proj, index) => {
        const colorClass = badgeColors[index % badgeColors.length];
        const iconClass = icons[index % icons.length];
        
        let imgHtml = proj.img 
            ? `<img src="${proj.img}" alt="${proj.title}" class="project-img">` 
            : `<div class="placeholder-img" style="background:var(--color-primary);"><i class='bx ${iconClass}'></i></div>`;

        if(projContainer) {
            projContainer.innerHTML += `
                <div class="project-card fade-scroll visible" onclick="openProjectGallery(${index})" style="cursor:pointer;">
                    ${imgHtml}
                    <div class="project-info">
                        <div><span class="badge ${colorClass}">${proj.category || 'Geral'}</span></div>
                        <h3>${proj.title}</h3>
                        <p class="desc">${proj.desc}</p>
                    </div>
                </div>
            `;
        }

        if(adminProjList) {
            adminProjList.innerHTML += `
                <div class="admin-item-card">
                    <div class="admin-item-info">
                        <strong>${proj.title}</strong>
                        <span>${proj.category}</span>
                    </div>
                    <div class="admin-item-actions">
                        <button onclick="openProjectModal(${index})" title="Editar"><i class='bx bx-edit'></i></button>
                        <button onclick="deleteProject(${index})" class="del-btn" title="Excluir"><i class='bx bx-trash'></i></button>
                    </div>
                </div>
            `;
        }
    });

    // 3. Campanhas
    const campTitleInfo = document.getElementById('dyn-campanha-subtitle');
    const campContainer = document.getElementById('campanhas-container');
    const adminCampList = document.getElementById('admin-campanhas-list');
    
    if(campTitleInfo) campTitleInfo.innerText = appData.campanhasSubtitle || "Juntos fazemos a diferença nas datas especiais.";
    
    const editCampSub = document.getElementById('editCampanhasSubtitle');
    if(editCampSub) editCampSub.value = appData.campanhasSubtitle || "";

    if(campContainer) campContainer.innerHTML = '';
    if(adminCampList) adminCampList.innerHTML = '';

    appData.campanhas.forEach((camp, index) => {
        let isReverse = index % 2 !== 0 ? 'reverse' : '';
        let imgHtml = camp.img ? 
            `<img src="${camp.img}" class="campaign-img">` : 
            `<div class="placeholder-campaign kids-day"><i class='bx bx-party'></i></div>`;

        if(campContainer) {
            campContainer.innerHTML += `
                <div class="campaign-item ${isReverse} fade-scroll visible" onclick="openCampaignGallery(${index})" style="cursor:pointer;">
                    ${imgHtml}
                    <div class="campaign-text">
                        <h3>${camp.title}</h3>
                        <p class="obj"><strong>Objetivo:</strong> ${camp.obj}</p>
                        <a href="https://wa.me/5521989330529?text=Olá!%20Gostaria%20de%20participar%20da%20campanha%20do%20Favela%20em%20Ação!" target="_blank" class="btn btn-primary pulse-btn">PARTICIPE</a>
                    </div>
                </div>
            `;
        }

        if(adminCampList) {

    adminCampList.innerHTML += `
        <div class="admin-item-card" style="flex-direction:column; align-items:flex-start; gap:0.5rem;">

            <strong>${camp.title}</strong>

            <button
                onclick="deleteCampaign(${index})"
                style="
                    background:#EF4444;
                    color:white;
                    border:none;
                    padding:0.4rem 0.7rem;
                    border-radius:6px;
                    cursor:pointer;
                    margin-bottom:0.5rem;
                ">
                🗑️ Excluir Campanha
            </button>

            <input type="text" id="admin_camp_title_${index}" value="${camp.title}" style="width:100%; padding:0.5rem; border:1px solid #ccc; border-radius:4px;">

            <span>Objetivo:</span>

            <textarea id="admin_camp_obj_${index}" style="width:100%; padding:0.5rem; border:1px solid #ccc; border-radius:4px;" rows="2">${camp.obj}</textarea>

            <span>Imagem atual:</span>

            <small style="color:#64748B;">
                ${camp.img ? camp.img : 'Sem imagem atual'}
            </small>

            <span>Nova imagem:</span>

            <input
                type="file"
                id="admin_camp_img_${index}"
                accept="image/*"
                style="width:100%; padding:0.5rem; border:1px solid #ccc; border-radius:4px;"
            >
            <span>Fotos extras da galeria:</span>
            <input
            type="file"
            id="admin_camp_gallery_${index}"
            accept="image/*"
            multiple
            style="width:100%; padding:0.5rem; border:1px solid #ccc; border-radius:4px;"
            >
           <small style="color:#64748B;">Você pode selecionar até 10 imagens segurando CTRL.</small>
           <small style="color:#64748B; display:block; margin-top:0.3rem;">
            Formatos permitidos: JPG, PNG e WEBP • Máximo de 5MB por imagem.
           </small>

        </div>
    `;
        }
    });
}

// Comments Logic
async function loadComments() {
    const commentsList = document.getElementById('commentsList');
    if(!commentsList) return;
    
    const comments = await API.getComments();
    commentsList.innerHTML = '';
    
    comments.forEach(c => {
        commentsList.innerHTML += `
            <div style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; padding: 1rem;">
                <strong style="color:var(--color-yellow); display:block; margin-bottom:0.5rem;">${c.name}</strong>
                <p style="color:white; margin:0; line-height: 1.4;">"${c.text}"</p>
            </div>
        `;
    });
}

// Form Listeners
document.addEventListener('DOMContentLoaded', () => {

    initApp();

    API.checkAdminStatus().then(status => {
    const adminItem = document.getElementById('nav-item-admin');

    if (status.is_authenticated) {
        adminItem.style.display = 'block';
        loadDashboard();
    } else {
        adminItem.style.display = 'none';
    }
});

    // Modal de Login
    const adminTrigger = document.getElementById('admin-trigger');
    const modalLogin = document.getElementById('modal-login');
    const loginForm = document.getElementById('loginForm');
    
    if(adminTrigger) {
        adminTrigger.addEventListener('click', () => {
            modalLogin.classList.add('active');
            document.getElementById('loginError').style.display = 'none';
        });
    }

    window.closeLoginModal = () => {
        modalLogin.classList.remove('active');
        if(loginForm) loginForm.reset();
    };

    if(loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('loginBtn');
        const username = document.getElementById('adminUsername').value;
        const pass = document.getElementById('adminPassword').value;

        btn.innerText = "Verificando...";
        const response = await API.login(username, pass);

        if(response.success) {

        document.getElementById('nav-item-admin').style.display = 'block';

        loadDashboard();
        closeLoginModal();
        btn.innerText = "Entrar";
        const adminBtn = document.querySelector('.nav-btn[data-target="admin"]');
        if(adminBtn) adminBtn.click();

         } else {
            document.getElementById('loginError').style.display = 'block';
            btn.innerText = "Entrar";
        }
    });
}

    const commentForm = document.getElementById('commentForm');
    if(commentForm) {
        commentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('commentSubmitBtn');
            const originalBtn = btn.innerText;
            btn.innerText = "Enviando...";
            
            let cName = document.getElementById('commentName').value;
            let cText = document.getElementById('commentText').value;

            await API.submitComment({ name: cName, text: cText });
            
            commentForm.reset();
            btn.innerText = originalBtn;
            await loadComments();
        });
    }

    const contactForm = document.getElementById('contactForm');
    if(contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('contactSubmitBtn');
            const originalBtnText = btn.innerText;
            btn.innerText = "Registrando no BD...";

            let contactData = {
                name: document.getElementById('contactName').value,
                phone: document.getElementById('contactPhone').value,
                message: document.getElementById('contactMessage').value,
            };

            await API.submitContact(contactData);
            
            btn.innerText = "Sucesso!";
            btn.style.background = "var(--color-green)";
            
            setTimeout(() => {
                contactForm.reset();
                btn.innerText = originalBtnText;
                btn.style.background = ""; // reset
            }, 3000);
        });
    }

    /* --- Navigation Tabs Logic --- */
    const navButtons = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const innerNavTriggers = document.querySelectorAll('.nav-trigger');

    async function switchTab(targetId) {
    if (targetId === 'admin') {
        const status = await API.checkAdminStatus();

        if (!status.is_authenticated) {
            alert("Acesso restrito. Faça login para acessar o painel.");
            targetId = 'inicio';
        }
    }

    tabContents.forEach(tab => tab.classList.remove('active-tab'));
    navButtons.forEach(btn => btn.classList.remove('active'));

    const targetTab = document.getElementById(targetId);
    if (targetTab) targetTab.classList.add('active-tab');

    const targetBtn = document.querySelector(`.nav-btn[data-target="${targetId}"]`);
    if (targetBtn) targetBtn.classList.add('active');

    window.scrollTo(0, 0);
    initScrollAnimations();
}

    navButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
        await switchTab(btn.dataset.target);

        const navLinks = document.querySelector('.nav-links');
        if(navLinks && navLinks.classList.contains('show')) {
            navLinks.classList.remove('show');
        }
      });
    });

    innerNavTriggers.forEach(btn => {
    btn.addEventListener('click', async () => {
        await switchTab(btn.dataset.target);
      });
    });

    /* --- Admin Dashboard Tabs Logic --- */
    const adminTabBtns = document.querySelectorAll('.admin-tab-btn');
    const adminSections = document.querySelectorAll('.admin-section');
    adminTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {

        adminTabBtns.forEach(b => b.classList.remove('active'));
        adminSections.forEach(s => s.classList.remove('active'));

        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');

        if (btn.dataset.tab === 'admin-mensagens') {
            loadAdminMensagens();
        }

    });
});

    /* --- Mobile Menu Toggle --- */
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('show');
    });

    function initScrollAnimations() {
        // ... (já implementado, mantemos na renderização)
    }

});

async function loadDashboard() {
    const data = await API.getDashboard();

    document.getElementById('dashProjetos').innerText = data.projetos;
    document.getElementById('dashCampanhas').innerText = data.campanhas;
    document.getElementById('dashComentarios').innerText = data.comentarios;
    document.getElementById('dashContatos').innerText = data.contatos;
}

async function loadAdminMensagens() {
    const contatosList = document.getElementById('admin-contatos-list');
    const comentariosList = document.getElementById('admin-comentarios-list');

    if (!contatosList || !comentariosList) return;

    const contatos = await API.getAdminContatos();
    const comentarios = await API.getComments();

    contatosList.innerHTML = '';
    comentariosList.innerHTML = '';

    if (contatos.length === 0) {
        contatosList.innerHTML = '<p>Nenhuma mensagem recebida ainda.</p>';
    }

    contatos.forEach(c => {
    contatosList.innerHTML += `
        <div class="admin-item-card" style="flex-direction:column; align-items:flex-start;">
            <strong>${c.nome}</strong>

            <span><strong>Telefone:</strong> ${c.telefone}</span>

            <span><strong>Data:</strong> ${c.enviado_em}</span>

            <p><strong>Mensagem:</strong> ${c.mensagem}</p>

            <button
                onclick="deleteAdminContato(${c.id})"
                style="
                    background:#EF4444;
                    color:white;
                    padding:0.5rem 1rem;
                    border:none;
                    border-radius:6px;
                    cursor:pointer;
                    margin-top:0.5rem;
                ">
                🗑️ Excluir Contato
            </button>

        </div>
    `;
});

    if (comentarios.length === 0) {
        comentariosList.innerHTML = '<p>Nenhum comentário recebido ainda.</p>';
    }

    comentarios.forEach(c => {
        comentariosList.innerHTML += `
            <div class="admin-item-card" style="flex-direction:column; align-items:flex-start;">
                <strong>${c.name}</strong>
                <p>${c.text}</p>
                <button
                    onclick="deleteAdminComentario(${c.id})"
                    style="background:#EF4444; color:white; padding:0.5rem 1rem; border-radius:6px;">
                    🗑️ Excluir Comentário
                </button>
            </div>
        `;
    });
}

/* --- Global Admin Logic Exposed --- */
window.saveAdminTexts = async () => {
    const formData = new FormData();

    formData.append('title', document.getElementById('editHeroTitle').value);
    formData.append('teaser', document.getElementById('editHeroTeaser').value);

    const imgFile = document.getElementById('editHeroImg').files[0];

    if (imgFile) {
        formData.append('img', imgFile);
    }

    const csrfToken = getCookie('csrftoken');

    const response = await fetch('/api/home/salvar/', {
        method: 'POST',
        headers: {
            'X-CSRFToken': csrfToken
        },
        credentials: 'same-origin',
        body: formData
    });

    const result = await response.json();

    if (result.success) {
        appData.home = {
            title: result.title,
            teaser: result.teaser,
            heroImg: result.heroImg
        };

        renderApp();

        alert("Textos da Home salvos no banco com sucesso!");
    } else {
        alert("Erro ao salvar textos da Home.");
    }
};

window.saveAdminCampaigns = async () => {
    const csrfToken = getCookie('csrftoken');

    appData.campanhasSubtitle = document.getElementById('editCampanhasSubtitle').value;

    for (let index = 0; index < appData.campanhas.length; index++) {
        const camp = appData.campanhas[index];

        let formData = new FormData();

        if (camp.id) {
            formData.append('id', camp.id);
        }

        formData.append('title', document.getElementById(`admin_camp_title_${index}`).value);
        formData.append('obj', document.getElementById(`admin_camp_obj_${index}`).value);

        const imgFile = document.getElementById(`admin_camp_img_${index}`).files[0];
        if (imgFile) {
            formData.append('img', imgFile);
        }

        const galleryFiles = document.getElementById(`admin_camp_gallery_${index}`).files;

        if (galleryFiles.length > 10) {
        alert("Você pode enviar no máximo 10 fotos para a galeria.");
        return;
        }

for (let i = 0; i < galleryFiles.length; i++) {
    formData.append('gallery', galleryFiles[i]);
}

        const response = await fetch('/api/campanhas/salvar/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrfToken
            },
            credentials: 'same-origin',
            body: formData
        });

        const result = await response.json();

        if (!result.success) {
            showToast("Erro ao salvar uma campanha.", "error");
            return;
        }
    }

    appData = await API.getSiteData();
    renderApp();

    showToast("Campanhas salvas com sucesso!", "success");
};

window.deleteProject = async (index) => {
    const confirmar = confirm("Tem certeza que deseja excluir este projeto do banco de dados?");

    if (!confirmar) return;

    const projeto = appData.projetos[index];

    if (!projeto.id) {
        appData.projetos.splice(index, 1);
        renderApp();
        return;
    }

    const csrfToken = getCookie('csrftoken');

    const response = await fetch(`/api/projetos/excluir/${projeto.id}/`, {
        method: 'DELETE',
        headers: {
            'X-CSRFToken': csrfToken
        },
        credentials: 'same-origin'
    });

    const result = await response.json();

    if (result.success) {
        appData.projetos.splice(index, 1);
        renderApp();
        loadDashboard();
        alert("Projeto excluído com sucesso!");
    } else {
        alert("Erro ao excluir projeto.");
    }
};

window.openProjectModal = (index = -1) => {
    document.getElementById('modal-projeto').classList.add('active');
    document.getElementById('modal-project-index').value = index;

    if(index > -1) {
        let proj = appData.projetos[index];

        document.getElementById('modProjTitle').value = proj.title;
        document.getElementById('modProjDesc').value = proj.desc;
        document.getElementById('modProjCat').value = proj.category;

        // 🔥 NOVO (substitui o antigo value da imagem)
        document.getElementById('modProjImg').value = "";

        // 🔥 NOVO DA GALERIA
        document.getElementById('modProjGallery').value = "";

        document.getElementById('modProjImgAtual').innerText =
            proj.img ? `Imagem atual: ${proj.img}` : "Sem imagem atual";

    } else {
        document.getElementById('modProjTitle').value = "";
        document.getElementById('modProjDesc').value = "";
        document.getElementById('modProjCat').value = "";

        // 🔥 LIMPA O CAMPO DE UPLOAD
        document.getElementById('modProjImg').value = "";

        // 🔥 LIMPA GALERIA
        document.getElementById('modProjGallery').value = "";

        document.getElementById('modProjImgAtual').innerText = "";
    }
};

window.closeModal = () => {
    document.getElementById('modal-projeto').classList.remove('active');
};

window.saveProjectModal = async () => {
    let idx = parseInt(document.getElementById('modal-project-index').value);

    let formData = new FormData();

    if (idx > -1 && appData.projetos[idx].id) {
        formData.append('id', appData.projetos[idx].id);
    }

    formData.append('title', document.getElementById('modProjTitle').value);
    formData.append('desc', document.getElementById('modProjDesc').value);
    formData.append('category', document.getElementById('modProjCat').value);

    const imgFile = document.getElementById('modProjImg').files[0];
    if (imgFile) {
        formData.append('img', imgFile);
    }

    const galleryFiles = document.getElementById('modProjGallery').files;

if (galleryFiles.length > 10) {
    alert("Você pode enviar no máximo 10 fotos para a galeria.");
    return;
}

for (let i = 0; i < galleryFiles.length; i++) {
    formData.append('gallery', galleryFiles[i]);
}

    const csrfToken = getCookie('csrftoken');

    const response = await fetch('/api/projetos/salvar/', {
        method: 'POST',
        headers: {
            'X-CSRFToken': csrfToken
        },
        credentials: 'same-origin',
        body: formData
    });

    const result = await response.json();

    if (result.success) {
        closeModal();

        appData = await API.getSiteData();

        renderApp();
        loadDashboard();

        showToast("Projeto salvo com sucesso!", "success");
    } else {
        showToast(result.message || "Erro ao salvar projeto.", "error");
    }
};

window.resetFactoryData = () => {
    if(confirm("CUIDADO! Isso irá resetar todos os dados do seu App local. Quer continuar?")) {
        localStorage.clear();
        location.reload();
    }
};

window.logoutAdmin = async () => {
    if(confirm("Deseja realmente sair do painel do administrador?")) {
        const response = await API.logout();

        if (response.success) {
            document.getElementById('nav-item-admin').style.display = 'none';

            const homeBtn = document.querySelector('.nav-btn[data-target="inicio"]');
            if(homeBtn) homeBtn.click();
        } else {
            alert("Erro ao sair. Tente novamente.");
        }
    }
};

window.addNewCampaign = () => {
    appData.campanhas.push({
        id: null,
        title: "Nova Campanha",
        obj: "Descreva o objetivo da campanha aqui.",
        img: ""
    });

    renderApp();

    alert("Nova campanha adicionada. Preencha os dados e clique em Salvar Alterações de Campanhas.");
};

window.deleteCampaign = async (index) => {

    const confirmar = confirm("Deseja realmente excluir esta campanha?");

    if (!confirmar) return;

    const camp = appData.campanhas[index];

    if (!camp.id) {
        appData.campanhas.splice(index, 1);
        renderApp();
        return;
    }

    const csrfToken = getCookie('csrftoken');

    const response = await fetch(`/api/campanhas/excluir/${camp.id}/`, {
        method: 'DELETE',
        headers: {
            'X-CSRFToken': csrfToken
        },
        credentials: 'same-origin'
    });

    const result = await response.json();

    if (result.success) {
        appData.campanhas.splice(index, 1);
        renderApp();
        alert("Campanha excluída com sucesso!");
    } else {
        alert("Erro ao excluir campanha.");
    }
};

window.deleteAdminComentario = async (id) => {
    const confirmar = confirm("Deseja realmente excluir este comentário?");

    if (!confirmar) return;

    const result = await API.deleteComentario(id);

    if (result.success) {
        await loadComments();
        await loadAdminMensagens();
        await loadDashboard();

        alert("Comentário excluído com sucesso!");
    } else {
        alert("Erro ao excluir comentário.");
    }
};

window.openProjectGallery = function(index) {
    const projeto = appData.projetos[index];

    document.getElementById('galeriaProjetoTitulo').innerText = projeto.title;
    document.getElementById('galeriaProjetoCategoria').innerText = projeto.category || "Geral";
    document.getElementById('galeriaProjetoDescricao').innerText = projeto.desc;

    const fotosContainer = document.getElementById('galeriaProjetoFotos');
    fotosContainer.innerHTML = "";

    const fotos = [];

    if (projeto.img) {
        fotos.push(projeto.img);
    }

    if (projeto.gallery && projeto.gallery.length > 0) {
        fotos.push(...projeto.gallery);
    }
    fotosGaleriaAtual = fotos;

    if (fotos.length === 0) {
        fotosContainer.innerHTML = "<p>Este projeto ainda não possui fotos.</p>";
    } else {
        fotos.forEach((foto, index) => {
            fotosContainer.innerHTML += `
                <img
                   src="${foto}"
                   alt="${projeto.title}"
                   onclick="abrirFotoAmpliada(${index})"
                   style="width:100%; height:180px; object-fit:cover; border-radius:12px; cursor:pointer;"
                >
            `;
        });
    }

    document.getElementById('modal-galeria-projeto').classList.add('active');
};

window.closeProjectGallery = function() {
    document.getElementById('modal-galeria-projeto').classList.remove('active');
};

let fotosGaleriaAtual = [];
let fotoAtualIndex = 0;

window.abrirFotoAmpliada = function(index) {
    fotoAtualIndex = index;

    document.getElementById('fotoAmpliadaImg').src = fotosGaleriaAtual[fotoAtualIndex];
    document.getElementById('modal-foto-ampliada').classList.add('active');
};

window.closeFotoAmpliada = function() {
    document.getElementById('modal-foto-ampliada').classList.remove('active');
};

window.proximaFoto = function() {
    if (fotosGaleriaAtual.length === 0) return;

    fotoAtualIndex++;

    if (fotoAtualIndex >= fotosGaleriaAtual.length) {
        fotoAtualIndex = 0;
    }

    document.getElementById('fotoAmpliadaImg').src = fotosGaleriaAtual[fotoAtualIndex];
};

window.fotoAnterior = function() {
    if (fotosGaleriaAtual.length === 0) return;

    fotoAtualIndex--;

    if (fotoAtualIndex < 0) {
        fotoAtualIndex = fotosGaleriaAtual.length - 1;
    }

    document.getElementById('fotoAmpliadaImg').src = fotosGaleriaAtual[fotoAtualIndex];
};

window.openCampaignGallery = function(index) {
    const campanha = appData.campanhas[index];

    document.getElementById('galeriaCampanhaTitulo').innerText = campanha.title;
    document.getElementById('galeriaCampanhaObjetivo').innerText = campanha.obj;

    const fotosContainer = document.getElementById('galeriaCampanhaFotos');
    fotosContainer.innerHTML = "";

    const fotos = [];

    if (campanha.img) {
        fotos.push(campanha.img);
    }

    if (campanha.gallery && campanha.gallery.length > 0) {
        fotos.push(...campanha.gallery);
    }

    fotosGaleriaAtual = fotos;

    if (fotos.length === 0) {
        fotosContainer.innerHTML = "<p>Esta campanha ainda não possui fotos.</p>";
    } else {
        fotos.forEach((foto, index) => {
            fotosContainer.innerHTML += `
                <img
                    src="${foto}"
                    alt="${campanha.title}"
                    onclick="abrirFotoAmpliada(${index})"
                    style="width:100%; height:180px; object-fit:cover; border-radius:12px; cursor:pointer;"
                >
            `;
        });
    }

    document.getElementById('modal-galeria-campanha').classList.add('active');
};

window.closeCampaignGallery = function() {
    document.getElementById('modal-galeria-campanha').classList.remove('active');
};

window.openDonationModal = function() {
    document.getElementById('modal-doacao').classList.add('active');
};

window.closeDonationModal = function() {
    document.getElementById('modal-doacao').classList.remove('active');
};

window.copyPixKey = function() {
    const pixKey = document.getElementById('pixKey').innerText;

    navigator.clipboard.writeText(pixKey).then(() => {
        alert("Chave Pix copiada com sucesso!");
    }).catch(() => {
        alert("Não foi possível copiar automaticamente. Copie manualmente a chave.");
    });
};

window.deleteAdminContato = async (id) => {
    const confirmar = confirm("Deseja realmente excluir este contato?");

    if (!confirmar) return;

    const result = await API.deleteContato(id);

    if (result.success) {
        await loadAdminMensagens();
        await loadDashboard();

        alert("Contato excluído com sucesso!");
    } else {
        alert("Erro ao excluir contato.");
    }
};

window.showToast = function(message, type = "success") {
    const container = document.getElementById("toast-container");

    if (!container) return;

    const toast = document.createElement("div");

    toast.className = `toast ${type}`;
    toast.innerText = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
};

window.openHistoriaModal = function() {
    document.getElementById('modal-historia').classList.add('active');
};

window.closeHistoriaModal = function() {
    document.getElementById('modal-historia').classList.remove('active');
};

window.openParceirosModal = function() {
    document.getElementById('modal-parceiros').classList.add('active');
};

window.closeParceirosModal = function() {
    document.getElementById('modal-parceiros').classList.remove('active');
};

window.openApoioModal = function() {
    document.getElementById('modal-apoio').classList.add('active');
};

window.closeApoioModal = function() {
    document.getElementById('modal-apoio').classList.remove('active');
};

window.openMidiaModal = function() {
    document.getElementById('modal-midia').classList.add('active');
};

window.closeMidiaModal = function() {
    document.getElementById('modal-midia').classList.remove('active');
};