import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { TaskStatus } from 'src/tasks/task-status.entity';
import { statuses } from './data/tasks-statuses';
// import { init_services } from 'src/txn-services/entities/txn-serv-seed-data';
// import { TxnService } from 'src/txn-services/entities/txn-service.entity';
import { EntityManager } from 'typeorm';
import { Seeding } from './seeding.entity';

@Injectable()
export class SeedingMiddleware implements NestMiddleware {
  // to avoid roundtrips to db we store the info about whether
  // the seeding has been completed as boolean flag in the middleware
  // we use a promise to avoid concurrency cases. Concurrency cases may
  // occur if other requests also trigger a seeding while it has already
  // been started by the first request. The promise can be used by other
  // requests to wait for the seeding to finish.
  private isSeedingComplete: Promise<boolean>;

  constructor(private readonly entityManager: EntityManager) {}

  async use(req: Request, res: Response, next: any) {
    if (await this.isSeedingComplete) {
      // seeding has already taken place,
      // we can short-circuit to the next middleware
      return next();
    }

    this.isSeedingComplete = (async () => {
      // MODIFIED

      if (
        !(await this.entityManager.findOne(Seeding, {
          id: 'init-txn-statuses',
        }))
      ) {
        await this.entityManager.transaction(
          async (transactionalEntityManager) => {
            console.log(statuses);
            for (let i = 0; i < statuses.length; i++) {
              await transactionalEntityManager.save(TaskStatus, statuses[i]);
            }
            await transactionalEntityManager.save(
              new Seeding('init-txn-statuses'),
            );
          },
        );
      }
      //   // MODIFIED
      //   if (
      //     !(await this.entityManager.findOne(Seeding, {
      //       id: 'init-txn-serv',
      //     }))
      //   ) {
      //     await this.entityManager.transaction(
      //       async (transactionalEntityManager) => {
      //         for (let i = 0; i < init_services.length; i++) {
      //           await transactionalEntityManager.save(
      //             TxnService,
      //             init_services[i],
      //           );
      //         }
      //         await transactionalEntityManager.save(new Seeding('init-txn-serv'));
      //       },
      //     );
      //   }

      return true;
    })();

    await this.isSeedingComplete;
    next();
  }
}
