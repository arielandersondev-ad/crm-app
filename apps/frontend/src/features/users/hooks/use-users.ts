import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "../services/user.service";

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => userService.getUsers(),
  });
}
export function useGetSucursales() {
  return useQuery({
    queryKey: ["sucursales"],
    queryFn: () => userService.getSucursales(),
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userService.createUser,
    mutationKey: ["createUser"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userService.updateRoleSucursal,
    mutationKey: ["updateUserRole"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useRemoveUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userService.removeUser,
    mutationKey: ["removeUser"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
export function useActivateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userService.activate,
    mutationKey: ["activeUser"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
export function useDeactivateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userService.deactivate,
    mutationKey: ["deactivateUser"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: userService.changePassword,
    mutationKey: ["changePassword"],
  });
}
