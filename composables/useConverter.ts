export function useConverter() {
  function sqlToPrisma(sql: string): string {

    const tableMatch = sql.match(/CREATE TABLE (\w+) \(([\s\S]+?)\);/);
    if (!tableMatch) return 'Invalid SQL';

    const tableName = tableMatch[1];
    const columns = tableMatch[2].split(',').map(col => col.trim());

    // Prisma model
    let prismaSchema = `model ${tableName} {\n`;
    columns.forEach(column => {
      const [name, type] = column.split(' ');
      let prismaType = 'String';
      if (type.includes('INT')) prismaType = 'Int';
      if (type.includes('BOOLEAN')) prismaType = 'Boolean';
      if (type.includes('TIMESTAMP')) prismaType = 'DateTime';
      prismaSchema += `  ${name} ${prismaType}\n`;
    });
    prismaSchema += '}';

    return prismaSchema;
  }

  function prismaToSql(prisma: string): string {
    // Prismaモデルを解析
    const modelMatch = prisma.match(/model (\w+) \{([\s\S]+?)\}/);
    if (!modelMatch) return 'Invalid Prisma schema';

    const tableName = modelMatch[1];
    const fields = modelMatch[2].split('\n').map(field => field.trim()).filter(field => field);

    // SQL CREATE TABLE
    let sql = `CREATE TABLE ${tableName} (\n`;
    fields.forEach((field, index) => {
      const [name, type] = field.split(' ');
      let sqlType = 'VARCHAR(255)';
      if (type === 'Int') sqlType = 'INTEGER';
      if (type === 'Boolean') sqlType = 'BOOLEAN';
      if (type === 'DateTime') sqlType = 'TIMESTAMP';
      sql += `  ${name} ${sqlType}`;
      if (index < fields.length - 1) sql += ',';
      sql += '\n';
    });
    sql += ');';

    return sql;
  }

  return {
    sqlToPrisma,
    prismaToSql
  }
}