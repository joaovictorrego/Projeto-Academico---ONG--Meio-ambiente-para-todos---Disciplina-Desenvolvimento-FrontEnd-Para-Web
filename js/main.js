/* ==========================================================================
   Arquivo JavaScript Modular - ONG Meio Ambiente para Todos
   ==========================================================================
   Organização:
   1. Funções Utilitárias Globais
   2. Módulo de Menu Mobile
   3. Módulo de Templates (Página Projetos)
   4. Módulo de Validação (Página Cadastro)
   5. Módulo de Roteamento SPA (Single Page Application)
   6. Inicialização
   ========================================================================== */

// --- 1. Funções Utilitárias Globais ---

/**
 * Função para copiar a chave PIX (necessária na página de projetos).
 * Adicionada ao 'window' para ser acessível pelo HTML injetado.
 */
window.copyToClipboard = function (text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Chave PIX copiada para a área de transferência!');
    }).catch(() => {
        alert('Erro ao copiar. Tente novamente.');
    });
}

// --- 2. Módulo de Menu Mobile ---

/**
 * Inicializa a funcionalidade do menu hamburguer.
 * É chamado uma vez no carregamento inicial.
 */
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    if (!menuToggle || !navMenu) return;

    menuToggle.addEventListener('click', function () {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Fechar menu ao clicar em um link (necessário para SPA)
    navMenu.addEventListener('click', function (e) {
        if (e.target.tagName === 'A') {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// --- 3. Módulo de Templates (Página Projetos) ---

/**
 * REQUISITO: Criar sistema de templates JavaScript.
 *
 * Esta seção define os dados e a lógica para renderizar
 * dinamicamente os cards de projeto.
 */

// Dados dos projetos (separados do HTML)
const projectData = [
    {
        title: '1. Projeto Hortas da Cidadania',
        badge: 'Em Andamento',
        what: 'Implementamos hortas urbanas comunitárias em áreas periféricas e espaços públicos ociosos. Mais do que apenas plantar alimentos, criamos espaços de convivência, educação ambiental e fortalecemos a segurança alimentar das famílias locais.',
        focus: 'Ensinar técnicas de cultivo orgânico, promover o trabalho coletivo e gerar autonomia para a comunidade.'
    },
    {
        title: '2. Projeto Trilhas Acessíveis',
        badge: 'Em Andamento',
        what: 'Acreditamos que a natureza não deve ter barreiras. Este projeto mapeia, adapta e cria trilhas em parques e áreas de preservação para que pessoas com deficiência (PCDs), idosos e pessoas com mobilidade reduzida possam ter uma experiência segura e imersiva na natureza.',
        focus: 'Parceria com gestores de parques, instalação de sinalização tátil, pisos adequados e promoção de visitas guiadas inclusivas.'
    },
    {
        title: '3. Projeto Vozes do Clima',
        badge: 'Em Andamento',
        what: 'Levamos a educação ambiental para onde ela é mais necessária. Realizamos oficinas em escolas públicas, associações de bairro e centros comunitários, capacitando líderes locais para que possam defender seus próprios direitos ambientais.',
        focus: 'Combater o racismo ambiental dando ferramentas e voz às comunidades mais afetadas pela poluição, falta de saneamento e eventos climáticos extremos.'
    }
];

/**
 * Gera o HTML de um único card de projeto.
 * @param {object} project - O objeto com dados do projeto.
 * @returns {string} O HTML do card.
 */
function createProjectCardTemplate(project) {
    return `
        <article class="card card-success">
            <div class="card-header">
                <h3 class="card-title">${project.title}</h3>
                <span class="badge badge-success">${project.badge}</span>
            </div>
            <div class="card-body">
                <p><strong>O que é?</strong> ${project.what}</p>
                <p><strong>Nosso Foco:</strong> ${project.focus}</p>
            </div>
            <div class="card-footer">
                <a href="#" class="btn btn-primary btn-sm">Saiba Mais</a>
            </div>
        </article>
    `;
}

/**
 * Chamado após a página 'projetos.html' ser carregada.
 * Substitui os cards estáticos pelos cards gerados via template.
 */
function initProjetosPage() {
    const container = document.querySelector('#projetos-destaque .card-container');
    if (!container) return;

    // Limpa os cards estáticos (se houver)
    container.innerHTML = '';

    // Gera e insere os cards dinamicamente
    projectData.forEach(project => {
        const cardHtml = createProjectCardTemplate(project);
        container.insertAdjacentHTML('beforeend', cardHtml);
    });
}

// --- 4. Módulo de Validação (Página Cadastro) ---

/**
 * REQUISITO: Sistema de verificação de consistência de dados em formulários.
 *
 * Esta seção implementa a validação em tempo real e no envio
 * do formulário de cadastro.
 */

/**
 * Chamado após a página 'cadastro.html' ser carregada.
 * Anexa os listeners de validação ao formulário.
 */
function initCadastroPage() {
    const form = document.querySelector('.form-container');
    if (!form) return;

    // Remove o listener de submit original do arquivo cadastro.html (que foi limpo)
    // e anexa um novo, mais robusto.
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const inputs = form.querySelectorAll('input[required], select[required]');
        let isFormValid = true;

        // Valida todos os campos
        inputs.forEach(field => {
            if (!validateField(field)) {
                isFormValid = false;
            }
        });

        if (isFormValid) {
            // Se válido, exibe a mensagem de sucesso
            document.getElementById('successMessage').style.display = 'block';
            form.style.display = 'none';
            window.scrollTo(0, 0); // Rola para o topo para ver a msg
        }
    });

    // Adiciona validação em tempo real (ao digitar)
    const inputs = form.querySelectorAll('input[required], select[required]');
    inputs.forEach(input => {
        // 'input' é melhor que 'blur' para feedback imediato
        input.addEventListener('input', () => {
            validateField(input);
        });
    });

    // Lógica para o botão 'Limpar'
    const resetButton = form.querySelector('button[type="reset"]');
    if(resetButton) {
        resetButton.addEventListener('click', () => {
            // Limpa também as mensagens de erro
            inputs.forEach(input => {
                const errorSpan = document.getElementById(input.id + 'Error');
                if (errorSpan) {
                    errorSpan.textContent = '';
                }
                input.style.borderColor = ''; // Reseta a borda
            });
        });
    }
}

/**
 * Valida um campo individual do formulário.
 * @param {HTMLInputElement|HTMLSelectElement} field - O campo a ser validado.
 * @returns {boolean} - true se o campo for válido, false se for inválido.
 */
function validateField(field) {
    const errorSpan = document.getElementById(field.id + 'Error');
    if (!errorSpan) return true; // Se não houver span de erro, não faz nada

    let message = '';
    const validity = field.validity; // API de Validação do HTML5

    if (!validity.valid) {
        if (validity.valueMissing) {
            message = 'Este campo é obrigatório.';
        } else if (validity.typeMismatch) {
            message = 'Por favor, insira um e-mail válido.';
        } else if (validity.patternMismatch) {
            // Puxa a mensagem de erro customizada do atributo 'title'
            message = field.title || 'Formato inválido.';
        } else if (validity.tooShort) {
            message = `Deve ter no mínimo ${field.minLength} caracteres.`;
        } else {
            message = 'Valor inválido.';
        }
    }

    // Exibe a mensagem de erro e estiliza o campo
    errorSpan.textContent = message;
    field.style.borderColor = message ? 'var(--color-error)' : 'var(--color-success)';

    return validity.valid;
}


// --- 5. Módulo de Roteamento SPA (Single Page Application) ---

/**
 * REQUISITO: Implementar sistema de Single Page Application (SPA) básico.
 *
 * Gerencia a navegação entre as páginas sem recarregar o navegador.
 */
function initSPARouter() {
    const mainContent = document.getElementById('main-content');
    const navMenu = document.getElementById('navMenu');

    // Armazena o conteúdo original da página inicial
    const homeContent = {
        html: mainContent.innerHTML,
        class: mainContent.className
    };
    
    // Salva o estado inicial no histórico
    history.replaceState({ path: location.pathname }, '', location.pathname);

    /**
     * Carrega o conteúdo da página via fetch.
     * @param {string} path - O URL da página a ser carregada.
     */
    async function loadPage(path) {
        // Se for a página inicial, restaura o conteúdo original
        if (path === '/' || path.endsWith('index.html')) {
            mainContent.innerHTML = homeContent.html;
            mainContent.className = homeContent.class;
            updateActiveLink('index.html');
            return;
        }

        try {
            const response = await fetch(path);
            if (!response.ok) throw new Error('Página não encontrada');

            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const newMain = doc.querySelector('main');

            if (newMain) {
                // Remove scripts inline dos arquivos HTML buscados
                // para evitar que sejam executados ou causem erros
                newMain.querySelectorAll('script').forEach(script => script.remove());

                // Injeta o novo conteúdo
                mainContent.innerHTML = newMain.innerHTML;
                mainContent.className = newMain.className; // Atualiza a classe (grid-layout vs full-width)

                // Atualiza o link ativo na navegação
                updateActiveLink(path);
                window.scrollTo(0, 0); // Rola para o topo

                // === PÓS-CARREGAMENTO ===
                // Executa os scripts específicos da página carregada
                if (path.endsWith('projetos.html')) {
                    initProjetosPage();
                } else if (path.endsWith('cadastro.html')) {
                    initCadastroPage();
                }
            }

        } catch (error) {
            console.error('Erro ao carregar página:', error);
            mainContent.innerHTML = '<h1>Erro 404: Página não encontrada.</h1>';
        }
    }

    /**
     * Atualiza a classe '.active' no link de navegação correto.
     * @param {string} path - O URL da página ativa.
     */
    function updateActiveLink(path) {
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            // Compara o href do link com o path da página carregada
            if (link.getAttribute('href') === path || (path === '/' && link.getAttribute('href') === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Intercepta cliques nos links de navegação
    navMenu.addEventListener('click', function (e) {
        const link = e.target.closest('a');
        if (link) {
            e.preventDefault(); // Previne o recarregamento da página
            const path = link.getAttribute('href');
            
            // Se não for a página atual, carrega e atualiza o histórico
            if (location.pathname !== path) {
                history.pushState({ path }, '', path);
                loadPage(path);
            }
        }
    });

    // Gerencia os botões "Voltar" e "Avançar" do navegador
    window.addEventListener('popstate', function (e) {
        if (e.state && e.state.path) {
            loadPage(e.state.path);
        }
    });
}

// --- 6. Inicialização ---

/**
 * Aguarda o DOM estar pronto para executar os inicializadores.
 */
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu(); // Sempre ativo
    initSPARouter();  // Gerencia a navegação

    // Verifica a página inicial e executa scripts se necessário
    // (Nenhum para a index.html no momento)
});