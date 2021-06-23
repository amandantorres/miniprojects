'use strict';

//#########################################################################
//    BANCO DE DADOS MODELO
//#########################################################################
// let dataBase = [
//   { 'task': 'Estudar js', 'status': '' },
//   { 'task': 'Trabalhar', 'status': 'checked' }
// ]

//?? ternário - se for vazio ou null, passa para o próximo.
// localStorage.setItem('todoList', dataBase) - mostra apenas objeto
// localStorage.setItem('todoList', JSON.stringify(dataBase)) - localStorage só trabalha com string então tem que enviar assim.
const getDataBase = () => JSON.parse(localStorage.getItem('todoList')) ?? [];
const setDataBase = (dataBase) => localStorage.setItem('todoList', JSON.stringify(dataBase))
// localStorage.getItem('todoList') -- dessa forma pega o array como string e está errado.
// JSON.parse(localStorage.getItem('todoList')) -- puxa o array corretamente

//#########################################################################
//    ADICIONANDO OS ITENS
//#########################################################################
const addItem = (task, status, index) => {
  const item = document.createElement('label');
  item.classList.add('todo__item');
  item.innerHTML = `
  <input type="checkbox" ${status} data-index=${index}>
  <div>${task}</div>
  <input type="button" value="X" data-index=${index}>
  `
  //o data é interpretado pelo json e vc pode dar qualquer nome
  document.getElementById('todoList').appendChild(item); //vai pegar o id da div e adicionar o item
}

//#########################################################################
//    PUXAR LISTA DOS ITENS
//#########################################################################
const getList = () => {
  cleanTasks();
  const dataBase = getDataBase();
  dataBase.forEach((item, index) => addItem(item.task, item.status, index));
}

//#########################################################################
//     ANTES DE PUXAR LISTA, ELE LIMPA AS TAREFAS PARA NÃO DUPLICAR
//#########################################################################
const cleanTasks = () => {
  const todoList = document.getElementById('todoList');
  while (todoList.firstChild) {
    todoList.removeChild(todoList.lastChild) //remove um por um da lista
  }
}

//#########################################################################
//      INPUT - INSERINDO TAREFAS
//#########################################################################
const insertItem = (event) => {
  const button = event.key;
  const text = event.target.value
  // console.log(button)
  if (button === 'Enter') {
    const dataBase = getDataBase();
    dataBase.push({ 'task': text, 'status': '' })
    setDataBase(dataBase);
    getList();
    event.target.value = '' //limpando input
  }
}
//   CAPTURA EVENTO QUE OCORREU NO INPUT
//#########################################################################
document.getElementById('newItem').addEventListener('keypress', insertItem);

//#########################################################################
//      REMOVENDO ITENS PELO INDEX
//#########################################################################
const removeItem = (index) => {
  const dataBase = getDataBase();//pega a lista no localStorage
  dataBase.splice(index, 1) // a partir do indice que receber, apaga ele próprio
  setDataBase(dataBase);//armazena a alteração no localStorage novamente
  getList();
}

//#########################################################################
//      MODIFICANDO CHECKBOX DO ITEM PELO INDEX
//#########################################################################
const checkItem = (index) => {
  const dataBase = getDataBase();//pega a lista no localStorage
  dataBase[index].status = dataBase[index].status === '' ? 'checked' : '';
  setDataBase(dataBase);//armazena a alteração no localStorage novamente
  getList();
}

//#########################################################################
//      AO CLICAR VERIFICA EM QUE PARTE DO ITEM CLICOU E FAZ A CONDIÇÃO
//#########################################################################
const clickItem = (event) => {
  const element = event.target;
  // console.log(element)
  if (element.type === 'button') {
    const index = element.dataset.index //pega o nome que colocou no "data" 
    removeItem(index);
  } else if (element.type === 'checkbox') {
    const index = element.dataset.index //pega o nome que colocou no "data" 
    checkItem(index)
  }

}
//   CAPTURA EVENTO QUE OCORREU DENTRO DA LISTA DE ITENS
//#########################################################################
document.getElementById('todoList').addEventListener('click', clickItem);



getList();

