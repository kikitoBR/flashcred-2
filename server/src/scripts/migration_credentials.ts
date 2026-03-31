import { pool } from '../database';

const runMigration = async () => {
    console.log('[Migration] Iniciando migração de credenciais...');
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Criar a nova tabela global para status dos bancos
        console.log('[Migration] Criando tabela tenant_banks_status...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS tenant_banks_status (
                id VARCHAR(36) PRIMARY KEY,
                tenant_id VARCHAR(36) NOT NULL,
                bank_id VARCHAR(50) NOT NULL,
                status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
                UNIQUE KEY unique_tenant_bank_status (tenant_id, bank_id)
            );
        `);

        // 2. Limpar a tabela bank_credentials pois não possuíam user_id. 
        // Como o sistema está em adaptação, os vendedores precisarão preencher suas senhas de novo.
        console.log('[Migration] Limpando tabela bank_credentials antiga...');
        await connection.query(`TRUNCATE TABLE bank_credentials;`);

        // 3. Modificar a tabela bank_credentials
        console.log('[Migration] Adicionando user_id em bank_credentials...');
        
        // Verifica se a coluna user_id já existe. Se não existir, adiciona
        const [columns]: any = await connection.query(`SHOW COLUMNS FROM bank_credentials LIKE 'user_id'`);
        if (columns.length === 0) {
            await connection.query(`
                ALTER TABLE bank_credentials 
                ADD COLUMN user_id VARCHAR(36) NOT NULL AFTER tenant_id,
                ADD FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
            `);
            
            // Re-criar a UNIQUE KEY
            // Primeiro, descobrir o nome das foreign/unique keys existentes sobre tenant_id/bank_id
            await connection.query(`ALTER TABLE bank_credentials DROP INDEX unique_bank_tenant;`);
            await connection.query(`ALTER TABLE bank_credentials ADD UNIQUE KEY unique_user_bank_tenant (tenant_id, user_id, bank_id);`);
        }

        await connection.commit();
        console.log('[Migration] ✅ Migração concluída com sucesso!');
    } catch (error) {
        await connection.rollback();
        console.error('[Migration] ❌ Erro durante a migração:', error);
    } finally {
        connection.release();
        process.exit(0);
    }
};

runMigration();
