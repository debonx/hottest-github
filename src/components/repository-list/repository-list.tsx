import { useEffect, useState } from "react";
import { RepositoryItem } from "../repository-item/repository-item";
import { RepositoryProps } from "./repository-list.types";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

export function RepositoryList({ items, languages, isEmptyMessage, isLoading, isError }: RepositoryProps): JSX.Element {
    const [itemsArray, setItemsArray] = useState(Object.values(items));

    useEffect(() => {
        setItemsArray(Object.values(items));
    }, [items]);

    if (isLoading) {
        return <>Loading...</>
    }

    if (isError) {
        return <>Something went wrong... Please refresh this page.</>
    }

    if (itemsArray.length === 0) {
        return <>{isEmptyMessage}</>
    }

    const handleOnClickedLanguage = (language: string) => {
        if (!languages) {
            return;
        }
        const newItemsArray = languages[language].map((id: number) => items[id]).sort((a, b) => b.stargazers_count - a.stargazers_count);
        setItemsArray(newItemsArray);
    }

    return (
        <>
            <Box component={'span'} sx={{ marginBottom: '20px', display: 'flex', gap: '5px' }}>
                {languages && Object.keys(languages).map(language => {
                    return <Button variant={'outlined'} key={language} onClick={() => handleOnClickedLanguage(language)}role="button">{language}</Button>
                })}
                {languages && <Button variant={'outlined'} onClick={() => setItemsArray(Object.values(items))} role="button">All</Button>}
            </Box>
            <Box component={'span'} role="list">
                {itemsArray.map((item) => {
                    return <RepositoryItem key={item.id} {...item} />
                })}
            </Box>
        </>
    )
}