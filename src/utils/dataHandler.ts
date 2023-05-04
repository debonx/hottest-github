import { Repository, RepositoryKeys } from '@/components/repository-list/repository-list.types';
import axios from 'axios';
import { useLocalStorageState } from 'react-localstorage-hooks';

export interface RepositoriesById {
    [key: number]: Repository;
}

export interface RepositoryResponse {
    total_count: number;
    incomplete_results: boolean;
    items: Repository[];
    items_ids_by_language?: Record<string, number[]>;
}

export interface RepositoryResponseProcessed extends Omit<RepositoryResponse, 'items'> {
    items: RepositoriesById;
}

export enum QueryOrder {
    Asc = 'asc',
    Desc = 'desc'
}

export enum QueryOperator {
    LessThan = '<',
    LessThanOrEqual = '<=',
    Equal = '=',
    GreaterThanOrEqual = '>=',
    GreaterThan = '>'
}

export enum QuerySort {
    Stars = 'stars',
    Forks = 'forks',
    HelpWantedIssues = 'help-wanted-issues',
    Updated = 'updated'
}

export interface QueryParams {
    [key: string]: string | number | boolean;
}

export const getFormatteDateForParams = (date: Date) => {
    const formattedDate = date.toISOString().split('T')[0];
    return formattedDate;
};

export const getDefaultParams = (): QueryParams => {
    const today = new Date();
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const defaultDate = getFormatteDateForParams(sevenDaysAgo);
    const params = {
        q: `created:${QueryOperator.GreaterThanOrEqual}${defaultDate}`,
        sort: QuerySort.Stars,
        order: QueryOrder.Desc
    }

    return params;
}

export const getParamsFromObjectToUrl = (params: QueryParams) => {
    const paramsArray = Object.entries(params);
    const paramsString = paramsArray.map(([key, value]) => `${key}=${value}`).join('&');
    return paramsString;
};

export const getRepositoriesObjectById = (items: Repository[]): RepositoriesById => {
    const repositoriesObjectById = items.reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
    }, {} as RepositoriesById);

    return repositoriesObjectById;
}

export const getItemsIdsByLanguage = (items: Repository[]) => {
    const itemsIdsByLanguage = items.reduce((acc, item) => {
        if (item.language) {
            if (acc[item.language]) {
                acc[item.language].push(item.id);
            } else {
                acc[item.language] = [item.id];
            }
        }
        return acc;
    }, {} as { [key: string]: number[] });

    return itemsIdsByLanguage;
}

export const fetchRepositories = async (): Promise<RepositoryResponseProcessed> => {
    const defaulParams = getDefaultParams();
    const params = getParamsFromObjectToUrl(defaulParams);
    const res = await axios.get<RepositoryResponse>(
        `https://api.github.com/search/repositories?${params}`
    );

    const processedItems = getItemsWithOnlyRequiredFields(res.data.items);

    return {
        items: getRepositoriesObjectById(processedItems),
        items_ids_by_language: getItemsIdsByLanguage(res.data.items),
        total_count: res.data.total_count,
        incomplete_results: res.data.incomplete_results,
    };
};

export const getItemsWithOnlyRequiredFields = (items: Repository[]): Repository[] => {
    const requiredFields = ['id', 'full_name', 'description', 'language', 'stargazers_count', 'forks_count', 'html_url', 'owner'];

    const processedItems = items.map((item) => {
        const processedItem = requiredFields.reduce((acc: any, field) => {
            acc[field] = item[field as RepositoryKeys];
            return acc;
        }, {} as Repository);

        return processedItem;
    });
    
    return processedItems;
};



export const getFavoritedRepositories = (repositories: RepositoryResponseProcessed, favoritesIds: Record<number, number>): RepositoryResponseProcessed => {
    const favorites = Object.keys(favoritesIds).reduce((acc, id) => {
        acc[Number(id)] = repositories.items[Number(id)];
        return acc;
    }, {} as RepositoriesById);

    return {
        ...repositories,
        items: favorites,
        items_ids_by_language: getItemsIdsByLanguage(Object.values(favorites) as Repository[]),
    };
}