import { render, screen, fireEvent } from '@testing-library/react';
import { RepositoryItem } from './repository-item';
import { useLocalStorageState } from 'react-localstorage-hooks';
import * as React from 'react';

jest.mock('react-localstorage-hooks', () => ({
  useLocalStorageState: jest.fn(() => [{}, jest.fn()]),
}));

const mockRepository = {
  id: 1,
  full_name: 'test/repository',
  html_url: 'https://github.com/test/repository',
  description: 'A test repository',
  stargazers_count: 10
};

describe('RepositoryItem', () => {
  test('renders repository item correctly', async () => {
    render(<RepositoryItem {...mockRepository} />);
  
    expect(await screen.findByText(mockRepository.full_name)).toBeInTheDocument();
    expect(await screen.findByText(mockRepository.description)).toBeInTheDocument();
    expect(await screen.findByText(`${mockRepository.stargazers_count} stars`)).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
  

  test('toggles favorite state correctly', () => {
    const setFavorites = jest.fn();
    (useLocalStorageState as jest.Mock).mockImplementation(() => [{}, setFavorites]);
  
    render(<RepositoryItem {...mockRepository} />);
  
    const favoriteButton = screen.getByRole('button');
    fireEvent.click(favoriteButton);
  
    expect(setFavorites).toHaveBeenLastCalledWith({ [mockRepository.id]: 1 });
  
    fireEvent.click(favoriteButton);
  
    expect(setFavorites).toHaveBeenLastCalledWith({"1": 1});
  });
});
