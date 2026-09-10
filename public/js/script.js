document.addEventListener("DOMContentLoaded", () => {
  const btnLogin = document.getElementById("btnLogin");
  const modalOverlay = document.getElementById("modalOverlay");
  const modalFechar = document.getElementById("modalFechar");

  const formLogin = document.getElementById("formLogin");
  const formCadastro = document.getElementById("formCadastro");

  const irParaCadastro = document.getElementById("irParaCadastro");
  const irParaLogin = document.getElementById("irParaLogin");

  // Abrir modal
  btnLogin.addEventListener("click", (e) => {
    e.preventDefault();
    modalOverlay.classList.add("ativo");
  });

  // Fechar modal (botão X)
  modalFechar.addEventListener("click", () => {
    fecharModal();
  });

  // Alternar para cadastro
  irParaCadastro.addEventListener("click", (e) => {
    e.preventDefault();
    formLogin.hidden = true;
    formCadastro.hidden = false;
  });

  // Alternar para login
  irParaLogin.addEventListener("click", (e) => {
    e.preventDefault();
    formCadastro.hidden = true;
    formLogin.hidden = false;
  });

  function fecharModal() {
    modalOverlay.classList.remove("ativo");
    // sempre volta pro login da próxima vez que abrir
    formCadastro.hidden = true;
    formLogin.hidden = false;
  }
});

const btnAdd = document.getElementById("btnAdd");
const modalMusicaOverlay = document.getElementById("modalMusicaOverlay");
const modalMusicaFechar = document.getElementById("modalMusicaFechar");
const formMusica = document.getElementById("formMusica");
const cardsContainer = document.getElementById("cardsContainer");
const quantidadeSpan = document.querySelector(".quantidade");

// detalhes/edição/exclusão
const modalDetalheOverlay = document.getElementById("modalDetalheOverlay");
const modalDetalheFechar = document.getElementById("modalDetalheFechar");

const detalheView = document.getElementById("detalheView");
const detalheNome = document.getElementById("detalheNome");
const detalheArtista = document.getElementById("detalheArtista");
const detalheGenero = document.getElementById("detalheGenero");
const detalheNota = document.getElementById("detalheNota");

const btnEditarMusica = document.getElementById("btnEditarMusica");
const btnExcluirMusica = document.getElementById("btnExcluirMusica");

const formEditarMusica = document.getElementById("formEditarMusica");
const editNome = document.getElementById("editNome");
const editArtista = document.getElementById("editArtista");
const editGenero = document.getElementById("editGenero");
const editNota = document.getElementById("editNota");
const editEstrelasEls = document.querySelectorAll("#editEstrelas .estrela");
const btnCancelarEdicao = document.getElementById("btnCancelarEdicao");

let musicaAtual = null;

const estrelas = document.querySelectorAll("#modalEstrelas .estrela");
const inputNota = document.getElementById("musicaNota");

let contadorMusicas = document.querySelectorAll(".musica").length;


btnAdd.addEventListener("click", (e) => {
  e.preventDefault();
  modalMusicaOverlay.classList.add("ativo");
});


modalMusicaFechar.addEventListener("click", fecharModalMusica);

modalMusicaOverlay.addEventListener("click", (e) => {
  if (e.target === modalMusicaOverlay) fecharModalMusica();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modalMusicaOverlay.classList.contains("ativo")) {
    fecharModalMusica();
  }
});

function fecharModalMusica() {
  modalMusicaOverlay.classList.remove("ativo");
  formMusica.reset();
  resetarEstrelas();
}


estrelas.forEach((estrela) => {
  estrela.addEventListener("click", () => {
    const valor = parseInt(estrela.dataset.valor);
    inputNota.value = valor;
    pintarEstrelas(valor);
  });
});

function pintarEstrelas(valor) {
  estrelas.forEach((estrela) => {
    estrela.classList.toggle("ativa", parseInt(estrela.dataset.valor) <= valor);
  });
}

function resetarEstrelas() {
  inputNota.value = 0;
  estrelas.forEach((estrela) => estrela.classList.remove("ativa"));
}

// cria o card
formMusica.addEventListener("submit", (e) => {
  e.preventDefault();

  const nome = document.getElementById("musicaNome").value.trim();
  const artista = document.getElementById("musicaArtista").value.trim();
  const genero = document.getElementById("musicaGenero").value.trim();
  const nota = parseInt(inputNota.value) || 0;

  if (!nome || !artista || !genero || nota === 0) {
    alert("Preencha todos os campos e selecione uma nota.");
    return;
  }

  contadorMusicas++;

      contadorMusicas++;

    const musica = document.createElement('article');
    musica.classList.add('musica');
    musica.dataset.id = contadorMusicas;
    musica.dataset.nome = nome;
    musica.dataset.artista = artista;
    musica.dataset.genero = genero;
    musica.dataset.nota = nota;

    musica.innerHTML = `
      <div class="musica-capa">
        <span>${String(contadorMusicas).padStart(2, '0')}</span>
      </div>

      <div class="musica-info">
        <h3>${nome}</h3>
        <p>${artista}</p>
      </div>

      <span class="musica-genero">${genero}</span>
      <span class="musica-nota">${'★'.repeat(nota)}${'☆'.repeat(5 - nota)}</span>

      <button class="musica-excluir" data-acao="excluir" aria-label="Excluir música" type="button">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 6h18" stroke-linecap="round"/>
          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke-linecap="round"/>
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke-linecap="round"/>
          <path d="M10 11v6M14 11v6" stroke-linecap="round"/>
        </svg>
      </button>
    `;

    cardsContainer.appendChild(musica);

  if (quantidadeSpan) {
    quantidadeSpan.textContent = `${contadorMusicas} músicas`;
  }

  fecharModalMusica();
});


  function estrelasParaTexto(nota) {
    return '★'.repeat(nota) + '☆'.repeat(5 - nota);
  }

  cardsContainer.addEventListener('click', (e) => {
    const botaoExcluir = e.target.closest('.musica-excluir');
    const linha = e.target.closest('.musica');

    if (!linha) return;

    if (botaoExcluir) {
      excluirMusica(linha);
      return;
    }

    abrirDetalhes(linha);
  });

  function abrirDetalhes(linha) {
    musicaAtual = linha;

    detalheNome.textContent = linha.dataset.nome;
    detalheArtista.textContent = linha.dataset.artista;
    detalheGenero.textContent = linha.dataset.genero;
    detalheNota.textContent = estrelasParaTexto(parseInt(linha.dataset.nota));

    detalheView.hidden = false;
    formEditarMusica.hidden = true;

    modalDetalheOverlay.classList.add('ativo');
  }

  function fecharModalDetalhe() {
    modalDetalheOverlay.classList.remove('ativo');
    musicaAtual = null;
  }

  modalDetalheFechar.addEventListener('click', fecharModalDetalhe);

  modalDetalheOverlay.addEventListener('click', (e) => {
    if (e.target === modalDetalheOverlay) fecharModalDetalhe();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalDetalheOverlay.classList.contains('ativo')) {
      fecharModalDetalhe();
    }
  });

  function excluirMusica(linha) {
    const confirmar = confirm(`Remover "${linha.dataset.nome}" da sua coleção?`);
    if (!confirmar) return;

    linha.remove();

    const total = document.querySelectorAll('.musica').length;
    if (quantidadeSpan) quantidadeSpan.textContent = `${total} músicas`;

    fecharModalDetalhe();
  }

  btnExcluirMusica.addEventListener('click', () => {
    if (musicaAtual) excluirMusica(musicaAtual);
  });


  btnEditarMusica.addEventListener('click', () => {
    if (!musicaAtual) return;

    editNome.value = musicaAtual.dataset.nome;
    editArtista.value = musicaAtual.dataset.artista;
    editGenero.value = musicaAtual.dataset.genero;
    editNota.value = musicaAtual.dataset.nota;

    pintarEstrelasEdicao(parseInt(musicaAtual.dataset.nota));

    detalheView.hidden = true;
    formEditarMusica.hidden = false;
  });

  btnCancelarEdicao.addEventListener('click', () => {
    detalheView.hidden = false;
    formEditarMusica.hidden = true;
  });

  editEstrelasEls.forEach((estrela) => {
    estrela.addEventListener('click', () => {
      const valor = parseInt(estrela.dataset.valor);
      editNota.value = valor;
      pintarEstrelasEdicao(valor);
    });
  });

  function pintarEstrelasEdicao(valor) {
    editEstrelasEls.forEach((estrela) => {
      estrela.classList.toggle('ativa', parseInt(estrela.dataset.valor) <= valor);
    });
  }

  formEditarMusica.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!musicaAtual) return;

    const nome = editNome.value.trim();
    const artista = editArtista.value.trim();
    const genero = editGenero.value.trim();
    const nota = parseInt(editNota.value) || 0;

    if (!nome || !artista || !genero || nota === 0) {
      alert('Preencha todos os campos e selecione uma nota.');
      return;
    }

    musicaAtual.dataset.nome = nome;
    musicaAtual.dataset.artista = artista;
    musicaAtual.dataset.genero = genero;
    musicaAtual.dataset.nota = nota;

    musicaAtual.querySelector('.musica-info h3').textContent = nome;
    musicaAtual.querySelector('.musica-info p').textContent = artista;
    musicaAtual.querySelector('.musica-genero').textContent = genero;
    musicaAtual.querySelector('.musica-nota').textContent = estrelasParaTexto(nota);

    abrirDetalhes(musicaAtual);
  });
