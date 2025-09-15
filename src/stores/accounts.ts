import { defineStore } from 'pinia'
import type { Account } from '@/types'
import { nanoid } from './nanoid'
import { parseLabels } from '@/utils/labels'

export const useAccountsStore = defineStore('accounts', {
  state: () => ({
    items: [] as Account[],
  }),
  actions: {
    addEmpty() {
      const acc: Account = {
        id: nanoid(),
        labels: [],
        type: 'LDAP',
        login: '',
        password: null,
      }
      this.items.push(acc)
    },
    remove(id: string) {
      this.items = this.items.filter(a => a.id !== id)
    },

    upsert(partial: Partial<Account> & { id: string; labelsRaw?: string }) {
      const idx = this.items.findIndex(a => a.id === partial.id)
      const incoming: Partial<Account> = { ...partial }
      if (typeof partial.labelsRaw === 'string') {
        incoming.labels = parseLabels(partial.labelsRaw)
      }
      if (idx === -1) {
        this.items.push({
          id: partial.id,
          labels: incoming.labels ?? [],
          type: (incoming.type ?? 'LDAP') as Account['type'],
          login: incoming.login ?? '',
          password: incoming.password ?? null,
        })
      } else {
        this.items[idx] = { ...this.items[idx], ...incoming }
      }
    },
  },
  persist: true,
})
