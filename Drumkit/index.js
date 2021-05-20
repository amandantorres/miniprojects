'user strict'; // para pegar alguns erros e más práticas

const sounds = {
  'A': 'boom.wav',
  'S': 'clap.wav',
  'D': 'hihat.wav',
  'F': 'kick.wav',
  'G': 'openhat.wav',
  'H': 'ride.wav',
  'J': 'snare.wav',
  'K': 'tink.wav',
  'L': 'tom.wav',
}

//construir div de forma dinâmica
/*################################################################
# função que cria as divs
 ################################################################*/
const createDiv = (text) => {
  const div = document.createElement('div'); //colocando a div
  div.classList.add('key'); // a div vai receber uma classe
  div.textContent = text; // a div vai receber um texto
  div.id = text; //div recebe um id para localizar futuramente
  //INSERINDO NO DOM AGORA
  document.getElementById('container').appendChild(div);  //pega o local que vai inserir e adiciona um "filho"
}

// createDiv('A');//Pode criar assim, mas não fica dinâmico

/*################################################################
# Função para exibir sons na tela
 ################################################################*/
// const display = (sons) => {
//   // console.log(Object.keys(sons))//retorna array com todas as keys]
//   Object.keys(sons).forEach(createDiv)//cada elemento que ele pegar, vai mandar para função de criar a div
// }

//*******simplificando
const display = (sound) => Object.keys(sound).forEach(createDiv)//cada elemento que ele pegar, vai mandar para função de criar a div

/*################################################################
# Função tocar som
 ################################################################*/
const displaySound = (letter) => {
  const audio = new Audio(`./sounds/${sounds[letter]}`)
  audio.play();//play é o método do javascript
}

/*################################################################
# Função adicionar efeito quando clicar na letra
 ################################################################*/
const addEffects = (letter) => document.getElementById(letter) //pega o elemento através do id
  .classList.add('active');

/*################################################################
# Função remover efeito quando clicar na letra
 ################################################################*/
//essa função fica muito rápida e não mostra o efeito adicionado
// const removeEffects = (letter) => document.getElementById(letter) //pega o elemento através do id
//   .classList.remove('active');

const removeEffects = (letter) => {
  const div = document.getElementById(letter) //pega o elemento através do id
  const removeActive = () => div.classList.remove('active');
  div.addEventListener('transitionend', removeActive);
};
/*################################################################
# Função criar um evento para o click 
 ################################################################*/
const activateDiv = (event) => {
  // console.log(event)//o evento mostra o que foi clicado, e no target mostra aonde clicou
  // console.log(event.target.id)
  let letter = event.type == 'click' ? event.target.id : event.key.toUpperCase()

  // if (event.type == 'click') {
  //   letter = event.target.id;
  // } else {
  //   letter = event.key.toUpperCase()
  // }
  const letterPermission = sounds.hasOwnProperty(letter); //verifica se existe essa propriedade letra
  if (letterPermission) {
    addEffects(letter); //adicionar o css de efeito
    displaySound(letter);
    removeEffects(letter); //remover o css de efeito depois de tocar
  }
}

display(sounds);

document.getElementById('container') //capturar qualquer click dentro do container que é o "pai"
  .addEventListener('click', activateDiv) //fica escutando o click e chama uma função

/*################################################################
# Capturar as teclas - tem que pegar no window
################################################################*/
window.addEventListener('keydown', activateDiv)