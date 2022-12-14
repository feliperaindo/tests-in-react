import { act } from 'react-dom/test-utils';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouter from '../renderWithRouter';
import pokemonList from '../data';
import App from '../App';

const FAVORITES = '/favorites';

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

function makePokemonFavorite() {
  const capturePokemonDetailsButton = screen.getByRole('link', { name: /^more details$/i });
  act(() => userEvent.click(capturePokemonDetailsButton));
  const captureFavoriteButton = screen.getByRole('checkbox');
  userEvent.click(captureFavoriteButton);
}

function changePokemonPosition(moves) {
  const getNextPokemonButton = screen.getByTestId(/^next-pokemon$/i);
  for (let index = 0; index < moves; index += 1) {
    act(() => userEvent.click(getNextPokemonButton));
  }
}

describe('Sequência de testes do componente `Pokemon`', () => {
  beforeEach(() => localStorage.clear());

  test('Verifica se são rendenizadas as informações do Pokemon ao carregar a página principal', () => {
    renderWithRouter(<App />);
    checkPageInfo(pokemonList[0]);
  });

  test('Verifica se ao clicar em `More Details` a aplicação redireciona para a página correta', () => {
    const { history } = renderWithRouter(<App />);

    const getDetailsButton = screen.getByRole('link', { name: /^more details$/i });

    act(() => userEvent.click(getDetailsButton));

    expect(history.location.pathname).toBe(`/pokemon/${pokemonList[0].id}`);
  });

  test('Verifica se a rota `/pokemon/:id` rendeniza as informações corretas do Pokémon', () => {
    renderWithRouter(<App />);

    const { name, image, type, foundAt, summary,
      averageWeight: { value, measurementUnit } } = pokemonList[1];

    changePokemonPosition(1);

    const getDetailsButton = screen.getByRole('link', { name: /^more details$/i });

    act(() => userEvent.click(getDetailsButton));

    const getPokemonName = screen.getByTestId(/^pokemon-name$/);
    const getPokemonType = screen.getByTestId(/^pokemon-type$/);
    const getPokemonWeight = screen.getByTestId(/^pokemon-weight$/);
    const getImagePokemon = screen.getByAltText(`${name} sprite`);
    const getDescription = screen.getByText(summary);

    expect(getPokemonName).toBeInTheDocument();
    expect(getPokemonType).toBeInTheDocument();
    expect(getPokemonWeight).toBeInTheDocument();
    expect(getImagePokemon).toBeInTheDocument();
    expect(getDescription).toBeInTheDocument();

    expect(getPokemonName).toHaveTextContent(name);
    expect(getPokemonType).toHaveTextContent(type);
    expect(getPokemonWeight)
      .toHaveTextContent(`Average weight: ${value} ${measurementUnit}`);
    expect(getImagePokemon).toHaveAttribute('src', image);

    const getHeads = screen.getAllByRole('heading', { level: 2 });

    expect(getHeads[0]).toBeInTheDocument();
    expect(getHeads[1]).toBeInTheDocument();
    expect(getHeads[2]).toBeInTheDocument();

    expect(getHeads[0]).toHaveTextContent(`${name} Details`);
    expect(getHeads[1]).toHaveTextContent(/^summary$/i);
    expect(getHeads[2]).toHaveTextContent(`Game Locations of ${name}`);

    const getLocationsOnScreen = screen.getAllByAltText(`${name} location`);

    foundAt.forEach(({ location, map }, index) => {
      const getNameLocation = screen.getByText(location);

      expect(getLocationsOnScreen[index]).toHaveAttribute('src', map);
      expect(getNameLocation).toBeInTheDocument();
    });
  });

  test('Verifica se a função favoritar Pokémon opera adequadamente', () => {
    const { history } = renderWithRouter(<App />);

    changePokemonPosition(3);
    makePokemonFavorite();
    act(() => history.push('/'));
    changePokemonPosition(2);
    makePokemonFavorite();
    act(() => history.push('/'));

    const getNomalButton = screen.getByRole('button', { name: /^normal$/i });
    act(() => userEvent.click(getNomalButton));
    makePokemonFavorite();

    act(() => history.push(FAVORITES));

    const getPokemonName = screen.getAllByTestId(/^pokemon-name$/);
    const getPokemonType = screen.getAllByTestId(/^pokemon-type$/);
    const getPokemonWeight = screen.getAllByTestId(/^pokemon-weight$/);
    const getDetailsButton = screen.getAllByRole('link', { name: /^more details$/i });

    expect(getPokemonName).toHaveLength(3);
    expect(getPokemonType).toHaveLength(3);
    expect(getPokemonWeight).toHaveLength(3);
    expect(getDetailsButton).toHaveLength(3);

    const getNames = getPokemonName.map((pokemon) => pokemon.textContent);
    const getPokemonFromData = pokemonList.filter(({ name }) => getNames.includes(name));

    expect(getPokemonFromData).toHaveLength(3);

    const getFavoriteIconOne = screen
      .getByAltText(`${getNames[0]} is marked as favorite`);
    const getFavoriteIconTwo = screen
      .getByAltText(`${getNames[1]} is marked as favorite`);
    const getFavoriteIconThree = screen
      .getByAltText(`${getNames[2]} is marked as favorite`);

    const pathStarIcon = '/star-icon.svg';

    expect(getFavoriteIconOne).toBeInTheDocument();
    expect(getFavoriteIconTwo).toBeInTheDocument();
    expect(getFavoriteIconThree).toBeInTheDocument();

    expect(getFavoriteIconOne).toHaveAttribute('src', pathStarIcon);
    expect(getFavoriteIconTwo).toHaveAttribute('src', pathStarIcon);
    expect(getFavoriteIconThree).toHaveAttribute('src', pathStarIcon);
  });

  test('Verifica a remoção de um pokémon do campo de favorito', () => {
    const { history } = renderWithRouter(<App />);

    changePokemonPosition(6);
    makePokemonFavorite();
    act(() => history.push('/'));
    changePokemonPosition(4);
    makePokemonFavorite();
    act(() => history.push('/'));

    const getNomalButton = screen.getByRole('button', { name: /^dragon$/i });
    act(() => userEvent.click(getNomalButton));
    makePokemonFavorite();

    act(() => history.push(FAVORITES));
    const getPokemonName = screen.getAllByTestId(/^pokemon-name$/);
    const getPokemonType = screen.getAllByTestId(/^pokemon-type$/);
    const getPokemonWeight = screen.getAllByTestId(/^pokemon-weight$/);
    const getDetailsButton = screen.getAllByRole('link', { name: /^more details$/i });

    expect(getPokemonName).toHaveLength(3);
    expect(getPokemonType).toHaveLength(3);
    expect(getPokemonWeight).toHaveLength(3);
    expect(getDetailsButton).toHaveLength(3);

    const getNames = getPokemonName.map((pokemon) => pokemon.textContent);
    const getPokemonFromData = pokemonList.filter(({ name }) => getNames.includes(name));

    expect(getPokemonFromData).toHaveLength(3);

    act(() => userEvent.click(getDetailsButton[2]));
    const captureFavoriteButton = screen.getByRole('checkbox');
    userEvent.click(captureFavoriteButton);

    act(() => history.push(FAVORITES));

    expect(screen.getAllByTestId(/^pokemon-name$/)).toHaveLength(2);
    expect(screen.getAllByTestId(/^pokemon-type$/)).toHaveLength(2);
    expect(screen.getAllByTestId(/^pokemon-weight$/)).toHaveLength(2);
    expect(screen.getAllByRole('link', { name: /^more details$/i })).toHaveLength(2);

    const getNamesAgain = screen.getAllByTestId(/^pokemon-name$/).map((pokemon) => pokemon.textContent);
    const getPokemonFromDataAgain = pokemonList
      .filter(({ name }) => getNamesAgain.includes(name));

    expect(getPokemonFromDataAgain).toHaveLength(2);
  });
});
