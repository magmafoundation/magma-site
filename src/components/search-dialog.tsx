"use client";

import { useDocsSearch } from "fumadocs-core/search/client";
import {
    SearchDialog,
    SearchDialogClose,
    SearchDialogContent,
    SearchDialogFooter,
    SearchDialogHeader,
    SearchDialogIcon,
    SearchDialogInput,
    SearchDialogList,
    SearchDialogOverlay,
    type SharedProps,
    TagsList,
    TagsListItem,
} from "fumadocs-ui/components/dialog/search";
import { useI18n } from "fumadocs-ui/contexts/i18n";
import { useState } from "react";

export default function CustomSearchDialog(props: SharedProps) {
    const { locale } = useI18n();
    const [tag, setTag] = useState<string | undefined>("docs");

    const { search, setSearch, query } = useDocsSearch({
        type: "fetch",
        locale,
        tag,
    });

    return (
        <SearchDialog
            search={search}
            onSearchChange={setSearch}
            isLoading={query.isLoading}
            {...props}
        >
            <SearchDialogOverlay />
            <SearchDialogContent>
                <SearchDialogHeader>
                    <SearchDialogIcon />
                    <SearchDialogInput />
                    <SearchDialogClose />
                </SearchDialogHeader>
                <SearchDialogList
                    items={query.data !== "empty" ? query.data : null}
                />
                <SearchDialogFooter>
                    <TagsList tag={tag} onTagChange={setTag}>
                        <TagsListItem value="docs">Docs</TagsListItem>
                        <TagsListItem value="site-api">API</TagsListItem>
                    </TagsList>
                </SearchDialogFooter>
            </SearchDialogContent>
        </SearchDialog>
    );
}
