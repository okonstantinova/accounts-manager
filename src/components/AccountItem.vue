<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { Account, AccountType } from '@/types'
import { useAccountsStore } from '@/stores/accounts'
import { formatLabels } from '@/utils/labels'
import { NInput, NSelect, NButton, NIcon } from 'naive-ui'
import { EyeOutline, EyeOffOutline, TrashOutline } from '@vicons/ionicons5'

const props = defineProps<{ account: Account }>()
const store = useAccountsStore()

type Errors = { labels?: string; type?: string; login?: string; password?: string }
type Touched = { labels: boolean; login: boolean; password: boolean; type: boolean }

const local = reactive({
  id: props.account.id,
  labelsRaw: formatLabels(props.account.labels),
  type: props.account.type as AccountType,
  login: props.account.login,
  password: props.account.password as string | null,
  errors: {} as Errors,
  touched: { labels: false, login: false, password: false, type: false } as Touched
})

const showPassword = ref(false)

function splitLabels(raw: string): string[] {
  return raw
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0)
}

function validate(opts: { onlyTouched: boolean } = { onlyTouched: true }): boolean {
  const e: Errors = {}

  if (local.labelsRaw) {
    const parts = splitLabels(local.labelsRaw)
    if (parts.some(p => p.length > 50)) {
      e.labels = 'Каждая метка максимум 50 символов'
    }
  }

  if (!local.login) e.login = 'Обязательное поле'
  else if (local.login.length > 100) e.login = 'Максимум 100 символов'

  if (local.type === 'Локальная') {
    if (!local.password) e.password = 'Обязательное поле'
    else if ((local.password as string).length > 100) e.password = 'Максимум 100 символов'
  }

  const allValid = Object.values(e).every(v => v === undefined)

  local.errors = opts.onlyTouched
    ? {
        labels: local.touched.labels ? e.labels : undefined,
        login: local.touched.login ? e.login : undefined,
        password: local.touched.password ? e.password : undefined
      }
    : e

  return allValid
}

function commitIfValid() {
  if (validate({ onlyTouched: false })) {
    store.upsert({
      id: local.id,
      type: local.type,
      login: local.login,
      password: local.type === 'LDAP' ? null : (local.password ?? ''),
      labelsRaw: local.labelsRaw
    })
  } else {
    validate({ onlyTouched: true })
  }
}

function onTypeChange() {
  local.touched.type = true
  if (local.type === 'LDAP') {
    local.password = null
  }
  validate({ onlyTouched: true })
  commitIfValid()
}

function onBlur(field: keyof Touched) {
  local.touched[field] = true
  commitIfValid()
}

function remove() {
  store.remove(local.id)
}
</script>

<template>
  <div class="table">
    <div class="cell">
      <NInput
        v-model:value="local.labelsRaw"
        placeholder="например: XXX; YYYYY"
        :status="local.errors.labels ? 'error' : undefined"
        size="large"
        @blur="onBlur('labels')"
        maxlength="50"
      />
    </div>

    <div class="cell">
      <NSelect
        v-model:value="local.type"
        :options="[
          { label: 'LDAP', value: 'LDAP' },
          { label: 'Локальная', value: 'Локальная' }
        ]"
        size="large"
        @update:value="onTypeChange"
      />
    </div>

    <div class="cell" :style="local.type === 'LDAP' ? 'grid-column: span 2;' : ''">
      <NInput
        v-model:value="local.login"
        placeholder="Значение"
        :status="local.errors.login ? 'error' : undefined"
        size="large"
        @blur="onBlur('login')"
        maxlength="100"
      />
    </div>

    <div class="cell" v-if="local.type === 'Локальная'">
      <NInput
        v-model:value="(local.password as any)"
        :type="showPassword ? 'text' : 'password'"
        placeholder="Значение"
        :status="local.errors.password ? 'error' : undefined"
        size="large"
        @blur="onBlur('password')"
        maxlength="100"
      >
        <template #suffix>
          <NButton text @click="showPassword = !showPassword" aria-label="toggle password">
            <NIcon>
              <component :is="showPassword ? EyeOffOutline : EyeOutline" />
            </NIcon>
          </NButton>
        </template>
      </NInput>
    </div>

    <div class="cell delete">
      <button class="delete-btn" @click="remove" aria-label="delete">
        <NIcon><TrashOutline /></NIcon>
      </button>
    </div>
  </div>
</template>
