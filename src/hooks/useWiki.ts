import { useState, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  WikiData,
  WikiHistoryData,
  WikiSearchParams,
  WikiFormData,
} from "../types/wiki";
import { apiGetWithToken, apiWithToken } from "../utils/Api";

export const useWiki = (title?: string) => {
  const [searchParams, setSearchParams] = useState<WikiSearchParams>({
    keyword: "",
    page: 1,
    pageSize: 10,
  });
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    data: wikiData,
    isLoading: loading,
    error: wikiError,
  } = useQuery<WikiData>({
    queryKey: ["wiki", title],
    queryFn: async () => {
      if (!title) return null;
      const response = await axios.get(`/api/wiki/${title}`);
      return response.data;
    },
    enabled: !!title,
  });

  const {
    data: historyData,
    isLoading: historyLoading,
    error: historyError,
  } = useQuery<WikiHistoryData[]>({
    queryKey: ["wiki-history", title],
    queryFn: async () => {
      if (!title) return [];
      const response = await apiGetWithToken(`/api/v1/wikis/${title}/history`);
      return response.data.data;
    },
    enabled: !!title,
  });

  const createWiki = useMutation({
    mutationFn: async (data: WikiFormData) => {
      const response = await axios.post("/api/wiki", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wiki"] });
    },
  });

  const updateWiki = useMutation({
    mutationFn: async ({
      title,
      data,
    }: {
      title: string;
      data: WikiFormData;
    }) => {
      const response = await axios.put(`/api/wiki/${title}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wiki"] });
    },
  });

  const deleteWiki = useMutation({
    mutationFn: async (title: string) => {
      await axios.delete(`/api/wiki/${title}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wiki"] });
      navigate("/wiki");
    },
  });

  const restoreHistory = useMutation({
    mutationFn: async (history: WikiHistoryData) => {
      const response = await axios.post(`/api/wiki/${history.title}/restore`, {
        version: history.version,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wiki"] });
    },
  });

  const handleSearch = useCallback(
    async (keyword: string) => {
      setSearchParams((prev) => ({ ...prev, keyword, page: 1 }));
      const response = await axios.get("/api/wiki/search", {
        params: { keyword, page: 1, pageSize: searchParams.pageSize },
      });
      return response.data;
    },
    [searchParams.pageSize]
  );

  const handlePageChange = useCallback(
    async (page: number) => {
      setSearchParams((prev) => ({ ...prev, page }));
      const response = await axios.get("/api/wiki/search", {
        params: { ...searchParams, page },
      });
      return response.data;
    },
    [searchParams]
  );

  const handleCreate = useCallback(
    (data: WikiFormData) => {
      createWiki.mutate(data);
    },
    [createWiki]
  );

  const handleUpdate = useCallback(
    (data: WikiFormData) => {
      if (!title) return;
      updateWiki.mutate({ title, data });
    },
    [updateWiki, title]
  );

  const handleDelete = useCallback(() => {
    if (!title) return;
    deleteWiki.mutate(title);
  }, [deleteWiki, title]);

  const handleRestore = useCallback(
    (history: WikiHistoryData) => {
      restoreHistory.mutate(history);
    },
    [restoreHistory]
  );

  return {
    wikiData,
    historyData,
    loading,
    historyLoading,
    error: wikiError || historyError,
    searchParams,
    handleSearch,
    handlePageChange,
    createWiki: handleCreate,
    updateWiki: handleUpdate,
    deleteWiki: handleDelete,
    restoreHistory: handleRestore,
    isCreating: createWiki.isPending,
    isUpdating: updateWiki.isPending,
    isDeleting: deleteWiki.isPending,
    isRestoring: restoreHistory.isPending,
  };
};
