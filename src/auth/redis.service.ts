import { Injectable } from '@nestjs/common';
import * as redis from 'redis';

@Injectable()
export class RedisService {
  private client: redis.RedisClientType;

  constructor() {
    this.client = redis.createClient();

    this.client.on('connect', () => {
      console.log('Redis client connected');
    });

    this.client.on('error', (err) => {
      console.error('Redis client error', err);
    });

    this.client.connect();
  }

  // Add JWT to blacklist with an expiry time
  async blacklistToken(token: string, expiresIn: number): Promise<void> {
    console.log('Blacklisting token:', token, expiresIn);
    await this.client.set(token, 'blacklisted', {
      EX: expiresIn, // expire after the JWT expires
    });
  }

  // Check if a token is blacklisted
  async isBlacklisted(token: string): Promise<boolean> {
    const result = await this.client.get(token);
    console.log('Checking blacklist for token:', token, result);
    return result === 'blacklisted';
  }
}
