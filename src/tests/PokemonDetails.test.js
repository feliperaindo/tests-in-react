import { act } from 'react-dom/test-utils';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouter from '../renderWithRouter';
import pokemonList from '../data';
import App from '../App';

function changePokemonPosition(moves) {
  const getNextPokemonButton = screen.getByTestId(/^next-pokemon$/i);
  for (let index = 0; index < moves; index += 1) {
    act(() => userEvent.click(getNextPokemonButton));
  }
}

describe('Sequência de testes do componente `Pokemon Details`', () => {
  beforeEach(() => localStorage.clear());

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
    expect(getDetailsButton).not.toBeInTheDocument();

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

  test('Verifica a funcionalidade de favoritar um Pokémon através da página de detalhes', () => {
    renderWithRouter(<App />);

    changePokemonPosition(5);

    const getDetailsButton = screen.getByRole('link', { name: /^more details$/i });

    act(() => userEvent.click(getDetailsButton));

    const captureFavoriteButton = screen.getByRole('checkbox', { name: /Pokémon favoritado?/ });

    expect(captureFavoriteButton).toBeInTheDocument();

    act(() => userEvent.click(captureFavoriteButton));

    expect(screen.getByRole('checkbox', { name: /Pokémon favoritado?/ })).toHaveProperty('checked', true);
  });
});
