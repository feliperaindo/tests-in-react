import { act } from 'react-dom/test-utils';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouter from '../renderWithRouter';
import { FavoritePokemon } from '../pages';
import App from '../App';

function makePokemonFavorite() {
  const capturePokemonDetailsButton = screen.getByRole('link', { name: /more details/i });
  userEvent.click(capturePokemonDetailsButton);
  const captureFavoriteButton = screen.getByRole('checkbox');
  userEvent.click(captureFavoriteButton);
}

describe('Sequência de testes para verificar a integridade e operacionalidade do componente `FavoritePokemon`', () => {
  afterEach(() => localStorage.clear());

  test('Verifica a rendnização dos elementos na tela, caso não haja nenhum pokémon na lista', () => {
    renderWithRouter(<FavoritePokemon />);

    const getHead = screen.getByRole('heading', { name: /^Favorite Pokémon$/, level: 2 });

    expect(getHead).toBeInTheDocument();
  });

  test('Verifica se é exibido mensagem apropriada caso não haja nenhum pokémon nos favoritos', () => {
    renderWithRouter(<FavoritePokemon />);

    const captureMensage = screen.getByText(/^No favorite Pokémon found$/);

    expect(captureMensage).toBeInTheDocument();
  });

  test('Verifica se é rendenizado 1 (um) card caso haja apenas 1 (um) pokemon na lista de favoritos', () => {
    const { history } = renderWithRouter(<App />);

    makePokemonFavorite();

    act(() => history.push('/favorites'));

    const getPokemonName = screen.getAllByTestId(/pokemon-name/);
    const getPokemonType = screen.getAllByTestId(/pokemon-type/);
    const getPokemonWeight = screen.getAllByTestId(/pokemon-weight/);

    expect(getPokemonName).toHaveLength(1);
    expect(getPokemonType).toHaveLength(1);
    expect(getPokemonWeight).toHaveLength(1);
  });

  test('Verifica se serão rendenizados 3 (três) cards caso existam 3 (três) pokemons na lista de favoritos', () => {
    const { history } = renderWithRouter(<App />);

    makePokemonFavorite();

    act(() => history.goBack());
    userEvent.click(screen.getByTestId(/next-pokemon/));
    makePokemonFavorite();

    act(() => history.goBack());
    userEvent.click(screen.getByTestId(/next-pokemon/));
    userEvent.click(screen.getByTestId(/next-pokemon/));
    makePokemonFavorite();

    act(() => history.push('/favorites'));

    const getPokemonName = screen.getAllByTestId(/pokemon-name/);
    const getPokemonType = screen.getAllByTestId(/pokemon-type/);
    const getPokemonWeight = screen.getAllByTestId(/pokemon-weight/);

    expect(getPokemonName).toHaveLength(3);
    expect(getPokemonType).toHaveLength(3);
    expect(getPokemonWeight).toHaveLength(3);
  });
});
