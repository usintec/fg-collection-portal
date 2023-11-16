<script setup lang="ts">
import dateFormat from 'dateformat'
import { usePageNameStore } from '@/stores/pageName'
import MaterialIcon from '../icon/MaterialIcon.vue'
import { onMounted, ref } from 'vue'
import UpdateToken from '@/services/UpdateToken'
import AuthService from '@/services/AuthService'
import type { IOrganization, IUserInfo } from '@/services/types'
import { useUserStore } from '@/stores/userStore'
import { useOrganizationStore } from '@/stores/organizationStore'
import BreadcrumbVue from '../breadcrumb/BreadcrumbVue.vue'
import NotificationIcon from '../notification/NotificationIcon.vue'
import SelectInput from '../inputs/select/SelectInput.vue'
import OrganizationService from '@/services/OrganizationService'

const pageName = usePageNameStore()
const user = ref<IUserInfo>()
const lastLogin = ref<Date>()
const userStore = useUserStore()
const orgStore = useOrganizationStore()
const subOrganization = ref<IOrganization[]>([])

const PageForBreadCrumb = [
  'Dashboard',
  'Organization',
  'Sub Organizations',
  'Details',
  'Admins',
  'Settings'
]
onMounted(async () => {
  lastLogin.value = UpdateToken.getLastLogin()
  user.value = userStore.user ?? (await AuthService.userInfo())
  orgStore.setActiveOrganization({
    ...user.value,
    id: user.value.organizationId,
    parentOrganization: {
      ...user.value,
      id: user.value.parentOrganizationId
    }
  })
  orgStore.addToOrganizationStack(orgStore?.activeOrganization)
  if (!userStore.user) userStore.setUser(user.value)
  orgStore.setFgId(user.value.organizationId)
  if (userStore.user?.organizationId)
    subOrganization.value = await OrganizationService.getAllSubOrganizations(
      userStore.user?.organizationId
    )
})

const selectSubOrganization = (orgId: string) => {
  orgStore.updateOrganizationStack(orgId)
}
</script>
<template>
  <div>
    <div class="relative">
      <div class="h-[68px] bg-white flex items-center px-8 justify-between">
        <div class="flex gap-6 font-satoshi">
          <div
            v-if="pageName.subMenu"
            @click="pageName.goBack()"
            class="w-7 h-7 rounded-full bg-custom_mint flex items-center justify-center cursor-pointer"
          >
            <MaterialIcon icon="chevron_left" class="text-dark_green text-xl" />
          </div>
          <span class="text-[rgb(26,56,72)] text-base font-bold">{{ pageName.pageName }}</span>
          <span class="text-[#8492B6] font-thin text-sm mt-0.5"
            >Signed in as <span class="font-bold">{{ user?.name ?? '' }}</span> | Last Login:
            {{ dateFormat(lastLogin, 'd mmmm, yyyy hh:mmTT') }}
          </span>
        </div>
        <div class="flex gap-10 justify-center items-center">
          <SelectInput
            v-if="!!subOrganization.length"
            label=""
            :placeholder="orgStore.activeOrganization?.organizationName"
            :onChange="
              (v) => {
                if (orgStore.organizationStack) {
                  const org = subOrganization.find((c) => c.organizationId == v)
                  orgStore.organizationStack.splice(1)
                  orgStore.addToOrganizationStack(org)
                  orgStore.setActiveOrganization(org)
                }
              }
            "
            value="organizationId"
            :name="['organizationName']"
            :items="subOrganization"
            bg="bg-[#F4F7FF]"
            class="w-72 text-[#636E8C]"
          />
          <NotificationIcon />
          <div
            @click="console.log"
            class="bg-custom_mint flex justify-center items-center aspect-square w-[46px] rounded-sm"
          >
            <MaterialIcon outline icon="person" class="text-dark_green text-3xl" />
          </div>
        </div>
      </div>
    </div>
    <div class="px-8" v-if="PageForBreadCrumb.includes(pageName.pageName)">
      <BreadcrumbVue
        :onClick="(v: string) => selectSubOrganization(v)"
        :organizations="orgStore.organizationStack ?? []"
      ></BreadcrumbVue>
    </div>
  </div>
</template>
