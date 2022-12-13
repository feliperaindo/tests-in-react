import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import renderWithRouter from '../renderWithRouter';
import pokemonList from '../data';
import App from '../App';

const GET_TYPES = pokemonList.reduce((types, { type }) => ((types.includes(type))
  ? types : [...types, type]), []);

function checkHead() {
  const getHead = screen.getByRole('heading', { name: /Encountered Pokémon/, level: 2 });
  expect(getHead).toBeInTheDocument();
}

function checkPageInfo(pokemon) {
  const { name, image, type,
    averageWeight: { value, measurementUnit } } = pokemon;

  const getPokemonName = screen.getByTestId(/^pokemon-name$/);
  const getPokemonType = screen.getByTestId(/^pokemon-type$/);
  const getPokemonWeight = screen.getByTestId(/^pokemon-weight$/);
  const getDetailsButton = screen.getByRole('link', { name: /^more details$/i });
  const getImagePokemon = screen.getByAltText(`${name} sprite`);

  expect(getPokemonName).toBeInTheDocument();
  expect(getPokemonType).toBeInTheDocument();
  expect(getPokemonWeight).toBeInTheDocument();
  expect(getDetailsButton).toBeInTheDocument();
  expect(getImagePokemon).toBeInTheDocument();

  expect(getPokemonName).toHaveTextContent(name);
  expect(getPokemonType).toHaveTextContent(type);
  expect(getPokemonWeight)
    .toHaveTextContent(`Average weight: ${value} ${measurementUnit}`);
  expect(getImagePokemon).toHaveAttribute('src', image);
}

function checkButtons() {
  const getAllButton = screen.getByRole('button', { name: /^all$/i });
  const getNextPokemonButton = screen.getByTestId(/^next-pokemon$/);
  const getTypeButtons = screen.getAllByTestId(/pokemon-type-button/);
  const getTextButtons = getTypeButtons.map((button) => button.textContent);

  expect(getNextPokemonButton).toBeInTheDocument();
  expect(getAllButton).toBeInTheDocument();
  expect(getTypeButtons.length).toBe(GET_TYPES.length);
  GET_TYPES.forEach((type) => {
    expect(getTextButtons).toContain(type);
  });
}

describe('Sequencia de testes para veficiar existência de elementos na página `Pokedex`', () => {
  beforeEach(() => renderWithRouter(<App />));

  test('Verifica a existência de uma heading com texto específico ao rendenizar componente', () => {
    checkHead();
  });

  test('Verifica se existem as informação do pokemon assim que a aplicação é carregada', () => {
    checkPageInfo(pokemonList[0]);
  });

  test('Verifica se existem os botões esperados na página', () => {
    checkButtons();
  });
});

describe('Sequência de testes relacionadas à interação do usuário com a página', () => {
  beforeEach(() => renderWithRouter(<App />));

  test('Verifica se os botões fazem a filtragem adequadamente', () => {
    const getTypeButtons = screen.getAllByTestId(/pokemon-type-button/);

    getTypeButtons.forEach((button) => {
      act(() => userEvent.click(button));

      const getPokemonsByType = pokemonList
        .filter(({ type }) => button.textContent === type);

      checkHead();
      checkPageInfo(getPokemonsByType[0]);
      checkButtons();

      const getNextPokemonButton = screen.getByTestId(/^next-pokemon$/);

      if (getPokemonsByType.length === 1) {
        expect(getNextPokemonButton).toBeDisabled();
      } else {
        expect(getNextPokemonButton).toBeEnabled();
      }
    });
  });

  test('Verifica se o botão `all` retorna ao status esperado da página', () => {
    const getTypeButtons = screen.getAllByTestId(/pokemon-type-button/);

    act(() => userEvent.click(getTypeButtons[2]));

    const getAllButton = screen.getByRole('button', { name: /^all$/i });

    act(() => userEvent.click(getAllButton));

    checkHead();
    checkPageInfo(pokemonList[0]);
    checkButtons();

    const getNextPokemonButton = screen.getByTestId(/^next-pokemon$/);

    expect(getNextPokemonButton).toBeEnabled();
  });
});

describe('Sequência de testes para verificar se todos os pokemons da lista são rendenizados adequadamente', () => {
  beforeEach(() => renderWithRouter(<App />));

  test('Verifica se são rendenizados todos os pokemons que estão contidos na lista', () => {
    const getNextPokemonButton = screen.getByTestId(/^next-pokemon$/);

    pokemonList.forEach((pokemon) => {
      checkPageInfo(pokemon);
      act(() => userEvent.click(getNextPokemonButton));
    });
  });

  test('verifica se são rendenizados todos os pokemons correspondentes à filtragem', () => {
    const getTypeButtons = screen.getAllByTestId(/pokemon-type-button/);

    getTypeButtons.forEach((typeButton) => {
      act(() => userEvent.click(typeButton));

      const getPokemonsByType = pokemonList
        .filter(({ type }) => type === typeButton.textContent);

      if (getPokemonsByType.length > 1) {
        getPokemonsByType.forEach((pokemon) => {
          checkPageInfo(pokemon);
          const getNextPokemonButton = screen.getByTestId(/^next-pokemon$/);
          act(() => userEvent.click(getNextPokemonButton));
        });
      }
    });
  });
});
