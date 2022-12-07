import React from 'react';
import { act } from 'react-dom/test-utils';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import renderWithRouter from '../renderWithRouter';

describe('Bateria de teste para verificar os elementos que aparecerão na tela no momento da inicialização do app e seu comportamento', () => {
  test('Testa se existe a uma barra de navegação no momento da inicalização do app', () => {
    renderWithRouter(<App />);
    const captureHome = screen.getByRole('link', { name: /home/i });
    const captureAbout = screen.getByRole('link', { name: /about/i });
    const captureFavorite = screen.getByRole('link', { name: /favorite pokémon/i });

    expect(captureHome).toBeInTheDocument();
    expect(captureAbout).toBeInTheDocument();
    expect(captureFavorite).toBeInTheDocument();
  });

  test('Verifica a mudança de rota ao interagir com o botão `Home`', () => {
    const { history } = renderWithRouter(<App />);

    const captureHome = screen.getByRole('link', { name: /home/i });

    userEvent.click(captureHome);

    const { location: { pathname } } = history;

    expect(pathname).toBe('/');
  });

  test('Verifica a mudança de rota ao interagir com o botão `About`', () => {
    const { history } = renderWithRouter(<App />);

    const captureAbout = screen.getByRole('link', { name: /about/i });

    userEvent.click(captureAbout);

    const { location: { pathname } } = history;

    expect(pathname).toBe('/about');
  });

  test('Verifica a mudança de rota ao interagir com o botão `Favorite Pokémon`', () => {
    const { history } = renderWithRouter(<App />);

    const captureFavorite = screen.getByRole('link', { name: /favorite pokémon/i });

    userEvent.click(captureFavorite);

    const { location: { pathname } } = history;

    expect(pathname).toBe('/favorites');
  });

  test('Verifica existência da página `Not Found`', () => {
    const { history } = renderWithRouter(<App />);

    act(() => history.push('not-existence-page'));

    const captureNotFound = screen.getByRole('heading', { name: /^Page requested not found$/, level: 2 });

    expect(captureNotFound).toBeInTheDocument();
  });
});
