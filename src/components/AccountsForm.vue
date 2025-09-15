<script setup lang="ts">
import { useAccountsStore } from '@/stores/accounts'
import AccountItem from './AccountItem.vue'

const store = useAccountsStore()
function add() {
  store.addEmpty()
}
</script>

<template>
  <div>
    <div class="row row--header">
      <h1 class="header-title">Учетные записи</h1>
      <button class="add-btn" @click="add" aria-label="add">+</button>
    </div>

    <div class="hint-line">
      <span class="hint-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.2">
          <circle cx="12" cy="12" r="9" />
          <path d="M9.75 9a2.25 2.25 0 1 1 3.9 1.5c-.6.6-1.65 1.05-1.65 2.25" stroke-linecap="round" stroke-linejoin="round" />
          <circle cx="12" cy="17" r="1" fill="currentColor" stroke="none" />
        </svg>
      </span>
      <span>
        Для указания нескольких меток для одной пары логин/пароль используйте разделитель <b>;</b>
      </span>
    </div>

    <div class="table table-head">
      <div>Метки</div>
      <div>Тип записи</div>
      <div>Логин</div>
      <div>Пароль</div>
      <div class="empty">.</div>
    </div>

    <div v-if="store.items.length === 0" class="empty-state">
      Нажмите «+», чтобы добавить запись
    </div>
    <div v-else class="list-grid">
      <AccountItem v-for="acc in store.items" :key="acc.id" :account="acc" />
    </div>
  </div>
</template>
