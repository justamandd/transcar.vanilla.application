require('../../db.connection');

module.exports = {
    async list(table){
        try {
            const users = await runQuery(`SELECT * FROM ${table}`);

            return users;
        } catch (error) {
            return error;
        }
    },

    async search(table, name){
        try {
            const user = await runQuery(`SELECT * FROM ${table} WHERE name = '${name}'`);

            return user;
        } catch (error) {
            return error;
        }
    },

    async insert(table, { id, name }){
        try {
            await runQuery(`INSERT INTO ${table} (id, name) VALUES ('${id}', '${name}')`);

            return await runQuery(`SELECT * FROM ${table} WHERE id = '${id}'`);
        } catch (error) {
            return error;
        }
    },

    async update(table, { id, name }){
        try {
            await runQuery(`UPDATE ${table} set name = '${name}' where id = ${id}`);

            return await runQuery(`SELECT * FROM ${table} WHERE id = ${id}`);
        }catch (error) {
            return error;
        }
    },

    async delete(table, id){
        try {
            await runQuery(`DELETE FROM ${table} WHERE id = ${id}`);
        } catch (error) {
            return error;
        }
    }
}