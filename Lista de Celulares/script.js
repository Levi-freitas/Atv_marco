const tabela = document.querySelector('#tabela');
const botoesPaginacao = document.querySelectorAll('.btnPaginacao');
const formAddCelular = document.querySelector('#form-add-celular');
const marcaInput = document.querySelector('#marca');
const modeloInput = document.querySelector('#modelo');
const anoInput = document.querySelector('#ano');
const celularesPorPagina = 10;

let celulares = [];
let pagina = 1;

renderizarTabela();

botoesPaginacao.forEach((botao, index) => {
    botao.addEventListener('click', (e) => {
        e.preventDefault();
        pagina = index + 1;
        ativarBotaoPaginacao(botao);
        renderizarTabela();
    });
});

formAddCelular.addEventListener('submit', async (e) => {
    e.preventDefault();
    const marca = marcaInput.value.trim();
    const modelo = modeloInput.value.trim();
    const ano = anoInput.value.trim();
    
    if (marca && modelo && ano) {
        await adicionarCelular({ marca, modelo, ano });
        marcaInput.value = '';
        modeloInput.value = '';
        anoInput.value = '';
    }
});

async function fetchData() {
    try {
        const response = await fetch('dados.json');
        if (!response.ok) {
            throw new Error(`Status da resposta: ${response.status}`);
        }
        const json = await response.json();
        celulares = json.celulares;
    } catch (error) {
        console.error(error.message);
    }
}

async function adicionarCelular(celular) {
    try {
        const response = await fetch('http://localhost:3000/celulares', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(celular),
        });
        if (response.ok) {
            console.log('Celular adicionado com sucesso');
            renderizarTabela();
        } else {
            console.error('Erro ao adicionar o celular');
        }
    } catch (error) {
        console.error(error.message);
    }
}

async function excluirCelular(id) {
    try {
        const response = await fetch(`http://localhost:3000/celulares/${id}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            console.log('Celular excluído com sucesso');
            renderizarTabela();
        } else {
            console.error('Erro ao excluir o celular');
        }
    } catch (error) {
        console.error(error.message);
    }
}

async function renderizarTabela() {
    await fetchData();
    
    const inicio = (pagina - 1) * celularesPorPagina;
    const fim = inicio + celularesPorPagina;
    const celularesPagina = celulares.slice(inicio, fim);

    tabela.innerHTML =
    `<table>
        <thead>
            <tr>
                <th scope="col">ID</th>
                <th scope="col">Marca</th>
                <th scope="col">Modelo</th>
                <th scope="col">Ano</th>
                <th scope="col">Ações</th>
            </tr>
        </thead>
        <tbody>
            ${celularesPagina.map((celular, index) => `
                <tr>
                    <th scope="row">${index + 1}</th>
                    <td>${celular.marca}</td>
                    <td>${celular.modelo}</td>
                    <td>${celular.ano}</td>
                    <td>
                        <button class="btnDelete" data-id="${index + 1}">🗑️</button>
                    </td>
                </tr>
            `).join('')}
        </tbody>
    </table>`;
    adicionarEventosDeletar();
}

function ativarBotaoPaginacao(botaoAtivo) {
    botoesPaginacao.forEach(botao => botao.classList.remove('ativo'));
    botaoAtivo.classList.add('ativo');
}

function adicionarEventosDeletar() {
    const botoesDeletar = document.querySelectorAll('.btnDelete');
    botoesDeletar.forEach(botao => {
        botao.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            excluirCelular(id);
        });
    });
}
