document.addEventListener('DOMContentLoaded', () => {

  // ESTADO DE LOGIN
  function obterUsuarioLogado() {
    var dados = localStorage.getItem('musiclog_usuario');
    return dados ? JSON.parse(dados) : null;
  }

  function salvarUsuarioLogado(usuario) {
    localStorage.setItem('musiclog_usuario', JSON.stringify(usuario));
  }

  function sairDaConta() {
    localStorage.removeItem('musiclog_usuario');
    atualizarInterfaceLogin();
    carregarMusicas();
  }

  // ELEMENTOS DO HEADER
  const btnLogin = document.getElementById('btnLogin');
  const perfilContainer = document.getElementById('perfilContainer');
  const btnPerfil = document.getElementById('btnPerfil');
  const perfilMenu = document.getElementById('perfilMenu');
  const perfilInicial = document.getElementById('perfilInicial');
  const perfilNome = document.getElementById('perfilNome');
  const btnSair = document.getElementById('btnSair');
  const nomeUsuarioSpan = document.getElementById('nomeUsuario');

  function atualizarInterfaceLogin() {
    var usuario = obterUsuarioLogado();

    if (usuario) {
      btnLogin.hidden = true;
      perfilContainer.hidden = false;

      perfilInicial.textContent = usuario.nome.charAt(0).toUpperCase();
      perfilNome.textContent = usuario.nome;
      nomeUsuarioSpan.textContent = usuario.nome;
    } else {
      btnLogin.hidden = false;
      perfilContainer.hidden = true;
      perfilMenu.hidden = true;

      nomeUsuarioSpan.textContent = 'Pessoa';
    }
  }

  btnPerfil.addEventListener('click', () => {
    perfilMenu.hidden = !perfilMenu.hidden;
  });

  document.addEventListener('click', (e) => {
    if (!perfilContainer.contains(e.target)) {
      perfilMenu.hidden = true;
    }
  });

  btnSair.addEventListener('click', () => {
    perfilMenu.hidden = true;
    sairDaConta();
  });


  // MODAL LOGIN/CADASTRO
  const modalOverlay = document.getElementById('modalOverlay');
  const modalFechar = document.getElementById('modalFechar');
  const formLogin = document.getElementById('formLogin');
  const formCadastro = document.getElementById('formCadastro');
  const irParaCadastro = document.getElementById('irParaCadastro');
  const irParaLogin = document.getElementById('irParaLogin');

  function abrirModalLogin() {
    modalOverlay.classList.add('ativo');
  }

  btnLogin.addEventListener('click', (e) => {
    e.preventDefault();
    abrirModalLogin();
  });

  modalFechar.addEventListener('click', () => fecharModal());

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) fecharModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('ativo')) {
      fecharModal();
    }
  });

  irParaCadastro.addEventListener('click', (e) => {
    e.preventDefault();
    formLogin.hidden = true;
    formCadastro.hidden = false;
  });

  irParaLogin.addEventListener('click', (e) => {
    e.preventDefault();
    formCadastro.hidden = true;
    formLogin.hidden = false;
  });

  function fecharModal() {
    modalOverlay.classList.remove('ativo');
    formCadastro.hidden = true;
    formLogin.hidden = false;
  }

  formLogin.addEventListener('submit', (e) => {
    e.preventDefault();

    var email = formLogin.email.value.trim();
    var senha = formLogin.senha.value.trim();

    fetch('/usuarios/autenticar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, senha: senha })
    })
      .then((resposta) => resposta.json().then((dados) => ({ status: resposta.status, dados })))
      .then(({ status, dados }) => {
        if (status !== 200) {
          alert(dados.mensagem || 'Não foi possível entrar.');
          return;
        }

        salvarUsuarioLogado(dados);
        atualizarInterfaceLogin();
        carregarMusicas();
        fecharModal();
        formLogin.reset();
      })
      .catch(() => alert('Erro ao conectar com o servidor.'));
  });

  formCadastro.addEventListener('submit', (e) => {
    e.preventDefault();

    var nome = formCadastro.nome.value.trim();
    var email = formCadastro.email.value.trim();
    var senha = formCadastro.senha.value.trim();

    fetch('/usuarios/cadastrar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: nome, email: email, senha: senha })
    })
      .then((resposta) => resposta.json().then((dados) => ({ status: resposta.status, dados })))
      .then(({ status, dados }) => {
        if (status !== 201) {
          alert(dados.mensagem || 'Não foi possível criar a conta.');
          return;
        }

        salvarUsuarioLogado(dados);
        atualizarInterfaceLogin();
        carregarMusicas();
        fecharModal();
        formCadastro.reset();
      })
      .catch(() => alert('Erro ao conectar com o servidor.'));
  });


  //  MODAL ADICIONAR MÚSICA
  const btnAdd = document.getElementById('btnAdd');
  const modalMusicaOverlay = document.getElementById('modalMusicaOverlay');
  const modalMusicaFechar = document.getElementById('modalMusicaFechar');
  const formMusica = document.getElementById('formMusica');
  const cardsContainer = document.getElementById('cardsContainer');
  const quantidadeSpan = document.querySelector('.quantidade');

  const estrelas = document.querySelectorAll('#modalEstrelas .estrela');
  const inputNota = document.getElementById('musicaNota');
  const inputCapa = document.getElementById('musicaCapa');
  const capaPreviewAdd = document.getElementById('capaPreviewAdd');
  const capaPreviewAddImg = document.getElementById('capaPreviewAddImg');

  inputCapa.addEventListener('change', () => {
    var arquivo = inputCapa.files[0];
    if (!arquivo) {
      capaPreviewAdd.hidden = true;
      return;
    }
    capaPreviewAddImg.src = URL.createObjectURL(arquivo);
    capaPreviewAdd.hidden = false;
  });


  btnAdd.addEventListener('click', (e) => {
    e.preventDefault();

    if (!obterUsuarioLogado()) {
      abrirModalLogin();
      return;
    }

    modalMusicaOverlay.classList.add('ativo');
  });

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
    capaPreviewAdd.hidden = true;
  }

  estrelas.forEach((estrela) => {
    estrela.addEventListener('click', () => {
      var valor = parseInt(estrela.dataset.valor);
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


  formMusica.addEventListener('submit', (e) => {
    e.preventDefault();

    var usuario = obterUsuarioLogado();
    if (!usuario) {
      abrirModalLogin();
      return;
    }

    var nome = document.getElementById('musicaNome').value.trim();
    var artista = document.getElementById('musicaArtista').value.trim();
    var genero = document.getElementById('musicaGenero').value.trim();
    var nota = parseInt(inputNota.value) || 0;

    if (!nome || !artista || !genero || nota === 0) {
      alert('Preencha todos os campos e selecione uma nota.');
      return;
    }

    var formData = new FormData();
    formData.append('nome', nome);
    formData.append('artista', artista);
    formData.append('genero', genero);
    formData.append('nota', nota);
    formData.append('idUsuario', usuario.id);
    if (inputCapa.files[0]) {
      formData.append('capa', inputCapa.files[0]);
    }

    fetch('/musicas', {
      method: 'POST',
      body: formData
    })

      .then((resposta) => resposta.json().then((dados) => ({ status: resposta.status, dados })))
      .then(({ status, dados }) => {
        if (status !== 201) {
          alert(dados.mensagem || 'Não foi possível salvar a música.');
          return;
        }

        fecharModalMusica();
        carregarMusicas();
      })
      .catch(() => alert('Erro ao conectar com o servidor.'));
  });


  function estrelasParaTexto(nota) {
    return '★'.repeat(nota) + '☆'.repeat(5 - nota);
  }

  function carregarMusicas() {
    var usuario = obterUsuarioLogado();

    if (!usuario) {
      renderizarEstadoDeslogado();
      return;
    }

    fetch('/musicas?idUsuario=' + usuario.id)
      .then((resposta) => resposta.json())
      .then((lista) => renderizarMusicas(lista))
      .catch(() => {
        cardsContainer.innerHTML = '<div class="estado-vazio">Não foi possível carregar suas músicas.</div>';
      });
  }

  function renderizarEstadoDeslogado() {
    cardsContainer.innerHTML = `
      <div class="estado-vazio">
        <a href="#" id="linkLoginVazio">Faça login</a> para ver e adicionar suas músicas.
      </div>
    `;
    if (quantidadeSpan) quantidadeSpan.textContent = '';

    document.getElementById('linkLoginVazio').addEventListener('click', (e) => {
      e.preventDefault();
      abrirModalLogin();
    });
  }

  function renderizarMusicas(lista) {
    cardsContainer.innerHTML = '';

    if (quantidadeSpan) {
      quantidadeSpan.textContent = `${lista.length} música${lista.length === 1 ? '' : 's'}`;
    }

    if (lista.length === 0) {
      cardsContainer.innerHTML = '<div class="estado-vazio">Você ainda não adicionou nenhuma música.</div>';
      return;
    }

    lista.forEach((item, indice) => {
      var musica = document.createElement('article');
      musica.classList.add('musica');
      musica.dataset.id = item.idMusicas;
      musica.dataset.nome = item.nome;
      musica.dataset.artista = item.artista;
      musica.dataset.genero = item.genero;
      musica.dataset.nota = item.nota;
      musica.dataset.capa = item.capa_url || '';

      musica.innerHTML = `
        <div class="musica-capa">
          ${item.capa_url
            ? `<img src="${item.capa_url}" alt="Capa de ${item.nome}">`
            : `<span>♫</span>`}
        </div>

        <div class="musica-info">
          <h3>${item.nome}</h3>
          <p>${item.artista}</p>
        </div>

        <span class="musica-genero">${item.genero}</span>
        <span class="musica-nota">${estrelasParaTexto(item.nota)}</span>

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
    });
  }


  const modalDetalheOverlay = document.getElementById('modalDetalheOverlay');
  const modalDetalheFechar = document.getElementById('modalDetalheFechar');
  const detalheView = document.getElementById('detalheView');
  const detalheNome = document.getElementById('detalheNome');
  const detalheArtista = document.getElementById('detalheArtista');
  const detalheGenero = document.getElementById('detalheGenero');
  const detalheNota = document.getElementById('detalheNota');
  const detalheCapaContainer = document.getElementById('detalheCapaContainer');
  const detalheCapaImg = document.getElementById('detalheCapaImg');
  const btnEditarMusica = document.getElementById('btnEditarMusica');
  const btnExcluirMusica = document.getElementById('btnExcluirMusica');
  const formEditarMusica = document.getElementById('formEditarMusica');
  const editNome = document.getElementById('editNome');
  const editArtista = document.getElementById('editArtista');
  const editGenero = document.getElementById('editGenero');
  const editNota = document.getElementById('editNota');
  const editCapa = document.getElementById('editCapa');
  const capaPreviewEdit = document.getElementById('capaPreviewEdit');
  const capaPreviewEditImg = document.getElementById('capaPreviewEditImg');
  const editEstrelasEls = document.querySelectorAll('#editEstrelas .estrela');

  editCapa.addEventListener('change', () => {
    var arquivo = editCapa.files[0];
    if (!arquivo) return;
    capaPreviewEditImg.src = URL.createObjectURL(arquivo);
    capaPreviewEdit.hidden = false;
  });

  const btnCancelarEdicao = document.getElementById('btnCancelarEdicao');

  let musicaAtual = null;

  cardsContainer.addEventListener('click', (e) => {
    var botaoExcluir = e.target.closest('.musica-excluir');
    var linha = e.target.closest('.musica');

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

    if (linha.dataset.capa) {
      detalheCapaImg.src = linha.dataset.capa;
      detalheCapaContainer.hidden = false;
    } else {
      detalheCapaContainer.hidden = true;
    }

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
    var usuario = obterUsuarioLogado();
    if (!usuario) return;

    var confirmar = confirm(`Remover "${linha.dataset.nome}" da sua coleção?`);
    if (!confirmar) return;

    fetch('/musicas/' + linha.dataset.id, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idUsuario: usuario.id })
    })
      .then(() => {
        fecharModalDetalhe();
        carregarMusicas();
      })
      .catch(() => alert('Erro ao excluir música.'));
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

    editCapa.value = '';
    if (musicaAtual.dataset.capa) {
      capaPreviewEditImg.src = musicaAtual.dataset.capa;
      capaPreviewEdit.hidden = false;
    } else {
      capaPreviewEdit.hidden = true;
    }

    detalheView.hidden = true;
    formEditarMusica.hidden = false;
  });

  btnCancelarEdicao.addEventListener('click', () => {
    detalheView.hidden = false;
    formEditarMusica.hidden = true;
  });

  editEstrelasEls.forEach((estrela) => {
    estrela.addEventListener('click', () => {
      var valor = parseInt(estrela.dataset.valor);
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

    var usuario = obterUsuarioLogado();
    if (!usuario || !musicaAtual) return;

    var nome = editNome.value.trim();
    var artista = editArtista.value.trim();
    var genero = editGenero.value.trim();
    var nota = parseInt(editNota.value) || 0;

    if (!nome || !artista || !genero || nota === 0) {
      alert('Preencha todos os campos e selecione uma nota.');
      return;
    }

    var formData = new FormData();
    formData.append('nome', nome);
    formData.append('artista', artista);
    formData.append('genero', genero);
    formData.append('nota', nota);
    formData.append('idUsuario', usuario.id);
    if (editCapa.files[0]) {
      formData.append('capa', editCapa.files[0]);
    }

    fetch('/musicas/' + musicaAtual.dataset.id, {
      method: 'PUT',
      body: formData
    })

      .then((resposta) => resposta.json().then((dados) => ({ status: resposta.status, dados })))
      .then(({ status, dados }) => {
        if (status !== 200) {
          alert(dados.mensagem || 'Não foi possível salvar.');
          return;
        }

        fecharModalDetalhe();
        carregarMusicas();
      })
      .catch(() => alert('Erro ao editar música.'));
  });


  atualizarInterfaceLogin();
  carregarMusicas();

});