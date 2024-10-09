// GET

import { authAxiosInstance } from '@/app/api/auth/axiosInstance';
import { IGroup } from '@/types/Group';

// /{teamId}/groups/{groupId}/task-lists/{id}
export const getTaskList = async (id: string) => {
  const response = await authAxiosInstance.get<IGroup>(
    `/groups/4/task-lists/${id}`,
  );
  return response.data;
};

// PATCH
// /{teamId}/groups/{groupId}/task-lists/{id}
export const updateTaskList = async (id: string, data: { name: string }) => {
  const response = await authAxiosInstance.patch(
    `/groups/{groupId}/task-lists/${id}`,
    data,
  );
  return response.data;
};

// DELETE
// /{teamId}/groups/{groupId}/task-lists/{id}

// POST
// /{teamId}/groups/{groupId}/task-lists
export const createTaskList = async (data: { name: string }) => {
  const response = await authAxiosInstance.post(
    `/groups/{groupId}/task-lists`,
    data,
  );
  return response.data;
};

// PATCH
// /{teamId}/groups/{groupId}/task-lists/{id}/order