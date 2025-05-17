/** **********************************************************************************
 * Angelfish Default Categories
 *
 * This file is loaded whenever a user signs up and creates a new household (account)
 * to provide a set of default categories they can use to categorize their transactions.
 * Note that users will be free to rename, edit, delete and merge categories over time
 * to organize their transactions the way they need on their reports.
 *
 * Categories are organized into Groups - a user cannot select a group, but one of the
 * categories in a group to categorize a transaction. The category will be named with
 * the group:category in the table such as "Bank Charges:Interest Paid"
 *
 * Categories can have a type field that enables users to classify the type of expense
 * or income the category is, providing another way to filter or group by on reports.
 * The following types are supported:
 *
 * * Expenses:Critical - Expenses you cannot get rid of and are critical to supporting your family such as housing, tax & debt repayments (interest)
 * * Expenses:Important - Expenses that are important to you to maintain your most basic lifestyle such as private education for your children
 * * Expenses:Optional - Nice to have, optional expenses you could cut in an emergency such as vacations, dining out, entertainment, etc.
 * * Expenses:Investment - Any productive expenses that enable your investments to run and generate cashflow
 * * Income:Earned - Income you earn through working a job or consulting, where you trade your time for money
 * * Income:Passive - Income you receive from investments, which require minimal time to manage and will continue paying even if you stop working like dividends, rental properties, etc.
 * * Income:Other - Any other income received such as loan principal, credit card rewards, gifts, and inheritance
 *
 * Icons are based on emoji short names. These are listed at:
 * https://unicodey.com/emoji-data/table.htm
 *
 ************************************************************************************/

import type { CategoryGroupType, CategoryType } from '@angelfish/core'

// Define the structure of a single category
interface Category {
  description: string
  type: CategoryType
  icon: string
}

// Define the structure of a category group
interface CategoryGroup {
  icon: string
  description: string
  type: CategoryGroupType
  color: string
  categories: Record<string, Category>
}

// Main object storing all categories
export const DefaultCategories: Record<string, CategoryGroup> = {
  /** ***************************************************************************
   * EXPENSES
   ****************************************************************************/
  'Bank Charges': {
    icon: 'bank',
    description: 'Any charges and fees from your Bank',
    type: 'Expense',
    color: '#8b572a',
    categories: {
      Interest: {
        description: 'Any interest due or paid on overdrawn accounts, credit cards, or loans',
        type: 'Critical',
        icon: 'bank',
      },
      'Service Charge': {
        description: 'Any service charges and fees from your bank',
        type: 'Critical',
        icon: 'bank',
      },
    },
  },
  Home: {
    icon: 'house',
    description: 'Any expenses related to living in your own home(s)',
    type: 'Expense',
    color: '#f5a623',
    categories: {
      'Broadband/Cable/Telephone': {
        description: 'Broadband internet, cable or landline utility bills',
        type: 'Critical',
        icon: 'phone',
      },
      Electricity: {
        description: 'Electric utility bills',
        type: 'Critical',
        icon: 'zap',
      },
      Cleaning: {
        description:
          'Any expenses related to hiring professional cleaners or tools to keep your household clean and tidy',
        type: 'Optional',
        icon: 'broom',
      },
      Gas: {
        description: 'Gas utility bills for heating/cooking',
        type: 'Critical',
        icon: 'fire',
      },
      Furnishing: {
        description: 'Purchase of any furniture, furnishings, plants, or ornaments for the home',
        type: 'Optional',
        icon: 'bed',
      },
      'HOA Fees': {
        description: 'Homeowners association fees for your home',
        type: 'Critical',
        icon: 'house_with_garden',
      },
      Landscaping: {
        description:
          'Purchasing of materials, plants, or professional landscapers for your home garden',
        type: 'Optional',
        icon: 'house_with_garden',
      },
      Improvements: {
        description: 'Home improvements such as decorating, refurbishing, or extending your home',
        type: 'Optional',
        icon: 'lower_left_paintbrush',
      },
      Insurance: {
        description: 'Housing or rental insurance required for your home',
        type: 'Critical',
        icon: 'shield',
      },
      Rent: {
        description: 'Rent for your home if you rent',
        type: 'Critical',
        icon: 'house',
      },
      'Mobile/Cell': {
        description: 'Mobile/cell phone plan charges for you and your family',
        type: 'Critical',
        icon: 'iphone',
      },
      'Mortgage Principal': {
        description: 'Payment towards the principal of your mortgage loan',
        type: 'Critical',
        icon: 'house',
      },
      'Mortgage Interest': {
        description: 'Payment towards the interest of your mortgage loan',
        type: 'Critical',
        icon: 'house',
      },
      'Property/Council Tax': {
        description: 'Property or local council taxes required for your home',
        type: 'Critical',
        icon: 'classical_building',
      },
      'Maintenance & Repairs': {
        description:
          'Critical maintenance and repairs required to keep your home habitable including pest control',
        type: 'Critical',
        icon: 'hammer',
      },
      Security: {
        description: 'Any security systems or services you use to protect your home',
        type: 'Optional',
        icon: 'lock',
      },
      'TV License': {
        description: 'TV license fees for countries that require it like the UK',
        type: 'Critical',
        icon: 'tv',
      },
      Water: {
        description: 'Water utility bills',
        type: 'Critical',
        icon: 'droplet',
      },
      'Waste Management': {
        description:
          'Any waste management bills to remove waste and other materials from your home',
        type: 'Critical',
        icon: 'recycle',
      },
    },
  },
  Insurance: {
    icon: 'shield',
    description: 'Any insurance premiums for insurance not related to your home or healthcare',
    type: 'Expense',
    color: '#bd10e0',
    categories: {
      Life: {
        description:
          'Term or Whole Life insurance premiums to protect your family in the event of your death',
        type: 'Important',
        icon: 'shield',
      },
      Travel: {
        description:
          'Travel insurance premiums for protecting you and your family while traveling abroad',
        type: 'Optional',
        icon: 'shield',
      },
      'Mobile Devices': {
        description:
          'Mobile device insurance premiums for protecting your laptops, cell phones, and any other mobile devices',
        type: 'Optional',
        icon: 'shield',
      },
      Umbrella: {
        description:
          'Umbrella personal liability insurance premiums that cover claims in excess of your other insurance coverage',
        type: 'Optional',
        icon: 'shield',
      },
    },
  },
  Car: {
    icon: 'car',
    description: 'All expenses required for owning and maintaing a car (or multiple)',
    type: 'Expense',
    color: '#f5a623',
    categories: {
      Accessories: {
        description: 'Any accessories or improvements you buy for your car(s)',
        type: 'Optional',
        icon: 'car',
      },
      'Gas/Petrol': {
        description: 'Gas/petrol to run your car(s)',
        type: 'Important',
        icon: 'car',
      },
      'Servicing/Maintenance': {
        description: 'Any regular servicing, maintenance, or repairs required for your car(s)',
        type: 'Important',
        icon: 'car',
      },
      Insurance: {
        description: 'Required drivers insurance for your car(s)',
        type: 'Critical',
        icon: 'car',
      },
      Lease: {
        description: 'Lease payments for your car(s) if you purchased it on lease',
        type: 'Critical',
        icon: 'car',
      },
      Loan: {
        description: 'Loan financing payments for your car(s) if you purchased it with a loan',
        type: 'Critical',
        icon: 'car',
      },
      Purchase: {
        description: 'Cash deposit or payment to purchase a new car',
        type: 'Optional',
        icon: 'car',
      },
      'Registration Fees': {
        description: 'Annual registration fees or taxes required to run your car(s)',
        type: 'Critical',
        icon: 'car',
      },
      'Registration Fines': {
        description: 'Any registration fines such as late filing fees you receive for your car(s)',
        type: 'Critical',
        icon: 'car',
      },
      'Wash/Cleaning': {
        description: 'Taking your car(s) to a car wash to get cleaned',
        type: 'Optional',
        icon: 'car',
      },
    },
  },
  Dependents: {
    icon: 'child',
    description: 'Any expense related to raising your dependents',
    type: 'Expense',
    color: '#f5a623',
    categories: {
      'Nursery/Pre-Schools': {
        description: 'Fees for any nursery/day-care or pre-schools for your dependents',
        type: 'Important',
        icon: 'baby_symbol',
      },
      'Private Schools': {
        description: 'Any private school tuition fees for your dependents',
        type: 'Important',
        icon: 'school',
      },
      'College/University': {
        description: 'Any college/university tuition fees for your dependents',
        type: 'Important',
        icon: 'mortar_board',
      },
      Parties: {
        description: 'Any birthday celebrations or other parties for your dependents',
        type: 'Optional',
        icon: 'tada',
      },
      'Toys & Games': {
        description: 'Any toys, games, or presents for your dependents',
        type: 'Optional',
        icon: 'teddy_bear',
      },
      Clothing: {
        description: 'Any clothing and shoes for your dependents',
        type: 'Important',
        icon: 'shirt',
      },
      'Childcare/Nannies': {
        description: 'Any costs for providing childcare or nannies for your dependents',
        type: 'Important',
        icon: 'female-teacher',
      },
      'Clubs & Activities': {
        description: 'Fees for any clubs or afterschool activities for your dependents',
        type: 'Optional',
        icon: 'soccer',
      },
      Allowance: {
        description: 'Any allowance, support, or pocket money payments you make to your dependents',
        type: 'Optional',
        icon: 'money_with_wings',
      },
      'Other Expenses': {
        description: 'Any other miscellaneous expense for your dependents',
        type: 'Optional',
        icon: 'child',
      },
    },
  },
  Food: {
    icon: 'hamburger',
    description: 'Any food related expenses',
    type: 'Expense',
    color: '#f8e71c',
    categories: {
      Groceries: {
        description: 'Food & general household items from your supermarket',
        type: 'Critical',
        icon: 'shopping_trolley',
      },
      'Take-out': {
        description: 'Ordering take out food delivery to eat at home',
        type: 'Optional',
        icon: 'takeout_box',
      },
      'Dining out': {
        description: 'Any food and drink from restaurants, coffee shops, or food stands',
        type: 'Optional',
        icon: 'spaghetti',
      },
    },
  },
  'Leisure & Entertainment': {
    icon: 'speedboat',
    description: 'All expenses related to taking time off and relaxing',
    type: 'Expense',
    color: '#7ed321',
    categories: {
      'Books & Magazines': {
        description: 'Any books or magazine purchases or subscriptions',
        type: 'Optional',
        icon: 'books',
      },
      'Club Memberships': {
        description: 'Any club membership or other fees you or your spouse belong to',
        type: 'Optional',
        icon: '8ball',
      },
      'Cultural Events': {
        description:
          'Tickets for the theatre, concerts, festivals, ballet, opera, or other cultural events',
        type: 'Optional',
        icon: 'performing_arts',
      },
      'Night Out': {
        description:
          'Going out on the town for drinks, bars, karaoke, or other fun activities with your friends and spouse',
        type: 'Optional',
        icon: 'clinking_glasses',
      },
      Cinema: {
        description: 'Tickets to watch movies in the cinema',
        type: 'Optional',
        icon: 'movie_camera',
      },
      'Movie Rentals': {
        description: 'Any rental purchases for movies to watch at home',
        type: 'Optional',
        icon: 'vhs',
      },
      'Streaming Services': {
        description:
          'Any subscriptions to TV and music streaming services such as Netflix and Spotify',
        type: 'Optional',
        icon: 'tv',
      },
      'Sporting Events': {
        description: 'Any cost related to attending sporting events such as Football tickets',
        type: 'Optional',
        icon: 'stadium',
      },
      Museums: {
        description: 'Any entrance fees or memberships to museums',
        type: 'Optional',
        icon: 'funeral_urn',
      },
      'Toys & Games': {
        description:
          'Any games or toys you purchase for yourselves such as board games, game consoles, or VR headsets',
        type: 'Optional',
        icon: 'chess_pawn',
      },
      'Computer Games': {
        description: 'Any computer or console games you buy to play',
        type: 'Optional',
        icon: 'video_game',
      },
      'News Subscriptions': {
        description: 'Any newspaper or online news content you subscribe to',
        type: 'Optional',
        icon: 'newspaper',
      },
      'Sporting Equipment': {
        description:
          'Any sporting equipment you purchase such as bikes, golf clubs, kayaks, or surfboards',
        type: 'Optional',
        icon: 'ski',
      },
      'Entertaining & Hosting': {
        description:
          'Hosting guests and entertaining them at your home such as dinners, BBQs and other entertainment',
        type: 'Optional',
        icon: 'house_with_garden',
      },
    },
  },
  Healthcare: {
    icon: 'hospital',
    description: 'Any healthcare related expenses, including vision and dental',
    type: 'Expense',
    color: '#bd10e0',
    categories: {
      Pharmacy: {
        description: 'Any prescription medication or other pharmacy items',
        type: 'Critical',
        icon: 'pill',
      },
      'Medical Insurance': {
        description: 'Any insurance premium contributions for private medical insurance',
        type: 'Critical',
        icon: 'hospital',
      },
      'Medical Copays': {
        description: 'Any copayments required for medical visits, tests, or other treatment',
        type: 'Critical',
        icon: 'hospital',
      },
      'Dental Insurance': {
        description: 'Any insurance premium contributions for private dental insurance',
        type: 'Critical',
        icon: 'tooth',
      },
      'Dental Copays': {
        description: 'Any copayments required for dental visits, tests, or other treatment',
        type: 'Critical',
        icon: 'tooth',
      },
      'Vision Insurance': {
        description: 'Any insurance premium contributions for private vision insurance',
        type: 'Critical',
        icon: 'eyeglasses',
      },
      'Vision Copays': {
        description: 'Any copayments required for optician visits, tests, or other treatment',
        type: 'Critical',
        icon: 'eyeglasses',
      },
      Tests: {
        description: 'Any medical tests you have to take such as blood tests or scans',
        type: 'Important',
        icon: 'test_tube',
      },
    },
  },
  Vacation: {
    icon: 'beach_with_umbrella',
    description: 'Any expenses related to taking a vacation/holiday and travelling',
    type: 'Expense',
    color: '#7ed321',
    categories: {
      Accommodation: {
        description:
          'Any costs related to booking accommodation such as hotels, motels, Airbnbs for your Vacation/Holiday',
        type: 'Optional',
        icon: 'beach_with_umbrella',
      },
      'Dining Out': {
        description:
          'Dining out while on your vacation/holiday at restaurants, coffee shops, and food stands',
        type: 'Optional',
        icon: 'beach_with_umbrella',
      },
      'Activities & Entertainment': {
        description:
          'Any activities, excursions, tours, shows, or other entertainment you book during your vacation/holiday',
        type: 'Optional',
        icon: 'beach_with_umbrella',
      },
      Spending: {
        description: 'Any general spending or cash withdrawals during your vacation/holiday',
        type: 'Optional',
        icon: 'beach_with_umbrella',
      },
      Transportation: {
        description:
          'Any flights, trains, boats, taxis, ridesharing, car rental, or public transport you use during your vacation/holiday',
        type: 'Optional',
        icon: 'airplane',
      },
    },
  },
  Transportation: {
    icon: 'car',
    description: 'Any day to day transportation expenses not related to travelling on vactation',
    type: 'Expense',
    color: '#0000ff',
    categories: {
      'Car Rental': {
        description: 'Any local car rental or Zipcar you use for day to day transportation',
        type: 'Optional',
        icon: 'car',
      },
      Fines: {
        description: 'Any fines you receive from driving, parking, or public transport',
        type: 'Critical',
        icon: 'cop',
      },
      Parking: {
        description: 'Any parking fees to park your car at your destination',
        type: 'Optional',
        icon: 'parking',
      },
      'Public Transport': {
        description:
          'Any expense for using public trains, subways, buses, or other public transport to get around',
        type: 'Optional',
        icon: 'train2',
      },
      'Taxi/Ride-sharing': {
        description: 'Any expense from using taxis, or ride-sharing apps like Uber or Lyft',
        type: 'Optional',
        icon: 'taxi',
      },
      Tolls: {
        description: 'Any road, bridge, or tunnel tolls you have to pay while driving',
        type: 'Optional',
        icon: 'no_entry',
      },
    },
  },
  Relocation: {
    icon: 'truck',
    description: 'Any expenses related to moving home and relocating to a new area',
    type: 'Expense',
    color: '#0000ff',
    categories: {
      Fees: {
        description:
          'Any fees or taxes related to buying or selling a home or rental applications to secure a new home',
        type: 'Important',
        icon: 'truck',
      },
      'Moving Costs': {
        description:
          'Any costs related to moving homes such as movers, U-Haul truck rental, or cleaners for a new place',
        type: 'Important',
        icon: 'truck',
      },
      Deposit: {
        description:
          'Any upfront deposit you must provide to secure a rental property but will be returned at the end of your lease',
        type: 'Important',
        icon: 'truck',
      },
    },
  },
  'Job Expenses': {
    icon: 'briefcase',
    description: 'Any expenses related to your job',
    type: 'Expense',
    color: '#8b572a',
    categories: {
      Reimbursed: {
        description:
          'Any expenses you pay for out of pocket that will be reimbursed by your company',
        type: 'Optional',
        icon: 'briefcase',
      },
      'Non-Reimbursed': {
        description:
          'Any expenses you pay for out of pocket related to your work or career but will not be reimbursed such as professional memberships or software',
        type: 'Important',
        icon: 'briefcase',
      },
    },
  },
  'Personal Development': {
    icon: 'raising_hand',
    description:
      'Any expenses related to your own personal development and education (not dependents)',
    type: 'Expense',
    color: '#f5a623',
    categories: {
      'Books & Materials': {
        description:
          'Any textbooks or other materials required for your personal educational development',
        type: 'Optional',
        icon: 'books',
      },
      Courses: {
        description:
          'Any online or in-person courses and training/boot camp you purchase for your personal educational development',
        type: 'Optional',
        icon: 'male-teacher',
      },
      Networking: {
        description:
          'Any networking events, conferences, coffees/dinners or meetups you attend for professional development',
        type: 'Optional',
        icon: 'speaking_head_in_silhouette',
      },
      Tuition: {
        description:
          'Any tuition you pay to a college/university to pursue further education such as Masters, MBA, or PhD',
        type: 'Optional',
        icon: 'mortar_board',
      },
    },
  },
  Wellbeing: {
    icon: 'person_in_lotus_position',
    description: 'Any expenses you have to stay healthy and well',
    type: 'Expense',
    color: '#7ed321',
    categories: {
      'Gym/Health Club': {
        description: 'Any expenses related to joining and being a member of a Gym or Health Club',
        type: 'Important',
        icon: 'weight_lifter',
      },
      'Group Classes': {
        description:
          'Any expenses related to attending fitness classes such as Zumba, Yoga, Meditation or a Classpass subscription',
        type: 'Optional',
        icon: 'person_in_lotus_position',
      },
      'Personal Trainer': {
        description:
          'Any expenses related to hiring a personal trainer or wellbeing coach such as a nutritionist or spiritual guide',
        type: 'Optional',
        icon: 'trophy',
      },
      'Spa & Massages': {
        description: 'Going to a Spa or getting a relaxing massage',
        type: 'Optional',
        icon: 'massage',
      },
      'Therapist/Counsellor': {
        description: 'Any expenses related to hiring a therapist or counselor',
        type: 'Optional',
        icon: 'thinking_face',
      },
      Subscriptions: {
        description:
          'Any subscriptions for wellbeing apps like Calm or Headspace, fitness/nutrition apps or online content and courses',
        type: 'Optional',
        icon: 'globe_with_meridians',
      },
      'Health Supplements': {
        description: 'Any vitamins, supplements, or other health products you purchase',
        type: 'Optional',
        icon: 'pill',
      },
    },
  },
  'Investment Expenses': {
    icon: 'receipt',
    description: 'Any expenses directly related to owning your investments',
    type: 'Expense',
    color: '#417505',
    categories: {
      'Rental Property Mortgage Principal': {
        description: 'Repayment of mortgage loan principal on any rental property you own',
        type: 'Investment',
        icon: 'receipt',
      },
      'Rental Property Mortgage Interest': {
        description: 'Repayment of mortgage loan interest on any rental property you own',
        type: 'Investment',
        icon: 'receipt',
      },
      'Rental Property Expenses': {
        description:
          'Any other expenses you pay on rental properties you own such as management fees, furnishings, utilities, and maintenance that are not reimbursed by your tenants',
        type: 'Investment',
        icon: 'receipt',
      },
      Legal: {
        description:
          'Any legal expenses you pay for estate/tax planning to protect your investments or disputes and lawsuits related to them',
        type: 'Investment',
        icon: 'receipt',
      },
    },
  },
  Taxes: {
    icon: 'classical_building',
    description: 'Any taxes you have to pay from your income or tax returns',
    type: 'Expense',
    color: '#d0021b',
    categories: {
      'Income Tax': {
        description:
          'Income tax for the current, previous, and next (estimated) tax years, both Federal and State',
        type: 'Taxes',
        icon: 'classical_building',
      },
      'Social Security': {
        description:
          'Social Security/National Insurance payments for the current, previous, and next (estimated) tax years, both Federal and State',
        type: 'Taxes',
        icon: 'classical_building',
      },
      Penalties: {
        description: 'Any penalties and fines you receive for late or incorrect tax payments',
        type: 'Taxes',
        icon: 'classical_building',
      },
    },
  },
  'Personal Care': {
    icon: 'person_with_blond_hair',
    description: 'Any personal expenses related to taking care of your appearance and fashion',
    type: 'Expense',
    color: '#7ed321',
    categories: {
      'Clothing & Fashion': {
        description: 'Any clothing, shoes, or fashion accessories you purchase to look good!',
        type: 'Optional',
        icon: 'dress',
      },
      'Dry Cleaning': {
        description: 'Taking clothes to the dry cleaners for cleaning and repairs',
        type: 'Optional',
        icon: 'basket',
      },
      'Hairdressers/Salon': {
        description: 'Getting your hair cut or styled',
        type: 'Optional',
        icon: 'haircut',
      },
      Cosmetics: {
        description: 'Any cosmetics or beauty products you purchase to look good!',
        type: 'Optional',
        icon: 'lipstick',
      },
      Beautician: {
        description: 'Visit a beautician for a manicure, pedicure, and other beauty treatments',
        type: 'Optional',
        icon: 'nail_care',
      },
    },
  },
  'Other Expenses': {
    icon: 'question',
    description:
      "A catchall expense group for any expenses that don't necessarily fit into other areas of your life",
    type: 'Expense',
    color: '#f8e71c',
    categories: {
      'Cash Withdrawl': {
        description: 'Taking out cash for general spending',
        type: 'Optional',
        icon: 'atm',
      },
      Gifts: {
        description: 'Buying gifts for friends, colleagues, and family',
        type: 'Optional',
        icon: 'gift',
      },
      'Charitable Donations': {
        description: 'Making a charitable donation to a registered charity or trust',
        type: 'Optional',
        icon: 'reminder_ribbon',
      },
      'Online Subscriptions': {
        description:
          'Any app/online subscriptions you use for personal use such as Dropbox, Angelfish, or Amazon Prime',
        type: 'Optional',
        icon: 'globe_with_meridians',
      },
    },
  },

  /** ***************************************************************************
   * INCOME
   ****************************************************************************/

  'Investment Income': {
    icon: 'moneybag',
    description: 'Any income you earn from your investments',
    type: 'Income',
    color: '#417505',
    categories: {
      'Capital Gains': {
        description:
          'Any gain or loss from selling an investment asset such as stocks, real estate, equities, options, and crypto assets',
        type: 'Passive',
        icon: 'moneybag',
      },
      Dividends: {
        description:
          'Any dividend income generated by owning a business or public stock in a company',
        type: 'Passive',
        icon: 'moneybag',
      },
      Interest: {
        description:
          'Any interest income generated by bonds, savings accounts, or loaning money to someone',
        type: 'Passive',
        icon: 'moneybag',
      },
      Rent: {
        description: 'Any rental income generated by owning rental properties',
        type: 'Passive',
        icon: 'moneybag',
      },
      Pension: {
        description: 'Any retirement income received from a pension plan once it matures',
        type: 'Passive',
        icon: 'moneybag',
      },
    },
  },
  'Other Income': {
    icon: 'dollar',
    description: 'Any other income that you may receive outside investments and earned income',
    type: 'Income',
    color: '#f5a623',
    categories: {
      'Credit Card Rewards': {
        description: 'Any cashback rewards from your credit cards',
        type: 'Other',
        icon: 'credit_card',
      },
      'Gifts Received': {
        description:
          'Any cash gifts received from friends and family such as Birthday or Wedding gifts',
        type: 'Other',
        icon: 'red_envelope',
      },
      'Inheritance Received': {
        description: 'Any inheritance you receive from your relatives when they pass away',
        type: 'Other',
        icon: 'older_adult',
      },
      'Insurance Payout Received': {
        description: 'Any insurance payout you receive due to an insurance claim',
        type: 'Other',
        icon: 'shield',
      },
      'Loan Principal Received': {
        description:
          'Any loan principal received when taking out a Student, Home, or Personal Loan the will need to be paid back with interest',
        type: 'Other',
        icon: 'bank',
      },
      'Gambling/Lottery Winnings': {
        description: 'Any winnings or losses you receive from gambling or playing the lottery',
        type: 'Other',
        icon: 'slot_machine',
      },
      'Social Security': {
        description:
          'Any social security you receive while out of work such as unemployment or disability benefit',
        type: 'Other',
        icon: 'classical_building',
      },
    },
  },
  'Wages & Salary': {
    icon: 'briefcase',
    description:
      'Any earned income you get from your job or self-employment, where you are trading your time for money',
    type: 'Income',
    color: '#d0021b',
    categories: {
      Bonus: {
        description: 'Any bonuses you receive from your job',
        type: 'Earned',
        icon: 'briefcase',
      },
      Commission: {
        description: 'If your job is commission based, any commission you receive from your job',
        type: 'Earned',
        icon: 'briefcase',
      },
      'Gross Pay': {
        description:
          'Gross income received from your job before taxes and other benefits are deducted',
        type: 'Earned',
        icon: 'briefcase',
      },
      'Net Pay': {
        description:
          'Net income received from your job after taxes and other benefits are deducted',
        type: 'Earned',
        icon: 'briefcase',
      },
      Overtime: {
        description: 'If your job pays overtime, any overtime pay you receive from your job',
        type: 'Earned',
        icon: 'briefcase',
      },
    },
  },
}
