import type { ICategoryGroup } from '@angelfish/core'

/**
 * Out of the box Category Groups
 */
export const categoryGroups: ICategoryGroup[] = [
  {
    id: 1,
    created_on: new Date('2021-07-04T18:23:49.000Z'),
    modified_on: new Date('2021-07-04T18:23:49.000Z'),
    name: 'Bank Charges',
    icon: 'bank',
    type: 'Expense',
    description: 'Any charges and fees from your Bank',
    color: undefined,
    total_categories: 2,
  },
  {
    id: 4,
    created_on: new Date('2021-07-04T18:23:49.000Z'),
    modified_on: new Date('2021-07-04T18:23:49.000Z'),
    name: 'Car',
    icon: 'car',
    type: 'Expense',
    description: 'All expenses required for owning and maintaing a car (or multiple)',
    color: undefined,
    total_categories: 9,
  },
  {
    id: 5,
    created_on: new Date('2021-07-04T18:23:49.000Z'),
    modified_on: new Date('2021-07-04T18:23:49.000Z'),
    name: 'Dependents',
    icon: 'child',
    type: 'Expense',
    description: 'Any expense related to raising your dependents',
    color: undefined,
    total_categories: 9,
  },
  {
    id: 6,
    created_on: new Date('2021-07-04T18:23:49.000Z'),
    modified_on: new Date('2021-07-04T18:23:49.000Z'),
    name: 'Food',
    icon: 'hamburger',
    type: 'Expense',
    description: 'Any food related expenses',
    color: undefined,
    total_categories: 3,
  },
  {
    id: 8,
    created_on: new Date('2021-07-04T18:23:49.000Z'),
    modified_on: new Date('2021-07-04T18:23:49.000Z'),
    name: 'Healthcare',
    icon: 'hospital',
    type: 'Expense',
    description: 'Any healthcare related expenses, including vision and dental',
    color: undefined,
    total_categories: 7,
  },
  {
    id: 2,
    created_on: new Date('2021-07-04T18:23:49.000Z'),
    modified_on: new Date('2021-07-04T18:23:49.000Z'),
    name: 'Home',
    icon: 'house',
    type: 'Expense',
    description: 'Any expenses related to living in your own home(s)',
    color: undefined,
    total_categories: 17,
  },
  {
    id: 3,
    created_on: new Date('2021-07-04T18:23:49.000Z'),
    modified_on: new Date('2021-07-04T18:23:49.000Z'),
    name: 'Insurance',
    icon: 'shield',
    type: 'Expense',
    description: 'Any insurance premiums for insurance not related to your home or healthcare',
    color: undefined,
    total_categories: 4,
  },
  {
    id: 15,
    created_on: new Date('2021-07-04T18:23:49.000Z'),
    modified_on: new Date('2021-07-04T18:23:49.000Z'),
    name: 'Investment Expenses',
    icon: 'receipt',
    type: 'Expense',
    description: 'Any expenses directly related to owning your investments',
    color: undefined,
    total_categories: 4,
  },
  {
    id: 19,
    created_on: new Date('2021-07-04T18:23:49.000Z'),
    modified_on: new Date('2021-07-04T18:23:49.000Z'),
    name: 'Investment Income',
    icon: 'moneybag',
    type: 'Income',
    description: 'Any income you earn from your investments',
    color: undefined,
    total_categories: 5,
  },
  {
    id: 12,
    created_on: new Date('2021-07-04T18:23:49.000Z'),
    modified_on: new Date('2021-07-04T18:23:49.000Z'),
    name: 'Job Expenses',
    icon: 'briefcase',
    type: 'Expense',
    description: 'Any expenses related to your job',
    color: undefined,
    total_categories: 2,
  },
  {
    id: 7,
    created_on: new Date('2021-07-04T18:23:49.000Z'),
    modified_on: new Date('2021-07-04T18:23:49.000Z'),
    name: 'Leisure & Entertainment',
    icon: 'speedboat',
    type: 'Expense',
    description: 'All expenses related to taking time off and relaxing',
    color: undefined,
    total_categories: 13,
  },
  {
    id: 18,
    created_on: new Date('2021-07-04T18:23:49.000Z'),
    modified_on: new Date('2021-07-04T18:23:49.000Z'),
    name: 'Other Expenses',
    icon: 'question',
    type: 'Expense',
    description:
      "A catchall expense group for any expenses that don't necessarily fit into other areas of your life",
    color: undefined,
    total_categories: 4,
  },
  {
    id: 20,
    created_on: new Date('2021-07-04T18:23:49.000Z'),
    modified_on: new Date('2021-07-04T18:23:49.000Z'),
    name: 'Other Income',
    icon: 'dollar',
    type: 'Income',
    description: 'Any other income that you may receive outside investments and earned income',
    color: undefined,
    total_categories: 7,
  },
  {
    id: 17,
    created_on: new Date('2021-07-04T18:23:49.000Z'),
    modified_on: new Date('2021-07-04T18:23:49.000Z'),
    name: 'Personal Care',
    icon: 'person_with_blond_hair',
    type: 'Expense',
    description: 'Any personal expenses related to taking care of your appearance and fashion',
    color: undefined,
    total_categories: 4,
  },
  {
    id: 13,
    created_on: new Date('2021-07-04T18:23:49.000Z'),
    modified_on: new Date('2021-07-04T18:23:49.000Z'),
    name: 'Personal Development',
    icon: 'raising_hand',
    type: 'Expense',
    description:
      'Any expenses related to your own personal development and education (not dependents)',
    color: undefined,
    total_categories: 3,
  },
  {
    id: 11,
    created_on: new Date('2021-07-04T18:23:49.000Z'),
    modified_on: new Date('2021-07-04T18:23:49.000Z'),
    name: 'Relocation',
    icon: 'truck',
    type: 'Expense',
    description: 'Any expenses related to moving home and relocating to a new area',
    color: undefined,
    total_categories: 3,
  },
  {
    id: 16,
    created_on: new Date('2021-07-04T18:23:49.000Z'),
    modified_on: new Date('2021-07-04T18:23:49.000Z'),
    name: 'Taxes',
    icon: 'classical_building',
    type: 'Expense',
    description: 'Any taxes you have to pay from your income or tax returns',
    color: undefined,
    total_categories: 3,
  },
  {
    id: 10,
    created_on: new Date('2021-07-04T18:23:49.000Z'),
    modified_on: new Date('2021-07-04T18:23:49.000Z'),
    name: 'Transportation',
    icon: 'car',
    type: 'Expense',
    description: 'Any day to day transportation expenses not related to travelling on vactation',
    color: undefined,
    total_categories: 6,
  },
  {
    id: 9,
    created_on: new Date('2021-07-04T18:23:49.000Z'),
    modified_on: new Date('2021-07-04T18:23:49.000Z'),
    name: 'Vacation',
    icon: 'beach_with_umbrella',
    type: 'Expense',
    description: 'Any expenses related to taking a vacation',
    color: undefined,
    total_categories: 5,
  },
  {
    id: 21,
    created_on: new Date('2021-07-04T18:23:49.000Z'),
    modified_on: new Date('2021-07-04T18:23:49.000Z'),
    name: 'Wages & Salary',
    icon: 'briefcase',
    type: 'Income',
    description:
      'Any earned income you get from your job or self-employment, where you are trading your time for money',
    color: undefined,
    total_categories: 5,
  },
  {
    id: 14,
    created_on: new Date('2021-07-04T18:23:49.000Z'),
    modified_on: new Date('2021-07-04T18:23:49.000Z'),
    name: 'Wellbeing',
    icon: 'person_in_lotus_position',
    type: 'Expense',
    description: 'Any expenses you have to stay healthy and well',
    color: undefined,
    total_categories: 6,
  },
]
