import { act } from 'react-dom/test-utils';
import { screen } from '@testing-library/react';
import renderWithRouter from '../renderWithRouter';
import App from '../App';

function tryAccessToInexistencePage() {
  const page = renderWithRouter(<App />);
  const NotFoundPage = act(() => page.history.push('/xablau'));
  return NotFoundPage;
}

describe('Sequência de testes relacionadas à página `Not Found`', () => {
  test('Verifica se existe um cabeçalho com texto específico ao tentar acesso à uma página inexistente', () => {
    tryAccessToInexistencePage();

    const captureHead = screen.getByRole('heading', { name: /Page requested not found/, level: 2 });
    expect(captureHead).toBeInTheDocument();
  });

  test('Verifica se existe uma imagem específica ao tentar acesso à uma página inexistenete', () => {
    tryAccessToInexistencePage();

    const captureImage = screen.getByAltText(/^Pikachu crying because the page requested was not found$/);
    expect(captureImage).toBeInTheDocument();
    expect(captureImage).toHaveAttribute('src', 'https://media.giphy.com/media/kNSeTs31XBZ3G/giphy.gif');
  });
});
