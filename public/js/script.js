document.addEventListener('DOMContentLoaded', () => {
  const btnLogin = document.getElementById('btnLogin');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalFechar = document.getElementById('modalFechar');

  const formLogin = document.getElementById('formLogin');
  const formCadastro = document.getElementById('formCadastro');

  const irParaCadastro = document.getElementById('irParaCadastro');
  const irParaLogin = document.getElementById('irParaLogin');

  // Abrir modal
  btnLogin.addEventListener('click', (e) => {
    e.preventDefault();
    modalOverlay.classList.add('ativo');
  });

  // Fechar modal (botão X)
  modalFechar.addEventListener('click', () => {
    fecharModal();
  });

  // Alternar para cadastro
  irParaCadastro.addEventListener('click', (e) => {
    e.preventDefault();
    formLogin.hidden = true;
    formCadastro.hidden = false;
  });

  // Alternar para login
  irParaLogin.addEventListener('click', (e) => {
    e.preventDefault();
    formCadastro.hidden = true;
    formLogin.hidden = false;
  });

  function fecharModal() {
    modalOverlay.classList.remove('ativo');
    // sempre volta pro login da próxima vez que abrir
    formCadastro.hidden = true;
    formLogin.hidden = false;
  }
});


  const btnAdd = document.getElementById('btnAdd');
  const modalMusicaOverlay = document.getElementById('modalMusicaOverlay');
  const modalMusicaFechar = document.getElementById('modalMusicaFechar');
  const formMusica = document.getElementById('formMusica');
  const cardsContainer = document.getElementById('cardsContainer');
  const quantidadeSpan = document.querySelector('.quantidade');

  const estrelas = document.querySelectorAll('#modalEstrelas .estrela');
  const inputNota = document.getElementById('musicaNota');

  let contadorMusicas = document.querySelectorAll('.card').length;

  // Abrir modal de música
  btnAdd.addEventListener('click', (e) => {
    e.preventDefault();
    modalMusicaOverlay.classList.add('ativo');
  });

  // Fechar modal de música
  modalMusicaFechar.addEventListener('click', fecharModalMusica);

  modalMusicaOverlay.addEventListener('click', (e) => {
    if (e.target === modalMusicaOverlay) fecharModalMusica();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalMusicaOverlay.classList.contains('ativo')) {
      fecharModalMusica();
    }
  });

  function fecharModalMusica() {
    modalMusicaOverlay.classList.remove('ativo');
    formMusica.reset();
    resetarEstrelas();
  }

  // Seleção de estrelas
  estrelas.forEach((estrela) => {
    estrela.addEventListener('click', () => {
      const valor = parseInt(estrela.dataset.valor);
      inputNota.value = valor;
      pintarEstrelas(valor);
    });
  });

  function pintarEstrelas(valor) {
    estrelas.forEach((estrela) => {
      estrela.classList.toggle('ativa', parseInt(estrela.dataset.valor) <= valor);
    });
  }

  function resetarEstrelas() {
    inputNota.value = 0;
    estrelas.forEach((estrela) => estrela.classList.remove('ativa'));
  }

  // Envio do formulário -> cria o card
  formMusica.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = document.getElementById('musicaNome').value.trim();
    const artista = document.getElementById('musicaArtista').value.trim();
    const genero = document.getElementById('musicaGenero').value.trim();
    const nota = parseInt(inputNota.value) || 0;

    if (!nome || !artista || !genero || nota === 0) {
      alert('Preencha todos os campos e selecione uma nota.');
      return;
    }

    contadorMusicas++;

    const card = document.createElement('article');
    card.classList.add('card');

    card.innerHTML = `
      <div class="capa">
        <span>${String(contadorMusicas).padStart(2, '0')}</span>
      </div>

      <div class="card-info">
        <h3>${nome}</h3>
        <p>${artista}</p>

        <div class="card-footer">
          <span class="genero">${genero}</span>
          <span class="nota">${'★'.repeat(nota)}${'☆'.repeat(5 - nota)}</span>
        </div>
      </div>
    `;

    cardsContainer.appendChild(card);

    if (quantidadeSpan) {
      quantidadeSpan.textContent = `${contadorMusicas} músicas`;
    }

    fecharModalMusica();
  });