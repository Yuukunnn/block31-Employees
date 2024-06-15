// imports here for express and pg
import express from 'express';
import pg from 'pg';
import chalk from 'chalk';

const app = express();
app.use(express.json());

// static routes here (you only need these for deployment)

const db = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_hr_db');

// create your init function

const init = async () => {
  await db.connect();
  const SQL = `
  DROP TABLE IF EXISTS employees;
  CREATE TABLE employees(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    is_admin BOOLEAN DEFAULT FALSE
  );
  INSERT INTO employees(name, is_admin) VALUES('Lulu', true);
  INSERT INTO employees(name, is_admin) VALUES('Mumu', true);
  INSERT INTO employees(name, is_admin) VALUES('Momo', false);
  `;
  await db.query(SQL);
  console.log(chalk.green('table created & data seeded!!'));

  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(chalk.green(`successfully listening on port ${port}`)));
};

init();

// app routes here

app.get('/api/employees', (req, res) => {
  const SQL = `
    SELECT * FROM employees;
    `;
  db.query(SQL)
    .then((dbResponse) => {
      res.send(dbResponse.rows);
    })
    .catch((error) => console.log(chalk.pink(error)));
});
