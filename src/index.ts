import express from 'express';
import mongoose from 'mongoose';
import OrderSummaryRouter from './routes';
import path from 'path';
import fs from 'fs';

async function main() {
  if (!fs.existsSync(path.resolve('uploads/'))) {
    fs.mkdirSync(path.resolve('file/'), {
      recursive: true,
    });
  }

  await mongoose.connect('mongodb://localhost:27017', {
    dbName: 'order_summary_law',
    autoIndex: true,
    autoCreate: true,
  });

  const app = express();
  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: true,
    })
  );

  app.use(OrderSummaryRouter);

  app.listen(3040, () => {
    console.log('App start at port 3040');
  });
}

main();
