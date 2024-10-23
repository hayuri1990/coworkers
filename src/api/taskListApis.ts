// GET

import { authAxiosInstance } from '@/app/api/auth/axiosInstance';
import { IGroup, Task } from '@/types/Group';

// /{teamId}/groups/{groupId}/task-lists/{id}
export const getTaskList = async (groupId: string, id: string) => {
  const response = await authAxiosInstance.get<IGroup>(
    `/groups/${groupId}/task-lists/${id}`,
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
export const createTaskList = async (
  groupId: string | string[],
  data: { name: string },
) => {
  const response = await authAxiosInstance.post(
    `/groups/${groupId}/task-lists`,
    data,
  );
  return response.data;
};

// PATCH
// /{teamId}/groups/{groupId}/task-lists/{id}/
export const updateTask = async (
  groupId: string | string[],
  taskListId: string | string[],
  taskId: string,
  updatedData: { task: Task },
) => {
  const response = await authAxiosInstance.patch(
    `/groups/${groupId}/task-lists/${taskListId}/tasks/${taskId}`,
    updatedData,
  );
  return response.data;
};
