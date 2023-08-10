
import pokedex from './pokemon-species.json' assert {type: 'json'};

let lives = localStorage.getItem("lives") ?? 6 ;
let number; // es necesario que este aqui pues asi podemos referenciarlo a la hora de guardar los answered
let puntos = localStorage.getItem("puntos") ?? 0;
let record = localStorage.getItem("record") ?? 0;
let pokemonSelected = JSON.parse(localStorage.getItem("pokemonSelected")) ?? null;
let pokemon_index = localStorage.getItem("index") ?? 0; // permite saber en que pregunta vamos
const questionText = document.querySelector(".question-text")
const answerText = document.querySelector(".answer-text")
const recordText = document.querySelector(".record")
const pointsText = document.querySelector(".points")
pointsText.textContent += puntos;
recordText.textContent += record;
const answerInput = document.querySelector(".answer-input")

const pokemon_img = document.querySelector(".pokemon-img")
const livesImg = document.querySelectorAll(".life")




let availableTags = [

];


pokedex.results.forEach(poke => {
  availableTags.push(poke.name)
});

$(answerInput).autocomplete({
  source: availableTags,
  minLength: 3
});

const answerBtn = document.querySelector(".answer-btn")
answerBtn.onclick = checkAnswer;
const nextBtn = document.querySelector(".next-btn")
nextBtn.onclick = handleQuestion;
let pokemons = JSON.parse(localStorage.getItem("pokemons")) ?? structuredClone(pokedex.results)// con el clon evito tener referencias que contradigan los datos a la hora de reiniciar el juego


function handleQuestion() { // dados ciertos parametros, determina si se puede cargar o no la sigueiente pregunta
  
  if (pokemon_index < pokemons.length) {
    questionText.textContent = 'Quien es este Pokemon?'

    loadQuestion()
    answerInput.style.display = "block"
  } else {
    questionText.textContent = 'Ha respondido todas las preguntas'
    pokemon_img.src = `images/icons/trofeo_oro.png`
   nextBtn.textContent = "Reiniciar juego"
    resetGame()

  }
}
handleQuestion()


function loadQuestion() {
  number = Math.floor(Math.random() * pokemons.length);

console.log(number)
    if(pokemonSelected == null){
      
      pokemonSelected = pokemons[number];
      pokemonSelected.id = number +1;

        pokemonSelected.name =  pokedex.results[number].name

      
     
      localStorage.setItem("pokemonSelected", JSON.stringify(pokemonSelected))
      
    } 

    if (pokemonSelected.answered != 'yes') {
    
      if(lives != 6){ 
        for (let index = 6 - lives; index > 0; index--) {
        livesImg[index -1].src = "images/icons/pokeball open.png"            
                                
      }      } else{
        livesImg.forEach(life => {
          life.src = "images/icons/pokeball closed.png"   
        });
      }   
      pokemon_img.src = ``  

    pokemon_img.classList.toggle("silhouette")

    ChargeImage(pokemonSelected.name);
    // pokemon_img.src = `images/${pokemonSelected.id}.png`  

      recordText.textContent = "Record: " + record;
      pointsText.textContent = "Puntos: " + puntos;

      answerInput.value = ""
      answerInput.removeAttribute("disabled")
      nextBtn.setAttribute("hidden", "")
      answerBtn.removeAttribute("hidden")
      answerText.setAttribute("hidden", "");
     // Solo para etapa de desarrollo
      //  console.log("pokemon seleccionado, " + pokemonSelected.name.english)
   
      saveData()
      pokemon_index++;

    } else {
    // Solo para etapa de desarollo
     console.log("pregunta repetida, cambiando " + pokemonSelected.name)
       pokemonSelected = null; 

       loadQuestion()
    }

}

export function checkAnswer() {


  if (answerInput.value == "") return
  answerInput.value = answerInput.value.trimStart()

  if (pokemonSelected.name.toLowerCase() == answerInput.value.toLowerCase()) {


    puntos++;
    nextBtn.textContent = "Siguiente"
    livesImg[6 - lives].src = `images/icons/pokeball success.png`
    
    // el orden de estas tres lineas de codigo es importante, no modificar
    nextQuestion()

    pokemons[pokemonSelected.id -1].answered = 'yes'// esquivamos el tener que hacer la referencia
    pokemonSelected = null;
    saveData()

  } else {
    livesImg[6 - lives].src = `images/icons/pokeball open.png`
    lives--;

    if (lives == 0) {
      nextBtn.textContent = "Reiniciar juego"
      answerText.removeAttribute("hidden")
      nextQuestion()

      resetGame()
      
      return
      //this level is ended
    } else{
      saveData()// salvo para registrar las vidas perdidas

    }

    answerText.textContent = "Incorrecto"

  }








}

function nextQuestion() {
  answerInput.style.display = "none"

  nextBtn.removeAttribute("hidden")
  answerText.textContent = pokemonSelected.name.toLowerCase()
    == answerInput.value.toLowerCase() ?
    `Correcto,  es   ${pokemonSelected.name}` :
    `Has perdido,  es  ${pokemonSelected.name} `

  answerText.removeAttribute("hidden")
  answerBtn.setAttribute("hidden", "")
  answerInput.setAttribute("disabled", true)
  pokemon_img.classList.toggle("silhouette")
  pointsText.textContent = "Puntos: " + puntos;
  lives = 6;
}
function resetGame() {



  pokemons = structuredClone(pokedex.results)// reseteo la lista para que todas las preguntas esten sin responder
  puntos = 0;
  pokemon_index = 0
 pokemonSelected = null;
  saveData()

}

function saveData() {
  if (puntos > record) {
    record = puntos;
    localStorage.setItem("record", record)
  }
  localStorage.setItem("index", pokemon_index)
  localStorage.setItem("puntos", puntos)
  localStorage.setItem("pokemonSelected", JSON.stringify(pokemonSelected));
  localStorage.setItem("lives", lives)
  localStorage.setItem("pokemons",JSON.stringify(pokemons) );

}


async function ChargeImage(pokename) {
let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokename}`)
let data  = await response.json()
let image = await data.sprites.other["official-artwork"].front_default
console.log(pokemonSelected.name)
pokemon_img.src = image;

}