import {
  IsBase64,
  IsBoolean,
  IsDate,
  IsDefined,
  IsHexColor,
  IsOptional,
  IsString,
} from 'class-validator'
import moment from 'moment'
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import type { IInstitution, IInstitutionUpdate } from '@angelfish/core'
import { AccountEntity } from '.'
import { IsCountry } from './validators'

/**
 * Main Entity for Institution.
 */
@Entity({ name: 'institutions' })
export class InstitutionEntity implements IInstitution {
  @PrimaryGeneratedColumn()
  id!: number

  @IsOptional()
  @IsDate()
  @CreateDateColumn()
  created_on!: Date

  @IsOptional()
  @IsDate()
  @UpdateDateColumn()
  modified_on!: Date

  /**
   * @default true
   */
  @Column({ default: true })
  @IsBoolean()
  is_open: boolean = true

  @Column({ type: 'text' })
  @IsDefined()
  @IsString()
  name!: string

  @Column({ type: 'text' })
  @IsDefined()
  @IsCountry()
  country!: string

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsBase64()
  logo?: string

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsHexColor()
  primary_color?: string

  @Column({ type: 'text', nullable: true })
  url?: string

  @OneToMany((_type) => AccountEntity, (account) => account.acc_institution_id)
  accounts!: AccountEntity[]

  /**
   * Utility method to check if object is instance of this class
   * and if not will return the original object as an instance of the
   * class. If it is already an instance of the class, will just return
   * the original instance.
   *
   * This is needed to ensure validation is run whenever saving a model
   * as shallow copies & IPC requests will not be an instance of this class
   *
   * @param institution   The institution object to test and convert if needed
   * @returns             The object as a class instance
   */
  public static getClassInstance(
    institution: InstitutionEntity | IInstitution | IInstitutionUpdate,
  ): InstitutionEntity {
    if (!(institution instanceof InstitutionEntity)) {
      const newInstitution: InstitutionEntity = Object.assign(new InstitutionEntity(), institution)
      if (typeof newInstitution.created_on === 'string') {
        newInstitution.created_on = moment(newInstitution.created_on).toDate()
      }
      if (typeof newInstitution.modified_on === 'string') {
        newInstitution.modified_on = moment(newInstitution.modified_on).toDate()
      }
      return newInstitution
    }
    return institution
  }
}
