<script setup lang="ts">
import { ref } from 'vue'
import { useConverter } from '~/composables/useConverter'

const { sqlToPrisma, prismaToSql } = useConverter()

const input = ref('')
const output = ref('')
const conversionType = ref('sqlToPrisma')

function convert() {
  if (conversionType.value === 'sqlToPrisma') {
    output.value = sqlToPrisma(input.value)
  } else {
    output.value = prismaToSql(input.value)
  }
}
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-4">SQL ⇔ Prisma 変換ツール</h1>
    <div class="mb-4">
      <label class="mr-4">
        <input type="radio" v-model="conversionType" value="sqlToPrisma"> SQL → Prisma
      </label>
      <label>
        <input type="radio" v-model="conversionType" value="prismaToSql"> Prisma → SQL
      </label>
    </div>
    <div class="grid grid-cols-2 gap-4">
      <div>
        <textarea
          class="w-full h-64 p-2 border rounded"
          :placeholder="conversionType === 'sqlToPrisma' ? 'SQLを入力' : 'Prismaスキーマを入力'"
          v-model="input"
        ></textarea>
      </div>
      <div>
        <textarea class="w-full h-64 p-2 border rounded" readonly :placeholder="conversionType === 'sqlToPrisma' ? '変換されたPrismaスキーマ' : '変換されたSQL'"></textarea>
      </div>
    </div>
    <button
      class="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      @click="convert"
    >
      変換
    </button>
  </div>
</template>