import { NotFoundError, errorHandler } from '@sjoedwards/common';
import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { userRouter } from './routes/users';
import { racesRouter } from './routes/races';

const app = express();
// Telling the app that even though traffic is coming from the nginx proxy, to trust it as secure
app.set('trust proxy', true);

// Create the session
app.use(cookieSession({ signed: false, secure: false }));

// Parse the body
app.use(json());

app.use(userRouter);
app.use(racesRouter);

// Only works because we've got express-async-errors imported, otherwise would need to pass
// NotFoundError() to next()
app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
