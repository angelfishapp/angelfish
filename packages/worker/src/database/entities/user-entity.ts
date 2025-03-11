import { IsBase64, IsDate, IsDefined, IsEmail, IsOptional, IsString } from 'class-validator'
import moment from 'moment'
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

import type { IUser, IUserUpdate } from '@angelfish/core'

/**
 * Main Entity for a User in a household.
 */
@Entity({ name: 'users' })
export class UserEntity implements IUser {
  @PrimaryGeneratedColumn()
  id!: number

  @CreateDateColumn()
  @IsOptional()
  @IsDate()
  created_on!: Date

  @UpdateDateColumn()
  @IsOptional()
  @IsDate()
  modified_on!: Date

  @Column({ type: 'text' })
  @IsDefined()
  @IsEmail()
  email!: string

  @Column({ type: 'text' })
  @IsDefined()
  @IsString()
  first_name!: string

  @Column({ type: 'text' })
  @IsDefined()
  @IsString()
  last_name!: string

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  cloud_id?: string

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsBase64()
  avatar?: string

  @Column({
    type: 'text',
    nullable: true,
    transformer: {
      to: (value: number): string => value?.toString(),
      from: (value: string): string => value?.toString(),
    },
  })
  @IsOptional()
  @IsString()
  phone?: string

  /**
   * Utility method to check if object is instance of this class
   * and if not will return the original object as an instance of the
   * class. If it is already an instance of the class, will just return
   * the original instance.
   *
   * This is needed to ensure validation is run whenever saving a model
   * as shallow copies & IPC requests will not be an instance of this class
   *
   * @param user  The user object to test and convert if needed
   * @returns     The object as a class instance
   */
  public static getClassInstance(user: IUser | IUserUpdate | UserEntity) {
    if (!(user instanceof UserEntity)) {
      const newUser: UserEntity = Object.assign(new UserEntity(), user)
      if (typeof newUser.created_on === 'string') {
        newUser.created_on = moment(newUser.created_on).toDate()
      }
      if (typeof newUser.modified_on === 'string') {
        newUser.modified_on = moment(newUser.modified_on).toDate()
      }
      return newUser
    }
    return user
  }
}
