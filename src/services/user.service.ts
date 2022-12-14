import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { User, Prisma } from '@prisma/client';
import { CompressionTypes, Kafka, logLevel } from 'kafkajs';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    const kafka = new Kafka({
      logLevel: logLevel.INFO,
      // logCreator: PrettyConsoleLogger,
      // brokers: [`${host}:9094`, `${host}:9097`, `${host}:9100`],
      brokers: [`localhost:9092`],
      clientId: 'user-producer',
      // ssl: {
      //   servername: 'localhost',
      //   rejectUnauthorized: false,
      //   ca: [fs.readFileSync('./testHelpers/certs/cert-signed', 'utf-8')],
      // },
      // sasl: {
      //   mechanism: 'plain',
      //   username: 'test',
      //   password: 'testtest',
      // },
    })
    const topic = 'quickstart-events'
    const producer = kafka.producer()

    await producer.connect()

    console.log('pr')

    producer.send({
      topic,
      compression: CompressionTypes.GZIP,
      messages: [{
        key: '1',
        value: 'teste lalala'
      }],
    })
    .then(response => {
      kafka.logger().info(`Messages sent #1`, { response })
    })
    .catch(e => kafka.logger().error(`[example/producer] ${e.message}`, { stack: e.stack }))

    return this.prisma.user.create({
      data,
    });
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }
}
