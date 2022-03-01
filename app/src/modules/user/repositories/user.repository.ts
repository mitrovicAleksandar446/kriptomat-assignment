import { EntityRepository } from '@mikro-orm/postgresql';
import { User } from '../entities/user.entity';

export default class UserRepository extends EntityRepository<User> {}
