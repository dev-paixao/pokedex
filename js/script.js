const pokemonName = document.querySelector('.pokemon-name');
const pokemonNumber = document.querySelector('.pokemon-id');
const pokemonImage = document.querySelector('.pokemon-img');
const pokemonEvolution = document.querySelector('.pokemon-evolution');
const pokemonAbilitiesList = document.querySelector('.pokemon-abilities');
const pokemonTypesList = document.querySelector('.pokemon-types');

const form = document.querySelector('.form');
const input = document.querySelector('.input-search');
const buttonPrev = document.querySelector('.btn-prev');
const buttonNext = document.querySelector('.btn-next');

let searchPokemon = 1;

const fetchPokemon = async (pokemon) => {
  const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);

  if (APIResponse.status === 200) {
    const data = await APIResponse.json();
    return data;
  }
}

const fetchEvolution = async (pokemon) => {
    const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon}`);
  
    if (APIResponse.status === 200) {
      const data = await APIResponse.json();
      const evolutionChain = await fetch(data.evolution_chain.url);
      const evolutionData = await evolutionChain.json();
      return evolutionData;
    }
  }

const renderPokemon = async (pokemon) => {

  pokemonName.innerHTML = 'Loading...';
  pokemonNumber.innerHTML = '';

  const data = await fetchPokemon(pokemon);

  if (data) {
    pokemonImage.style.display = 'block';
    pokemonName.innerHTML = data.name;
    pokemonNumber.innerHTML = data.id;
    pokemonImage.src = data['sprites']['versions']['generation-v']['black-white']['animated']['front_default'];

    pokemonTypesList.innerHTML = '';
    if (data['types'].length > 1) {
      const types = data['types'];
      const typesList = document.createElement('ul');
    
      types.forEach((type) => {
        const typeItem = document.createElement('li');
        typeItem.textContent = type['type']['name'];
        typesList.appendChild(typeItem);
      });
    
      pokemonTypesList.appendChild(typesList);
    } else {
      const types = data['types'];
            
      pokemonTypesList.innerHTML = `
        <li>${types[0]['type']['name']}</li>
      `;
    }

    pokemonAbilitiesList.innerHTML = '';
    if (data['abilities'].length > 1) {
        const abilities = data['abilities'];
        const abilitiesList = document.createElement('ul');
        
        abilities.forEach((ability) => {
          const abilityItem = document.createElement('li');
          abilityItem.textContent = ability['ability']['name'];
          abilitiesList.appendChild(abilityItem);
        });
        
        pokemonAbilitiesList.appendChild(abilitiesList);
      } else {
        const pokemonAbilities = data['abilities'];
        
        pokemonAbilitiesList.innerHTML = `
          <li>${pokemonAbilities[0]['ability']['name']}</li>
        `;
      }
    input.value = '';
    searchPokemon = data.id;

    const evolutionData = await fetchEvolution(data.id);
    if (evolutionData) {
        let evolutions = [];
        let currentEvolution = evolutionData.chain;
        while (currentEvolution) {
          evolutions.push(currentEvolution.species.name);
          currentEvolution = currentEvolution['evolves_to'][0];
        }
        pokemonEvolution.innerHTML = evolutions.join(' > ');
      } else {
        pokemonEvolution.innerHTML = 'No evolution data available.';
      }
     
  } else {
    pokemonImage.style.display = 'none';
    pokemonName.innerHTML = 'Not found :c';
    pokemonNumber.innerHTML = '';
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  renderPokemon(input.value.toLowerCase());
});

buttonPrev.addEventListener('click', () => {
  if (searchPokemon > 1) {
    searchPokemon -= 1;
    renderPokemon(searchPokemon);
  }
});

buttonNext.addEventListener('click', () => {
  searchPokemon += 1;
  renderPokemon(searchPokemon);
});

renderPokemon(searchPokemon);