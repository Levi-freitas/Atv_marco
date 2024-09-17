document.addEventListener('DOMContentLoaded', () => {
    let formAtividade = document.querySelector('#form-atividade');
    let descricaoAtividade = document.querySelector('#descricao-atividade');
    let dataLimite = document.querySelector('#data-limite');
    let tabelaAtividade = document.querySelector('#tabela-atividade').getElementsByTagName('tbody')[0];
    let contadorAtividade = document.querySelector('#contador-atividade');
    let modal = document.querySelector('#modal');
    let modalMsg = document.querySelector('#modal-msg');
    let modalFechar = document.querySelector('#modal-fechar');
    
    let atividades = JSON.parse(localStorage.getItem('atividades')) || [];

    function renderizarAtividades() {
        tabelaAtividade.innerHTML = '';
        atividades.forEach((atividade, index) => {
            let linha = tabelaAtividade.insertRow();
            linha.insertCell(0).textContent = atividade.description;
            linha.insertCell(1).textContent = atividade.dueDate;
            
            let botoes = linha.insertCell(2);
            botoes.innerHTML = `
                <button class="editar-btn" data-index="${index}">Editar</button>
                <button class="remover-btn" data-index="${index}">Excluir</button>
            `;
        });
        contadorAtividade.textContent = atividades.length;
    }

    function salvarAtividades() {
        localStorage.setItem('atividades', JSON.stringify(atividades));
    }

    function mostrarModal(message) {
        modalMsg.textContent = message;
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 3000);
    }

    formAtividade.addEventListener('submit', (e) => {
        e.preventDefault();
        let descricao = descricaoAtividade.value;
        let data = dataLimite.value;

        if (!descricao || !data) {
            mostrarModal('Preencha todos os campos!');
            return;
        }

        if (formAtividade.dataset.editIndex !== undefined) {
            atividades[formAtividade.dataset.editIndex] = { description: descricao, dueDate: data };
            delete formAtividade.dataset.editIndex;
            mostrarModal('Atividade editada com sucesso!');
        } else {
            atividades.push({ description: descricao, dueDate: data });
            mostrarModal('Atividade adicionada com sucesso!');
        }

        descricaoAtividade.value = '';
        dataLimite.value = '';
        salvarAtividades();
        renderizarAtividades();
    });

    tabelaAtividade.addEventListener('click', (e) => {
        if (e.target.classList.contains('remover-btn')) {
            let index = e.target.dataset.index;
            let confirmarRemover = confirm('Você realmente deseja excluir esta atividade?');

            if (confirmarRemover) {
                atividades.splice(index, 1);
                salvarAtividades();
                renderizarAtividades();
            }
        } else if (e.target.classList.contains('editar-btn')) {
            let index = e.target.dataset.index;
            let atividade = atividades[index];
            descricaoAtividade.value = atividade.description;
            dataLimite.value = atividade.dueDate;
            formAtividade.dataset.editIndex = index;
        }
    });

    modalFechar.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    renderizarAtividades();
});
