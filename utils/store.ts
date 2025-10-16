import { configureStore } from '@reduxjs/toolkit';
import app from '@/slices/app.slice';
import config from '@/utils/config';
import logger from 'redux-logger';

const store = configureStore({
  reducer: {
    app,
  },
  middleware: getDefaultMiddleware =>
    config.env === 'development' ? getDefaultMiddleware().concat(logger) : getDefaultMiddleware(),
  devTools: config.env === 'development',
});

export type State = ReturnType<typeof store.getState>;
export type Dispatch = typeof store.dispatch;

export default store;
