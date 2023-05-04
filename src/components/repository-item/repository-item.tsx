import * as React from 'react';
import Typography from '@mui/material/Typography';
import { Box, IconButton } from '@mui/material';
import { Favorite } from '@mui/icons-material';
import Link from 'next/link';
import { Repository } from '../repository-list/repository-list.types';
import { useEffect, useState } from 'react';
import { useLocalStorageState } from 'react-localstorage-hooks';

export function RepositoryItem({ id, full_name, html_url, description, stargazers_count }: Repository) {
    const [favorites, setFavorites] = useLocalStorageState<Record<number, number>>('favoritesIds', {});
    const [isFavorite, setIsFavorite] = useState(false);
  
    useEffect(() => {
      if (favorites) {
        setIsFavorite(Boolean(favorites[id]));
      }
    }, [favorites, id]);
  
    const handleToggleFavorite = (event: React.MouseEvent) => {
      event.stopPropagation();
      event.preventDefault();
  
      const updatedFavorites = { ...favorites };
  
      if (favorites && favorites[id]) {
        delete updatedFavorites[id];
        setIsFavorite(!favorites[id]);
      } else {
        updatedFavorites[id] = 1;
        setIsFavorite(!updatedFavorites[id]);
      }
  
      setFavorites(updatedFavorites);
    };
      
  
  return (
    <>
      <Box alignItems="flex-start" component={'span'} flexDirection='column' display='flex' marginBottom='1rem' role='listitem'>
        <Box component={'span'}>
          <Link href={html_url} role='title' target='_blank' aria-roledescription='link'>{full_name}</Link>
          <br />
          {description}
        </Box>
        <Box component={'span'}>
          {stargazers_count > 0 && <Typography component={'span'} role='stars' sx={{ color: 'text.secondary' }}>{' ' + stargazers_count + ' stars'}</Typography>}
          <IconButton edge="end" aria-label="favorite" onClick={handleToggleFavorite} role='button'>
            <Favorite color={isFavorite ? 'secondary' : 'primary'} titleAccess={!isFavorite ? 'Add to favourites' : ' Remove from favorites'} />
          </IconButton>
        </Box>
      </Box>
    </>
  );
}
