import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
config();

@Injectable()
export class DatabaseService implements OnModuleInit {
  async onModuleInit() {
  }

  async executeQuery(sql: string) {
    const dataSource = new DataSource({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'test',
    });

    await dataSource.initialize();
    try {
      await dataSource.query(sql);
    } catch (error) {
      Logger.error(error.sqlMessage);
    }
    await dataSource.destroy();
  }

  async createDatabase() {
    const logger = new Logger("Database");
    logger.log("Initial Database...")
    const dataSource = new DataSource({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
    });

    await dataSource.initialize();
    const databaseName = process.env.DB_DATABASE || 'test';
    await dataSource.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\`;`);
    await dataSource.destroy();
    logger.log("Initial Database Success!!")
  }
}
