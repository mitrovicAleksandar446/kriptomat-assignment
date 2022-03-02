import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Exclude } from 'class-transformer';
import { v4 } from 'uuid';
import { hash, compare } from 'bcrypt';
import BaseEntity from '../../../components/entities/base.entity';
import UserRepository from '../repositories/user.repository';

@Entity({ tableName: 'users', customRepository: () => UserRepository })
export class User extends BaseEntity {
  @PrimaryKey({ length: 64 })
  private readonly uuid: string;

  @Property()
  private name: string;

  @Property({ unique: true })
  private email: string;

  @Exclude()
  @Property({ hidden: true })
  private password: string;

  @Property({ nullable: true })
  private phone?: string = null;

  @Property({ nullable: true })
  private address?: string = null;

  private constructor(
    uuid: string | null,
    name: string,
    email: string,
    password: string | null,
    phone?: string,
    address?: string,
  ) {
    super();
    this.uuid = uuid;
    this.name = name;
    this.email = email;
    this.password = password;
    this.phone = phone;
    this.address = address;
  }

  public static async buildFrom(userInput: Record<string, any>): Promise<User> {
    const uuid = userInput.uuid || v4();
    const password = userInput.password ? await hash(userInput.password, 10) : null;

    return new User(
      uuid,
      userInput.name,
      userInput.email,
      password,
      userInput.phone,
      userInput.address,
    );
  }

  public async verifyPassword(rawPassword: string): Promise<boolean> {
    return await compare(rawPassword, this.password);
  }

  public getAddress(): string {
    return this.address;
  }

  public setAddress(value: string) {
    this.address = value;
  }

  public getPhone(): string {
    return this.phone;
  }

  public setPhone(value: string) {
    this.phone = value;
  }

  public getEmail(): string {
    return this.email;
  }

  public setEmail(value: string) {
    this.email = value;
  }

  public getName(): string {
    return this.name;
  }

  public setName(value: string) {
    this.name = value;
  }

  public getUuid(): string {
    return this.uuid;
  }

  public getPassword(): string {
    return this.password;
  }

  public async setPassword(value: string): Promise<void> {
    this.password = await hash(value, 10);
  }
}
