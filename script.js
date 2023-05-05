let checkboxes = document.querySelectorAll('.checkbox');
let chekedIcons = document.querySelectorAll('.check-icon');
const tarefa = document.querySelector('#tarefa');
const listaTarefas = document.querySelector('#lista-tarefas');
const limparBtn = document.querySelector('#limpa-tudo');

const main = document.querySelector('main');

const allBtn = document.querySelector('.filter-all');
const activeBtn = document.querySelector('.filter-active');
const completeBtn = document.querySelector('.filter-completed');

const mballBtn = document.querySelector('.mb-filter-all');
const mbactiveBtn = document.querySelector('.mb-filter-active');
const mbcompleteBtn = document.querySelector('.mb-filter-completed');

const restantes = document.querySelector('#restantes');

const temaBtn = document.querySelector('.theme');

const root = document.documentElement;

const tarefaItens = document.querySelectorAll('.tarefa-item');

let Darktema = true;

let Tarefas = [];
let TarefasCompletas = [];
let TarefasAtivas = []

//Busca por Tarefas no localStorage
if(localStorage.getItem("ListaTarefinhas")){
    const listaLocal = localStorage.getItem("ListaTarefinhas");
    Tarefas = JSON.parse(listaLocal);
} else {
    Tarefas = []
}

//Verifica qual tema esta salvo no localStorage
if(localStorage.getItem("tema")){
    const localTema = localStorage.getItem('tema');
    Darktema = JSON.parse(localTema);
} else {
    Darktema = true
}

//Atualiza o icone do botão tema
if(!Darktema){
    temaBtn.innerHTML = '<img src="images/icon-moon.svg" alt="Dark-theme" />'
}

//Adiciona a tarefa quando enter é pressionado
tarefa.addEventListener('keypress', (e) => {
    if(e.keyCode === 13){
        criaTarefa(tarefa.value);
        tarefa.value = '';
    }
})

//itera sobre as tarefas adicionando o index das concluidas no array ids e dps remove de acordo de maneira reversa
limparBtn.addEventListener('click', () => {
    let ids = [];
    for(let i = 0; i < Tarefas.length; i ++){
        if(Tarefas[i].complete == true){
            ids.push(i)
        }
    }

    for(let i = ids.length - 1; i >= 0; i--){
        Tarefas.splice(ids[i], 1)
    }

    TarefasCompletas = [];
    mostraTarefas(Tarefas)
    salva()
})

//Altera o icone de acordo com o tema
temaBtn.addEventListener('click', () => {
    if(Darktema){
        Darktema = false
        temaBtn.innerHTML = '<img src="images/icon-moon.svg" alt="Dark-theme" />'
    } else {
        Darktema = true
        temaBtn.innerHTML = '<img src="images/icon-sun.svg" alt="Light-theme" />'
    }
    
    mudaTema();
    salvaTema();
})

//recebe a tarefa do input e cria um objeto
function criaTarefa(tarefa){
    const novaTarefa = {
        desc: tarefa,
        complete: false
    }

    Tarefas.push(novaTarefa);
    mostraTarefas(Tarefas);
    salva()
    achaCompletas()
}

//Cria uma nova Li para cada obj da lista fornecida
function mostraTarefas(lista){
    listaTarefas.innerHTML = '';

    for(let i =0; i < lista.length; i++){
        const li = document.createElement('li');

        const item = document.createElement('div');
        item.classList.add('tarefa-item');

        const checkBx = document.createElement('div');
        checkBx.classList.add('checkbox');
        checkBx.addEventListener('click', (e)=> {
            checa(e.target, i)
        });

        const tarefaDesc = document.createElement('p');
        tarefaDesc.classList.add('tarefa-desc');
        tarefaDesc.innerText = lista[i].desc;

        if(lista[i].complete){
            tarefaDesc.classList.add('complete');
            checkBx.classList.add('checked');
        }

        item.appendChild(checkBx)
        item.appendChild(tarefaDesc);
        li.appendChild(item);

        listaTarefas.appendChild(li);
    }
}

//Adicona ou remove a classe Checked
function checa(e, i){
    e.classList.toggle('checked');
    
    if(e.classList.contains('checked')){
        Tarefas[i].complete = true;
        e.parentNode.classList.add('complete');
    } else {
        Tarefas[i].complete = false
        e.parentNode.classList.remove('complete')
    }

    salva()
    mostraTarefas(Tarefas);
    achaCompletas()
}

//Salva as tarefas no localStorage
function salva(){
    const listaTarefinhas = JSON.stringify(Tarefas);
    localStorage.setItem("ListaTarefinhas", listaTarefinhas);
}

//Separa as tarefas completas das Ativas
function achaCompletas(){
    TarefasAtivas = [];
    TarefasCompletas = [];
    for(let i = 0; i < Tarefas.length; i++){
        if(Tarefas[i].complete){
            TarefasCompletas.push(Tarefas[i])
        } else {
            TarefasAtivas.push(Tarefas[i])
        }
    }

   updateRestantes();
}

//applica os filtros de busca
function filters(){
    //Desktop
    allBtn.addEventListener('click', () => {
        allBtn.classList.add('active')
    
        activeBtn.classList.remove('active');
        completeBtn.classList.remove('active');

        mostraTarefas(Tarefas)
    })

    activeBtn.addEventListener('click', () => {
        activeBtn.classList.add('active')
    
        allBtn.classList.remove('active');
        completeBtn.classList.remove('active');

        mostraTarefas(TarefasAtivas)
    })

    completeBtn.addEventListener('click', () => {
        completeBtn.classList.add('active')
    
        activeBtn.classList.remove('active');
        allBtn.classList.remove('active');

        mostraTarefas(TarefasCompletas)
    })

    //Mobile
    mballBtn.addEventListener('click', () => {
        mballBtn.classList.add('active')
    
        mbactiveBtn.classList.remove('active');
        mbcompleteBtn.classList.remove('active');

        mostraTarefas(Tarefas)
    })

    mbactiveBtn.addEventListener('click', () => {
        mbactiveBtn.classList.add('active')
    
        mballBtn.classList.remove('active');
        mbcompleteBtn.classList.remove('active');

        mostraTarefas(TarefasAtivas)
    })

    mbcompleteBtn.addEventListener('click', () => {
        mbcompleteBtn.classList.add('active')
    
        mbactiveBtn.classList.remove('active');
        mballBtn.classList.remove('active');

        mostraTarefas(TarefasCompletas)
    })
}

//Atualiza a contagem de tarefas restantes
function updateRestantes(){
    restantes.innerText = TarefasAtivas.length;
}

//altera o esquema de cores
function mudaTema(){

    if(Darktema){
        root.style.setProperty('--font-dark', 'hsl(236, 33%, 92%)');
        root.style.setProperty('--font-dark-lighter', 'hsla(0, 0%, 80%, 0.589)');
        root.style.setProperty('--bg-dark', 'hsl(235, 21%, 11%)');
        root.style.setProperty('--container-bg-dark', 'hsl(235, 24%, 19%)');
        root.style.setProperty('--checkbox-border', 'hsl(233, 14%, 35%)');
        root.style.setProperty('--iten-border', 'hsla(233, 14%, 35%, 0.445)');
    } else {
        root.style.setProperty('--font-dark', '#535467');
        root.style.setProperty('--font-dark-lighter', '#8f8f97');
        root.style.setProperty('--bg-dark', '#fafafa');
        root.style.setProperty('--container-bg-dark', '#ffffff');
        root.style.setProperty('--checkbox-border', 'hsl(233, 14%, 35%)');
        root.style.setProperty('--iten-border', 'hsla(233, 14%, 35%, 0.445)');

    }
}

//Salva o tema atual no localStorage
function salvaTema(){
    localStorage.setItem('tema', Darktema);
}

mudaTema()
filters();
mostraTarefas(Tarefas)
achaCompletas()