import { screen } from '@testing-library/react';
import renderWithRouter from '../renderWithRouter';
import { About } from '../pages';

describe('Sequência de testes para verificar operacionalidade da página `About`', () => {
  beforeEach(() => renderWithRouter(<About />));

  test('Verifica se a página contém uma imagem advinda de uma URL', () => {
    const captureImg = screen.getByRole('img');
    expect(captureImg).toBeInTheDocument();
    expect(captureImg).toHaveAttribute('src', 'https://cdn2.bulbagarden.net/upload/thumb/8/86/Gen_I_Pok%C3%A9dex.png/800px-Gen_I_Pok%C3%A9dex.png');
    expect(captureImg).toHaveAttribute('alt', 'Pokédex');
  });

  test('Verifica se a página contém uma tag `h2` com o texto `About Pokédex`', () => {
    const getHead = screen.getByRole('heading', { name: /^About Pokédex$/, level: 2 });

    expect(getHead).toBeInTheDocument();
  });

  test('Verifica se contém dois parágrafos explicativos sobre a Pokédex', () => {
    const getFirstText = screen.getByText(/This application simulates a Pokédex, a digital encyclopedia containing all Pokémon/);
    const getSecondText = screen.getByText(/One can filter Pokémon by type, and see more details for each one of them/);

    expect(getFirstText).toBeInTheDocument();
    expect(getSecondText).toBeInTheDocument();
  });
});
