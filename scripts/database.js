// Run this ONCE to create the tables
const createTables = async () => {
    // Consumers Table
    const consumerTableExists = await knex.schema.hasTable('consumers');
    if (!consumerTableExists) {
        await knex.schema.createTable('consumers', (table) => {
            table.increments('consumer_id').primary();
            table.string('firstname').notNullable();
            table.string('lastname').notNullable();
            table.string('email').notNullable().unique();
            table.string('password').notNullable();
            table.string('parish').notNullable();
            table.string('address').notNullable();
        });
        console.log("Created table: consumers");
    }

    // Manufacturers Table
    const manufacturerTableExists = await knex.schema.hasTable('manufacturers');
    if (!manufacturerTableExists) {
        await knex.schema.createTable('manufacturers', (table) => {
            table.increments('manufacturer_id').primary();
            table.string('company_name').notNullable();
            table.string('email').notNullable().unique();
            table.string('password').notNullable();
            table.string('address').notNullable();
            table.string('contact_number');
        });
        console.log("Created table: manufacturers");
    }

    // Discounts Table
    const discountsTableExists = await knex.schema.hasTable('discounts');
    if (!discountsTableExists) {
        await knex.schema.createTable('discounts', (table) => {
            table.increments('discount_id').primary();
            table.string('parish').notNullable();
            table.string('title').notNullable();
            table.string('reason').notNullable();
            table.date('valid_until').notNullable();
        });
        console.log("Created table: discounts");
    }
};

// Call the function ONCE when starting the app
createTables()
  .then(() => console.log("All tables are set ✅"))
  .catch(err => console.error(err));
