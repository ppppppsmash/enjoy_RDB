export function useConverter() {
  function sqlToPrisma(sql: string): string {
    console.log(sql)
    return 'Prismaスキーマに変換されました'
  }

  function prismaToSql(prisma: string): string {
    return 'SQLに変換されました'
  }

  return {
    sqlToPrisma,
    prismaToSql
  }
}