import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';

import userRoutes from './handlers/user';

const app: Application = express();

let port = 3000;

if (process.env.ENV === 'test') {
  port = 3001;
}

const address = `127.0.0.1:${port}`;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
userRoutes(app);

app.listen(port, () => {
  console.info(`Express is listening at http://${address}`);
});

export default app;
