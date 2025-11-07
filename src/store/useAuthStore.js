// src/store/useAuthStore.js
import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  memberId: null,
  name: null,
  idNumber: null,
  departmentId: null,
  departmentName: null,
  accessToken: null,
  refreshToken: null,

  login: (data) =>
    set({
      memberId: data.memberId,
      name: data.name,
      idNumber: data.idNumber,
      departmentId: data.departmentId,
      departmentName: data.departmentName,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    }),

  logout: () =>
    set({
      memberId: null,
      name: null,
      idNumber: null,
      departmentId: null,
      departmentName: null,
      accessToken: null,
      refreshToken: null,
    }),
}));
