startReactor = {
  computedCombination: [], // array do jogo para armazenar a sequência correta
  playerCombination: [], // array do user para armazenar a sequência dele
  computedCombinationPosition: 1,// quando começa as combinações
  combinationMaxPosition: 5, //verificar se chegou no limite dos botôes de sequência
  memoryCombination: 9,//máximo de combinações de memórias (botões de memória do container)

  audio: {
    start: 'start.mp3',
    fail: 'fail.mp3',
    complete: 'complete.mp3',
    combinations: ['0.mp3', '1.mp3', '2.mp3', '3.mp3', '4.mp3', '5.mp3', '6.mp3', '7.mp3', '8.mp3'],

    loadAudio(filename) { //transforma em objeto de áudio

      const file = `./audio/${filename}?cb=${new Date().getTime()}` //meio que força a inserção do caminho, removendo qualquer cache que possa existir.
      const audio = new Audio(file)
      audio.load()
      return audio

    },

    loadAudios() { // chama a função áudio para cada um passando o caminho

      if (typeof (startReactor.audio.start) == 'object') return  //antes de rodas a função ele se certifica se é um objeto já.

      startReactor.audio.start = startReactor.audio.loadAudio(startReactor.audio.start) //item é transformado em objeto de audio, recebendo a função e passando o caminho para gerar o mesmo.
      startReactor.audio.fail = startReactor.audio.loadAudio(startReactor.audio.fail)
      startReactor.audio.complete = startReactor.audio.loadAudio(startReactor.audio.complete)
      startReactor.audio.combinations = startReactor.audio.combinations.map((audio) => startReactor.audio.loadAudio(audio))
    }
  },

  interface: {

    //Variaveis recebendo o DOM para manipular a interface
    memoryPanel: document.querySelector('.painelMemory'),
    computerLedPanel: document.querySelector('.computerLedPanel'),
    playerLedPanel: document.querySelector('.playerLedPanel'),
    painelMemory: document.querySelector('.painelMemory'),
    painelMemoryButtons: document.getElementsByClassName('painelMemory'),

    //ascender a luz do painel quando ligar
    turnLedOn(index, ledPanel) {
      ledPanel.children[index].classList.add('ledOn'); //add a class que mostra que está ligado
    },

    //apagar todas as luzes
    turnAllLedsOf() {
      const computerLedPanel = startReactor.interface.computerLedPanel // painel do computador
      const playerLedPanel = startReactor.interface.playerLedPanel//painel do usuário

      for (let i = 0; i < computerLedPanel.children.length; i++) {
        computerLedPanel.children[i].classList.remove('ledOn')
        playerLedPanel.children[i].classList.remove('ledOn') // remove classes do usuario e apaga todas as luzes
      }
    },

    //start do audio novamente na sequência
    async start() {
      return startReactor.audio.start.play()
    },

    //Ascender a luz no painel e tocar a sequencia quando clicar ou mostrar
    playItem(index, combinationPosition, location = 'computer') {

      const leds = (location == 'computer') ? startReactor.interface.computerLedPanel : startReactor.interface.playerLedPanel
      const memPanel = startReactor.interface.memoryPanel.children[index] //armazena a posição do objeto

      memPanel.classList.add('memoryActive') // adiciona a classe no objeto, p/  acender a luz no container
      startReactor.interface.turnLedOn(combinationPosition, leds) //passa a combinação para ascender
      startReactor.audio.combinations[index].play().then(() => {
        setTimeout(() => {
          memPanel.classList.remove('memoryActive')
        }, 150)
      })
    },

    /*####################################################
    #  FINALIZANDO O JOGO
    ####################################################*/

    endGame(type = "fail") {

      const memPanel = startReactor.interface.memoryPanel
      const ledPanel = startReactor.interface.computerLedPanel
      const audio = (type == "complete") ? startReactor.audio.complete : startReactor.audio.fail //verifica a situação do jogo para setar o audio certo de que acertou ou errou
      const typeClasses = (type == "complete") ? ["playerMemoryComplete", "playerLedComplete"] : ["playerMemoryError", "playerLedError"]

      startReactor.interface.disableButtons()
      startReactor.interface.turnAllLedsOff()

      audio.play().then(() => {

        for (var i = 0; i < memPanel.children.length; i++) {
          if (memPanel.children[i].tagName == "DIV")
            memPanel.children[i].classList.add(typeClasses[0])
        }
        for (var i = 0; i < ledPanel.children.length; i++) {
          if (ledPanel.children[i].tagName == "DIV")
            ledPanel.children[i].classList.add(typeClasses[1])
        }
        setTimeout(() => {
          for (var i = 0; i < memPanel.children.length; i++) {
            if (memPanel.children[i].tagName == "DIV")
              memPanel.children[i].classList.remove(typeClasses[0])
          }
          for (var i = 0; i < ledPanel.children.length; i++) {
            if (ledPanel.children[i].tagName == "DIV")
              ledPanel.children[i].classList.remove(typeClasses[1])
          }
        }, 900);

      })

    },

    /*####################################################
    #  Funções do player
    ####################################################*/

    //função de ativar os botões do player

    enableButtons() {
      const playerMemory = startReactor.interface.playerMemory
      playerMemory.classList.add('playerActive')

      for (var i = 0; i < playerMemory.children.length; i++) {
        if (playerMemory.children[i].tagName == "DIV")
          playerMemory.children[i].classList.add("playerMemoryActive")
      }
    },

    //função de desativar os botões do player
    disableButtons() {
      const playerMemory = startReactor.interface.playerMemory
      playerMemory.classList.remove('playerActive')

      for (var i = 0; i < playerMemory.children.length; i++) {
        if (playerMemory.children[i].tagName == "DIV")
          playerMemory.children[i].classList.remove("playerMemoryActive");
      }
    },

  },

  load() { },
  start() {
    startReactor.computedCombination = startReactor.createCombination()//pega a função que vai criar um combinação de nomes e armazena na variavel
    startReactor.computedCombinationPosition = 1 //verifica se estão zeradas as combinações quando inicia
    startReactor.playerCombination = [] //verifica se estão zeradas as combinações quando inicia
    //Inciando e resetando a luz e iniciando o audio novamente
    startReactor.interface.start().then(() => {
      setTimeout(() => {
        startReactor.playCombination()
      }, 500)
    }) // ao iniciar, vai esperar alguns minutos
  },

  createCombination() { // criar combinação randomica de acordo com o tamanho máximo de posições.
    let newCombination = []
    for (let n = 0; n < startReactor.combinationMaxPosition; n++) {
      const position = Math.floor((Math.radom() * startReactor.memoryCombination) + 1)
      newCombination.push(position - 1)
    }
    return newCombination
  },

  playCombination() {

  }
}

