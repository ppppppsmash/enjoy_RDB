<script setup lang="ts">
import { useConverter } from '~/composables/useConverter'

const { sqlToPrisma, prismaToSql } = useConverter()

const input = ref('')
const output = ref('')
const conversionType = ref('sqlToPrisma')
const selectedQuery = ref('')

async function convert() {
  try {
    if (conversionType.value === 'sqlToPrisma') {
      output.value = await sqlToPrisma(input.value)
    } else {
      output.value = await prismaToSql(input.value)
    }
  } catch (error) {
    console.error('変換エラー:', error)
    output.value = '変換中にエラーが発生しました。入力を確認してください。'
  }
}

function clearInput() {
  input.value = ''
  output.value = ''
}

function selectQuery() {
  if (selectedQuery.value) {
    input.value = selectedQuery.value
  }
}

const commonQueries = {
  sqlToPrisma: [
    { label: 'ユーザーテーブル', value: 'CREATE TABLE users (id INT PRIMARY KEY, name VARCHAR(255), email VARCHAR(255), created_at TIMESTAMP);' },
    { label: '商品テーブル', value: 'CREATE TABLE products (id INT PRIMARY KEY, name VARCHAR(255), price DECIMAL(10,2), stock INT, category VARCHAR(100));' },
    // 他のよく使われるSQLクエリを追加
  ],
  prismaToSql: [
    { label: 'ユーザーモデル', value: 'model User {\n  id    Int     @id @default(autoincrement())\n  name  String\n  email String  @unique\n  posts Post[]\n}' },
    { label: '商品モデル', value: 'model Product {\n  id       Int      @id @default(autoincrement())\n  name     String\n  price    Decimal\n  category String?\n}' },
    // 他のよく使われるPrismaモデルを追加
  ]
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
    <div class="mb-4">
      <select v-model="selectedQuery" @change="selectQuery" class="w-full p-2 border rounded">
        <option value="">カスタムクエリを入力</option>
        <option v-for="query in commonQueries[conversionType]" :key="query.label" :value="query.value">
          {{ query.label }}
        </option>
      </select>
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
        <textarea
          class="w-full h-64 p-2 border rounded"
          readonly
          :value="output"
          :placeholder="conversionType === 'sqlToPrisma' ? '変換されたPrismaスキーマ' : '変換されたSQL'"
        ></textarea>
      </div>
    </div>
    <div class="mt-4 flex justify-between">
      <button
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        @click="convert"
      >
        変換
      </button>
      <button
        class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        @click="clearInput"
      >
        クリア
      </button>
    </div>
  </div>
</template>