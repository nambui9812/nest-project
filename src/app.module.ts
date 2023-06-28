import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import entities from './configs/db';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';
import { RoomModule } from './rooms/room.module';
import { ChannelModule } from './channels/channel.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres',
      port: 5432,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [...entities],
      synchronize: true
    }),
    AuthModule,
    UserModule,
    RoomModule,
    ChannelModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
