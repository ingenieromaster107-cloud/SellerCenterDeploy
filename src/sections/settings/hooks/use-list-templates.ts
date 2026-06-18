import { useGetTemplates } from "src/actions/chat-templates/use-get-templates";

export function useListTemplates() {
    const { data, isLoading, isError, error } = useGetTemplates();

    return {
        data,
    }
}