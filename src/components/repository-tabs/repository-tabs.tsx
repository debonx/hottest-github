import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { a11yProps } from './repository-tabs.helpers';
import { RepositoryList } from '../repository-list/repository-list';
import { RepositoryResponseProcessed, fetchRepositories, getFavoritedRepositories } from '@/utils/dataHandler';
import { useQuery } from '@tanstack/react-query';
import { useLocalStorageState } from 'react-localstorage-hooks';
import { useEffect, useState } from 'react';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <Box component={'div'}
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      sx={{ padding: '20px 0 20px' }}
      {...other}
    >
      {value === index && (
        <Typography>{children}</Typography>
      )}
    </Box>
  );
}


export default function RepositoryTabs() {
  const [tabsValue, setTabsValue] = useState(0);
  const [favoritesIds] = useLocalStorageState<Record<number, number>>('favoritesIds', {});
  const [favoritedRepositories, setFavoritedRepositories] = useState<RepositoryResponseProcessed | undefined>(undefined);

  const handleTabsChange = (_: React.SyntheticEvent, newTabsValue: number) => {
    setTabsValue(newTabsValue);
  };

  const { data: repositories, isLoading: isLoadingRepositories, isError: isErrorRepositories } = useQuery(['repositories'], () => fetchRepositories());
  
  useEffect(() => {
    const newFavoritedRepositories = getFavoritedRepositories(repositories ?? {} as RepositoryResponseProcessed, favoritesIds);
    setFavoritedRepositories(newFavoritedRepositories)
  }, [favoritesIds, repositories])

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabsValue} onChange={handleTabsChange} aria-label="basic tabs example" role='tablist'>
          <Tab label="Repositories" {...a11yProps(0)} role='tab' />
          <Tab label="Favorites" {...a11yProps(1)} role='tab' />
        </Tabs>
      </Box>
      <TabPanel value={tabsValue} index={0}>
        <RepositoryList items={repositories?.items ?? {}} languages={repositories?.items_ids_by_language} isEmptyMessage={"Ooops. We didn't find any repositories at the moment."} isLoading={isLoadingRepositories} isError={isErrorRepositories} />
      </TabPanel>
      <TabPanel value={tabsValue} index={1}>
        <RepositoryList items={favoritedRepositories?.items ?? {}} languages={favoritedRepositories?.items_ids_by_language} isEmptyMessage={"There are not favorited repositories yet."} />
      </TabPanel>
    </Box>
  );
}