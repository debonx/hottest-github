import { render, screen, fireEvent } from '@testing-library/react';
import RepositoryTabs from './repository-tabs';
import { getFavoritedRepositories } from '../../utils/dataHandler';
import { useQuery } from '@tanstack/react-query';

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
}));

jest.mock('../../utils/dataHandler', () => ({
  fetchRepositories: jest.fn(),
  getFavoritedRepositories: jest.fn(),
}));

jest.mock('react-localstorage-hooks', () => ({
  useLocalStorageState: jest.fn(() => [{}, jest.fn()]),
}));

const mockRepositories = {
    items: {
      1: {
        id: 1,
        full_name: 'test/repository1',
        html_url: 'https://github.com/test/repository1',
        description: 'A test repository 1',
        stargazers_count: 10,
        language: 'JavaScript',
      },
      2: {
        id: 2,
        full_name: 'test/repository2',
        html_url: 'https://github.com/test/repository2',
        description: 'A test repository 2',
        stargazers_count: 20,
        language: 'TypeScript',
      },
    },
    items_ids_by_language: {
      JavaScript: [1],
      TypeScript: [2],
    },
  };
  
  const mockFavoritedRepositories = {
    items: {
      1: {
        id: 1,
        full_name: 'test/repository1',
        html_url: 'https://github.com/test/repository1',
        description: 'A test repository 1',
        stargazers_count: 10,
        language: 'JavaScript',
      },
    },
    items_ids_by_language: {
      JavaScript: [1],
    },
  };

  describe('RepositoryTabs', () => {
    beforeEach(() => {
      (useQuery as jest.Mock).mockReturnValue({
        data: mockRepositories,
        isLoading: false,
        isError: false,
      });
  
      (getFavoritedRepositories as jest.Mock).mockReturnValue(mockFavoritedRepositories);
    });
  
    test('renders tabs and switches content on click', () => {
      render(<RepositoryTabs />);
  
      const repositoriesTab = screen.getByRole('tab', { name: 'Repositories' });
      const favoritesTab = screen.getByRole('tab', { name: 'Favorites' });
  
      expect(repositoriesTab).toBeInTheDocument();
      expect(favoritesTab).toBeInTheDocument();
  
        // Check if the Repositories tab is selected by default.
      expect(repositoriesTab).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByText('test/repository1')).toBeInTheDocument();
      expect(screen.getByText('test/repository2')).toBeInTheDocument();
  
      // Click the Favorites tab and check if the content switches to the favorited repositories list.
      fireEvent.click(favoritesTab);
      expect(favoritesTab).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByText('test/repository1')).toBeInTheDocument();
      expect(screen.queryByText('test/repository2')).not.toBeInTheDocument();
  
      // Click the Repositories tab again and check if the content switches back to the repository list.
      fireEvent.click(repositoriesTab);
      expect(repositoriesTab).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByText('test/repository1')).toBeInTheDocument();
      expect(screen.getByText('test/repository2')).toBeInTheDocument();
    });
  });
  