"use strict";
(function() {

  const BASE_URL = "https://courses.cs.washington.edu/courses/cse154/webservices/pokedex/";
  const POKEDEX = "pokedex.php?";
  const GAME = "game.php";
  let names = {};
  let guid = "";
  let pid = "";
  let p1Health = 0;
  let p2Health = 0;
  const HUNDRED = 100;
  const LOW_HEALTH = 0.2;

  window.addEventListener("load", init);

  /**
   * main func, eventListerns are added to some things
   */
  function init() {
    let moves = document.getElementsByClassName("moves")[0].querySelectorAll("button");
    for (let i = 0; i < moves.length; i++) {
      moves[i].addEventListener("click", function() {
        playMove(this.getElementsByClassName("move")[0].textContent);
      });
    }
    id("flee-btn").addEventListener("click", () => {
      playMove("flee");
    });
    id("endgame").addEventListener("click", function() {
      let name = this.parentElement.getElementsByClassName("name")[0].textContent;
      endgame(names[name]);
    });
    pokedex();
  }

  /**
   * once the game is ended the views ("hidden") are reset and everything is
   * readjusted back to the default view
   * @param {str} name pokemon name needed for the pokedex home screen card
   */
  function endgame(name) {
    id("endgame").classList.add("hidden");
    id("results-container").classList.add("hidden");
    id("p2").classList.add("hidden");
    id("p1").getElementsByClassName("hp-info")[0].classList.add("hidden");
    id("pokedex-view").classList.remove("hidden");
    id("start-btn").classList.remove("hidden");
    id("p1").getElementsByClassName("health-bar")[0].style.width = "100%";
    id("p2").getElementsByClassName("health-bar")[0].style.width = "100%";
    id("p1").getElementsByClassName("health-bar")[0].classList.remove("low-health");
    id("p2").getElementsByClassName("health-bar")[0].classList.remove("low-health");
    id("p1-turn-results").innerHTML = "";
    id("p2-turn-results").innerHTML = "";
    generateP1(name);
  }

  /**
   * once someones health is zero buttons are disabled and the game is stopped
   */
  function stopGame() {
    let buttons = document.getElementsByClassName("moves")[0].querySelectorAll("button");
    for (let i = 0; i < buttons.length; i++) {
      if (!buttons[i].classList.contains("hidden")) {
        buttons[i].disabled = true;
      }
    }
    id("flee-btn").classList.add("hidden");
    id("endgame").classList.remove("hidden");
  }

  /**
   * after every move game is updated, hp, ui, etc
   * @param {json} gameData json of the gameData to help updateGame
   */
  function updateGame(gameData) {
    let p2HP = gameData.p2["current-hp"];
    id("p2").getElementsByClassName("hp")[0].textContent = p2HP + "HP";
    id("p2").getElementsByClassName("health-bar")[0].style.width =
    "" + p2HP / p2Health * HUNDRED + "%";
    if (p2HP / p2Health < LOW_HEALTH) {
      id("p2").getElementsByClassName("health-bar")[0].classList.add("low-health");
    }
    let p1 = id("p1-turn-results");
    p1.textContent = "Player 1 played " + gameData.results["p1-move"] +
    " and " + gameData.results["p1-result"];
    if (gameData.p2["current-hp"] === 0) {
      id("p2-turn-results").innerHTML = "";
      document.querySelector("h1").textContent = "You Won!";
      found(gameData.p2["shortname"]);
      stopGame();
    } else {
      let p1HP = gameData.p1["current-hp"];
      id("p1").getElementsByClassName("hp")[0].textContent = p1HP + "HP";
      id("p1").getElementsByClassName("health-bar")[0].style.width =
       "" + p1HP / p1Health * HUNDRED + "%";
      if (p1HP / p1Health < LOW_HEALTH) {
        id("p1").getElementsByClassName("health-bar")[0].classList.add("low-health");
      }
      if (gameData.results["p1-move"] !== "flee") {
        let p2 = id("p2-turn-results");
        p2.textContent = "Player 2 played " + gameData.results["p2-move"] +
        " and " + gameData.results["p2-result"];
      }
      if (gameData.p1["current-hp"] === 0) {
        document.querySelector("h1").textContent = "You Lost!";
        stopGame();
      }
    }
  }

  /**
   * sends post request and updates game info
   * @param {str} movePlayed the name of a move from a move button
   */
  function playMove(movePlayed) {
    id("loading").classList.remove("hidden");
    let move = movePlayed;
    move = (move.replace(/\s+/g, '')).toLowerCase();
    let params = new FormData();
    params.append("guid", guid);
    params.append("pid", pid);
    params.append("movename", move);
    let url = BASE_URL + GAME;
    fetch(url, {method: "Post", body: params})
      .then(statusCheck)
      .then(resp => resp.json())
      .then(function(response) {
        updateGame(response);
        id("loading").classList.add("hidden");
      })
      .catch(console.error);
  }

  /**
   * begins the game once 'choose pokemon' has been selected,
   * sets of a chain of request and functions
   */
  function beginGame() {
    let name = id("p1").getElementsByClassName("name")[0].textContent;
    p1Health = parseInt(id("p1").getElementsByClassName("hp")[0].textContent.split("HP")[0]);
    let url = BASE_URL + GAME;
    let params = new FormData();
    params.append("startgame", "true");
    params.append("mypokemon", names[name]);
    fetch(url, {method: "Post", body: params})
      .then(statusCheck)
      .then(resp => resp.json())
      .then(generateP2)
      .catch(console.error);
  }

  /**
   * generates player2 card by getting a shorname from a post and then fetching the pokemones info
   * and creating a card
   * @param {json} responseData json of p2 post request -> random pokemon name
   */
  function generateP2(responseData) {
    guid = responseData["guid"];
    pid = responseData["pid"];
    let url = BASE_URL + POKEDEX + "pokemon=" + responseData.p2["shortname"];
    fetch(url)
      .then(statusCheck)
      .then(resp => resp.json())
      .then(loadP2)
      .catch(console.error);
  }

  /**
   * loads player2 card and changes view, essentially begins the game
   * @param {json} responseData json with p2 card info
   */
  function loadP2(responseData) {
    let container = id("p2");
    addAttributes(responseData, container);
    id("pokedex-view").classList.toggle("hidden");
    container.classList.remove("hidden");
    let hp = document.getElementsByClassName("hp-info");
    hp[0].classList.remove("hidden");
    hp[1].classList.remove("hidden");
    id("p1-turn-results").classList.remove("hidden");
    id("p2-turn-results").classList.remove("hidden");
    id("results-container").classList.remove("hidden");
    id("flee-btn").classList.remove("hidden");
    id("start-btn").classList.add("hidden");
    let buttons = document.getElementsByClassName("moves")[0].querySelectorAll("button");
    for (let i = 0; i < buttons.length; i++) {
      if (!buttons[i].classList.contains("hidden")) {
        buttons[i].disabled = false;
      }
    }
    qs("h1").textContent = "Pokemon Battle!";
    p2Health = responseData["hp"];
  }

  /**
   * generates P1 card after you click a pokemon
   * @param {str} name pokemon name
   */
  function generateP1(name) {
    let url = BASE_URL + POKEDEX + "pokemon=" + name;
    fetch(url)
      .then(statusCheck)
      .then(resp => resp.json())
      .then(loadP1)
      .catch(console.error);
  }

  /**
   * get p1 json info and calls addAttributes -> starts enables game
   * @param {json} responseData json of pokemon ifo
   */
  function loadP1(responseData) {
    let container = id("p1");
    addAttributes(responseData, container);
    id("start-btn").classList.remove("hidden");
    id("start-btn").addEventListener("click", beginGame);
  }

  /**
   * adds attributes to player/pokemon card
   * @param {json} responseData json of all the pokemon info
   * @param {dom} container which player it is
   */
  function addAttributes(responseData, container) {
    let pokemonName = container.getElementsByClassName("name");
    pokemonName[0].textContent = responseData["name"];
    let pokePic = container.getElementsByClassName("pokepic");
    pokePic[0].src = BASE_URL + responseData.images["photo"];
    let weakness = container.getElementsByClassName("weakness");
    weakness[0].src = BASE_URL + responseData.images["weaknessIcon"];
    let type = container.getElementsByClassName("type");
    type[0].src = BASE_URL + responseData.images["typeIcon"];
    let health = container.getElementsByClassName("hp");
    health[0].textContent = responseData["hp"] + "HP";
    let description = container.getElementsByClassName("info");
    description[0].textContent = responseData.info["description"];
    let moveContainer = container.getElementsByClassName("moves");
    let moveButtons = moveContainer[0].querySelectorAll("button");
    appendMoves(responseData, moveButtons);
  }

  /**
   * appends all the move info to the buttons
   * @param {json} responseData json object of move info
   * @param {dom} moveButtons dom elements
   */
  function appendMoves(responseData, moveButtons) {
    for (let i = 0; i < moveButtons.length; i++) {
      if (i >= responseData.moves.length) {
        moveButtons[i].classList.add("hidden");
      } else {
        moveButtons[i].classList.remove("hidden");
        let moveName = moveButtons[i].getElementsByClassName("move");
        moveName[0].textContent = responseData.moves[i]["name"];
        if (responseData.moves[i].hasOwnProperty("dp")) {
          let dp = moveButtons[i].getElementsByClassName("dp");
          dp[0].textContent = responseData.moves[i]["dp"] + " DP";
        } else {
          let dp = moveButtons[i].getElementsByClassName("dp");
          dp[0].innerHTML = "";
        }
        let moveImage = moveButtons[i].querySelector("img");
        moveImage.src = BASE_URL + "icons/" + responseData.moves[i]["type"] + ".jpg";
      }
    }
  }

  /**
   * fetch call to load pokedex, first thing that happens basically
   */
  function pokedex() {
    let url = BASE_URL + POKEDEX + "pokedex=all";
    fetch(url)
      .then(statusCheck)
      .then(resp => resp.text())
      .then(loadPokedex)
      .catch(console.error);
  }

  /**
   * loads the pokedex with all the pokemon images
   * @param {json} responseData all the pokemon names
   */
  function loadPokedex(responseData) {
    let data = responseData.split("\n");
    for (let i = 0; i < data.length; i++) {
      let namePair = data[i].split(":");
      names[namePair[0]] = namePair[1];
      let image = document.createElement("img");
      image.classList.add('sprite');
      image.src = BASE_URL + "sprites/" + namePair[1] + ".png";
      image.alt = namePair[1];
      id("pokedex-view").appendChild(image);
    }
    found("bulbasaur");
    found("squirtle");
    found("charmander");
  }

  /**
   * adds new pokemon to the pokedex
   * @param {pokemon} name the shortname of a pokemon
   */
  function found(name) {
    let pokemon = qs("img[alt=" + name + "]");
    if (!pokemon.classList.contains("found")) {
      pokemon.classList.add('found');
      pokemon.addEventListener('click', function() {
        generateP1(this.alt);
      });
    }
  }

  /**
   * checks the server status
   * @param {serverMessage} response takes in server response
   * @returns {error} the server response or an error
   */
  async function statusCheck(response) {
    if (!response.ok) {
      throw new Error(await response.text());
    }
    return response;
  }

  /**
   * helper func
   * @param {id} id input id name
   * @returns {dom }dom element
   */
  function id(id) {
    return document.getElementById(id);
  }

  /**
   * helper func
   * @param {qs} tag input selector
   * @returns {dom} dom element
   */
  function qs(tag) {
    return document.querySelector(tag);
  }

})();