import { Permissions, useUserPermission } from '@/stores/permissionStore'

export default function useIsPermitted() {
  const usePermission = useUserPermission()

  const isPermitted = (permission?: Permissions[] | Permissions) => {
    if (!permission) return true
    return usePermission.permitted(permission)
  }

  return { isPermitted, isLoaded: usePermission.loading }
}
