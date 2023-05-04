import { render, screen, fireEvent } from '@testing-library/react';
import { RepositoryList } from './repository-list';

const mockItems = {
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
  };
  
  const mockLanguages = {
    JavaScript: [1],
    TypeScript: [2],
  };
  
  const isEmptyMessage = 'No repositories found.';
  
  describe('RepositoryList', () => {
    test('renders language buttons and filters repositories on click', () => {
      render(
        <RepositoryList
          items={mockItems}
          languages={mockLanguages}
          isEmptyMessage={isEmptyMessage}
          isLoading={false}
          isError={false}
        />
      );
  
      const javaScriptButton = screen.getByRole('button', { name: 'JavaScript' });
      const typeScriptButton = screen.getByRole('button', { name: 'TypeScript' });
      const allButton = screen.getByRole('button', { name: 'All' });
  
      expect(javaScriptButton).toBeInTheDocument();
      expect(typeScriptButton).toBeInTheDocument();
      expect(allButton).toBeInTheDocument();
  
      // Initially, both repositories should be visible.
      expect(screen.getByText('test/repository1')).toBeInTheDocument();
      expect(screen.getByText('test/repository2')).toBeInTheDocument();
  
      // Click the JavaScript button and check if only the JavaScript repository is visible.
      fireEvent.click(javaScriptButton);
      expect(screen.getByText('test/repository1')).toBeInTheDocument();
      expect(screen.queryByText('test/repository2')).not.toBeInTheDocument();
  
      // Click the TypeScript button and check if only the TypeScript repository is visible.
      fireEvent.click(typeScriptButton);
      expect(screen.queryByText('test/repository1')).not.toBeInTheDocument();
      expect(screen.getByText('test/repository2')).toBeInTheDocument();
  
      // Click the All button and check if both repositories are visible again.
      fireEvent.click(allButton);
      expect(screen.getByText('test/repository1')).toBeInTheDocument();
      expect(screen.getByText('test/repository2')).toBeInTheDocument();
    });
  });
  