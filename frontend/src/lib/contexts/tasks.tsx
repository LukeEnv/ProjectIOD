"use client";

import React, { createContext, useContext } from "react";
import useSWR from "swr";
import { Task } from "@/types/task";
import { toast } from "sonner";
import { useAuthAxios } from "@/lib/axios";
import { useTokenContext } from "@/lib/contexts/token";

interface TasksContextType {
  tasks: Task[] | undefined;
  isLoading: boolean;
  isError: boolean;
  refetchTasks: () => void;
  createTask: (task: Partial<Task>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  addTaskComment: (taskId: string, comment: string) => Promise<void>; // <-- add to context
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const TasksProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const authAxios = useAuthAxios();
  const { initialized, accessToken } = useTokenContext();

  // SWR fetcher using authenticated axios
  const fetcher = async (url: string) => {
    const res = await authAxios.get(url);
    return res.data;
  };

  // Only fetch when initialized and accessToken are ready
  const shouldFetch = initialized && !!accessToken;
  const { data, error, isLoading, mutate } = useSWR<Task[]>(
    shouldFetch ? "/tasks" : null,
    shouldFetch ? fetcher : null
  );

  const refetchTasks = () => mutate();

  const createTask = async (task: Partial<Task>) => {
    try {
      await authAxios.post("/tasks", task);
      mutate();
      toast.success("Task created");
    } catch {
      toast.error("Failed to create task");
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      await authAxios.put(`/tasks/${id}`, updates);
      mutate();
      toast.success("Task updated");
    } catch {
      toast.error("Failed to update task");
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await authAxios.delete(`/tasks/${id}`);
      mutate();
      toast.success("Task deleted");
    } catch {
      toast.error("Failed to delete task");
    }
  };

  const addTaskComment = async (taskId: string, comment: string) => {
    try {
      await authAxios.post(`/tasks/${taskId}/comments`, { comment });
      mutate(); // Refetch tasks to update comments
      toast.success("Comment added");
    } catch {
      toast.error("Failed to add comment");
    }
  };

  return (
    <TasksContext.Provider
      value={{
        tasks: data,
        isLoading,
        isError: !!error,
        refetchTasks,
        createTask,
        updateTask,
        deleteTask,
        addTaskComment, // <-- add to context
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};

export const useTasksContext = () => {
  const context = useContext(TasksContext);
  if (!context)
    throw new Error("useTasksContext must be used within a TasksProvider");
  return context;
};
