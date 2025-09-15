<script setup lang="ts">
import { NConfigProvider, type GlobalThemeOverrides } from 'naive-ui'
import AccountsForm from './components/AccountsForm.vue'

const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#2563eb',
    primaryColorHover: '#3b82f6',
    primaryColorPressed: '#1d4ed8'
  },
  Input: {
    borderHover: '1px solid #3b82f6',
    borderFocus: '1px solid #2563eb',
    boxShadowFocus: '0 0 0 2px rgba(37, 99, 235, 0.25)',
    caretColor: '#2563eb'
  },
  Select: {
    peers: {
      InternalSelection: {
        borderHover: '1px solid #3b82f6',
        borderActive: '1px solid #2563eb',
        boxShadowActive: '0 0 0 2px rgba(37, 99, 235, 0.25)'
      }
    }
  }
}
</script>

<template>
  <NConfigProvider :theme-overrides="themeOverrides">
    <div class="page">
      <main class="container">
        <div class="section section--spaced">
          <AccountsForm />
        </div>
      </main>
    </div>
  </NConfigProvider>
</template>
