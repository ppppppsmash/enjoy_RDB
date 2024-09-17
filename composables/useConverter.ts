export function useConverter() {
  function sqlToPrisma(sql: string): string {
    const tableMatch = sql.match(/CREATE TABLE (\w+) \(([\s\S]+?)\);/);
    if (!tableMatch) return 'Invalid SQL';

    const tableName = tableMatch[1];
    const columns = tableMatch[2].split(',').map(col => col.trim());

    let prismaSchema = `model ${tableName} {\n`;
    columns.forEach(column => {
      const [name, ...typeParts] = column.split(' ');
      const sqlType = typeParts.join(' ').toUpperCase();
      let prismaType = 'String';
      let attributes = '';

      if (sqlType.includes('INT')) prismaType = 'Int';
      else if (sqlType.includes('DECIMAL') || sqlType.includes('NUMERIC')) prismaType = 'Decimal';
      else if (sqlType.includes('BOOLEAN')) prismaType = 'Boolean';
      else if (sqlType.includes('TIMESTAMP') || sqlType.includes('DATETIME')) prismaType = 'DateTime';
      else if (sqlType.includes('TEXT')) prismaType = 'String';

      if (sqlType.includes('PRIMARY KEY')) attributes += ' @id';
      if (sqlType.includes('AUTO_INCREMENT')) attributes += ' @default(autoincrement())';

      prismaSchema += `  ${name} ${prismaType}${attributes}\n`;
    });
    prismaSchema += '}';

    return prismaSchema;
  }

  function prismaToSql(prisma: string): string {
    const modelMatch = prisma.match(/model (\w+) \{([\s\S]+?)\}/);
    if (!modelMatch) return 'Invalid Prisma schema';

    const tableName = modelMatch[1];
    const fields = modelMatch[2].split('\n').map(field => field.trim()).filter(field => field);

    let sql = `CREATE TABLE ${tableName} (\n`;
    fields.forEach((field, index) => {
      const [name, type, ...attributes] = field.split(' ');
      let sqlType = 'VARCHAR(255)';
      let sqlAttributes = '';

      if (type === 'Int') sqlType = 'INTEGER';
      else if (type === 'Decimal') sqlType = 'DECIMAL(10,2)';
      else if (type === 'Boolean') sqlType = 'BOOLEAN';
      else if (type === 'DateTime') sqlType = 'TIMESTAMP';

      if (attributes.includes('@id')) sqlAttributes += ' PRIMARY KEY';
      if (attributes.includes('@default(autoincrement())')) sqlAttributes += ' AUTO_INCREMENT';

      sql += `  ${name} ${sqlType}${sqlAttributes}`;
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