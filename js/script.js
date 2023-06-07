// Selecionando os elementos HTML
const pokemonName = document.querySelector('.pokemon-name');
const pokemonImage = document.querySelector('.pokemon-img');
const pokemonEvolution = document.querySelector('.pokemon-evolution');
const pokemonAbilitiesList = document.querySelector('.pokemon-abilities');
const pokemonTypesList = document.querySelector('.pokemon-types');
const pokemonDescription = document.querySelector('.pokemon-description');
const pokemonStats = document.querySelector('.pokemon-stats');
const pokemonHP = document.querySelector('.pokemon-hp');
const pokemonHeight = document.querySelector('.pokemon-height');
const pokemonWeight = document.querySelector('.pokemon-weight');

const form = document.querySelector('.form');
const input = document.querySelector('.input-search');
const buttonPrev = document.querySelector('.btn-prev');
const buttonNext = document.querySelector('.btn-next');

let searchPokemon = 1;

// Função para buscar os dados do Pokémon na API
const fetchPokemon = async (pokemon) => {
  const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);

  if (APIResponse.status === 200) {
    const data = await APIResponse.json();
    return data;
  }
}

// Função para buscar a evolução do Pokémon na API
const fetchEvolution = async (pokemon) => {
  const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon}`);

  if (APIResponse.status === 200) {
    const data = await APIResponse.json();
    const evolutionChain = await fetch(data.evolution_chain.url);
    const evolutionData = await evolutionChain.json();
    return evolutionData;
  }
}

// Função para buscar a descrição do Pokémon na API
const fetchPokemonDescription = async (pokemon) => {
  const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon}`);

  if (APIResponse.status === 200) {
    const data = await APIResponse.json();
    const description = data.flavor_text_entries.find(entry => entry.language.name === 'en');
    return description.flavor_text;
  }
}

// Função para buscar o ID do Pokémon na API
const fetchPokemonId = async (pokemon) => {
  const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);

  if (APIResponse.status === 200) {
    const data = await APIResponse.json();
    return data.id;
  }
}

// Função para buscar o sprite do Pokémon na API
const fetchPokemonSprite = async (pokemonId) => {
  const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);

  if (APIResponse.status === 200) {
    const data = await APIResponse.json();
    return data.sprites.front_default;
  }
}

// Função para renderizar os dados do Pokémon na página
const renderPokemon = async (pokemon) => {
  pokemonName.innerHTML = 'Loading...';

  const data = await fetchPokemon(pokemon);

  if (data) {
    pokemonImage.style.display = 'block';
    pokemonName.innerHTML = data.name;
    pokemonImage.src = data.sprites.other['official-artwork'].front_default;

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
        const evolutionId = await fetchPokemonId(currentEvolution.species.name);
        const evolutionSprite = await fetchPokemonSprite(evolutionId);
        const evolutionName = currentEvolution.species.name;

        const evolutionContainer = document.createElement('div');
        evolutionContainer.classList.add('evolution-item');

        const evolutionImg = document.createElement('img');
        evolutionImg.src = evolutionSprite;
        evolutionImg.alt = evolutionName;

        const evolutionNameElement = document.createElement('span');
        evolutionNameElement.textContent = evolutionName;

        evolutionContainer.appendChild(evolutionImg);
        evolutionContainer.appendChild(evolutionNameElement);

        evolutions.push(evolutionContainer.outerHTML);
        currentEvolution = currentEvolution['evolves_to'][0];
      }

      pokemonEvolution.innerHTML = '';
      const evolutionWrapper = document.createElement('div');
      evolutionWrapper.classList.add('evolution-wrapper');
      evolutionWrapper.innerHTML = evolutions.join('>');
      pokemonEvolution.appendChild(evolutionWrapper);
    } else {
      pokemonEvolution.innerHTML = 'No evolution data available.';
    }

    const description = await fetchPokemonDescription(data.name);
    if (description) {
      pokemonDescription.textContent = description;
    } else {
      pokemonDescription.textContent = 'No description available.';
    }

    // Exibir as informações de HP, Height e Weight
    pokemonStats.style.display = 'block';

    const hpValue = data.stats.find(stat => stat.stat.name === 'hp').base_stat;
    const hpHearts = Math.ceil(hpValue / 20); // Calcular o número de corações baseado no HP
    const numHearts = 5; // Exibir sempre 5 corações
    pokemonHP.innerHTML = ''; // Limpar o conteúdo atual

    for (let i = 0; i < numHearts; i++) {
      const heartIcon = document.createElement('i');
      heartIcon.classList.add('fas', 'fa-heart', 'heart-icon');
      
      if (i < hpHearts) {
        heartIcon.style.color = 'red'; // Alterar a cor para vermelho para corações preenchidos
      }

      pokemonHP.appendChild(heartIcon);
    }

    // Converter o Height e o Weight para metros e quilogramas
    pokemonHeight.textContent = `${data.height / 10} m`;
    pokemonWeight.textContent = `${data.weight / 10} kg`;

  } else {
    pokemonImage.style.display = 'none';
    pokemonName.innerHTML = 'Not found :c';
    pokemonTypesList.innerHTML = '';
    pokemonAbilitiesList.innerHTML = '';
    pokemonEvolution.innerHTML = '';
    pokemonDescription.textContent = '';
    pokemonStats.style.display = 'none';
  }
};

// Função para lidar com o evento de envio do formulário
const handleFormSubmit = (event) => {
  event.preventDefault();
  const searchValue = input.value.toLowerCase();
  renderPokemon(searchValue);
};

// Função para lidar com o evento do botão "Anterior"
const handlePrevClick = () => {
  searchPokemon--;
  if (searchPokemon < 1) {
    searchPokemon = 1;
  }
  renderPokemon(searchPokemon);
};

// Função para lidar com o evento do botão "Próximo"
const handleNextClick = () => {
  searchPokemon++;
  renderPokemon(searchPokemon);
};

// Adicionar os event listeners aos elementos
form.addEventListener('submit', handleFormSubmit);
buttonPrev.addEventListener('click', handlePrevClick);
buttonNext.addEventListener('click', handleNextClick);

// Renderizar o primeiro Pokémon ao carregar a página
renderPokemon(searchPokemon);
