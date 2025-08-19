export interface ILocaleData {
  direction: string
  locale: string
  routes: {
    dashboard: string
    accounts: string
    reports: string
    settings: string
    logout: string
    'user-settings': string
    'household-settings': string
  }
  screens: {
    setupScreen: {
      profile: string
      household: string
      encryption: string
      members: string
      accounts: string
      intro: string
      nextCreate: string
      nextSetup: string
      the: string
      nextMembers: string
      nextAccounts: string
      nextIntro: string
      ready: string
      finish: string
      personalDetails: string
      welcome: string
      confirm: string
      userAvatar: string
      invalidUserAvatar: string
      firstName: string
      enterFirstName: string
      firstNameRequired: string
      lastName: string
      enterLastName: string
      lastNameRequired: string
      setupYourHousehold: string
      HoueholdDescription: string
      logo: string
      selectLogo: string
      logoRequired: string
      name: string
      enterName: string
      nameRequired: string
      country: string
      searchCountries: string
      countryRequired: string
      defaultCurrency: string
      currencyRequired: string
      searchCurrencies: string
      setupEncryptionKeys: string
      drawPattern: string
      note: string
      setupYourBankAccounts: string
      setupYourBankAccountsDescription: string
      optionallyAddMembers: string
      addHouseholdMembers: string
      addInstitution: string
      addAccount: string
    }
    authScreen: {
      email: string
      sendCode: string
      next: string
      checkInbox: string
      emailSent: string
      verificationCode: string
      didNotReceiveCode: string
      goBack: string
    }
  }
  pages: {
    dashboard: {
      financialFreedomIndex: string
      incomeAndExpenses: string
      greatJob: string
      financialFreedom: string
      financialFreedomMonths: string
      month: string
      passive: string
      totalExpenses: string
      importantExpenses: string
      criticalExpenses: string
      passiveIncome: string
      noDataFound: string
      averageIncome: string
      moreThanAverage: string
      noIncome: string
      noExpenses: string
      noData: string
    }
    accounts: {
      currentBalance: string
      title: string
      createAccount: string
      editAccount: string
      deleteAccount: string
      accountName: string
      balance: string
      viewSettings: string
      groupBy: string
      institution: string
      country: string
      currency: string
      accountOwner: string
      accountType: string
      accountTypeHelper: string
      sortBy: string
      sortAZ: string
      accountBalance: string
      showClosedAccounts: string
      add: string
      addInstitution: string
      addAccount: string
    }
    reports: {
      thisMonth: string
      lastMonth: string
      thisQuarter: string
      lastQuarter: string
      thisYearToDate: string
      thisYear: string
      last12Months: string
      lastYear: string
      monthlyIncomeandExpenses: string
      settings: string
      export: string
      net: string
      income: string
      expenses: string
      total: string
    }
    settings: {
      'user-settings': string
      'household-settings': string
      categories: string
      personalInformation: string
      avatarRequired: string
      firstName: string
      firstNameRequired: string
      lastName: string
      lastNameRequired: string
      email: string
      emailPlaceholder: string
      emailRequired: string
      phoneNumber: string
      phoneNumberRequired: string
      update: string
      householdMembers: string
      householdInformation: string
      enterHouseholdName: string
      householdNameRequired: string
      country: string
      defaultCurrency: string
      addGroupCategory: string
      addGroup: string
      addCategory: string
      income: string
      noCategoryCreated: string
      expenses: string
      'Delete Category:': string
      Cancel: string
      'Are you sure you want to delete this Category?': string
      'This Category has ': string
      'Transactions in it. You can select which Category to re-assign them to or select nothing to leave them unclassified.': string
      'Re-Assign Transactions Category': string
      'Invalid Category Selected': string
      confirmText: string
      'Delete Category Group:': string
      'Are you sure you want to delete this Category Group?': string
      'This Category Group has ': string
      'categories in it. Please select which Category Group you would like to move them too.': string
      'Re-Assign Categories Category Group': string
      'A Category Group is required': string
      'New Category Group': string
      Name: string
      Description: string
      Type: string
      Icon: string
      'Edit Group': string
      Categories: string
    }
  }
  components: {
    fields: {
      'Cash Accounts': string
      'Credit Cards': string
      'Checking Account': string
      'Savings Account': string
      'HSA Cash Account': string
      'Certificate of Deposit': string
      'Money Market Account': string
      'PayPal Cash Account': string
      'Prepaid Debit Card': string
      'Brokerage Cash Management Account': string
      'Credit Card': string
      'Electronic Benefit Transfer (EBT) Account': string
      'PayPal Credit Card': string
      'Everyday checking account': string
      'Everyday savings account': string
      'Health Savings Account (US only) that can only hold cash': string
      'Certificate of deposit account': string
      'A prepaid Debit Card Account that you can load money onto to spend': string
      'A cash management account, typically a cash account at a brokerage': string
      'An Electronic Benefit Transfer (EBT) account, used by certain public assistance programs to distribute funds (US only)': string
      'Bank-issued credit card': string
      'PayPal-issued credit card': string
    }
    accountTable: {
      noInstitutionsFound: string
      addAnInstitution: string
      edit: string
      addAccount: string
      remove: string
      delete: string
      cancel: string
      noAccountsFound: string
      noAccountsFoundFor: string
      confirmDeleteInstitution: string
      DialogContentTextInstitution: string
      DialogContentTextExtraInstitution: string
      confirmDeleteAccount: string
      DialogContentTextAccount: string
      DialogContentTextExtraAccount: string
    }
    table: {
      date: string
      dateRequired: string
      addNote: string
      notePlaceholder: string
      titleRequired: string
      title: string
      split: string
      tags: string
      owners: string
      currency: string
      category: string
      amount: string
      amountRequired: string
      account: string
      balance: string
      reviewed: string
      notes: string
      startingBalance: string
      searchTransactions: string
      importTransactions: string
      displayColumns: string
      expandAllSplits: string
      addTransaction: string
      tableSettings: string
      searchCategories: string
      splitTransaction: string
      addSplit: string
      leftToSplit: string
      delete: string
      cancel: string
      save: string
      Unclassified: string
    }
    UserTable: {
      avatar: string
      firstName: string
      lastName: string
      email: string
      role: string
      createdOn: string
      actions: string
      addMember: string
    }
    contextMenu: {
      'Edit Transaction Notes': string
      'Edit Notes': string
      'Leave blank to clear notes': string
      'Search or create new tags': string
      'Cannot Add Owner as Selection Contains Split Transaction': string
      'Add Tag': string
      Remove: string
      Duplicate: string
      'Mark as Reviewed': string
      'Insert New': string
      'Recently Used': string
      'Cannot Change Category as Selection Contains Split Transaction': string
      'Change Category': string
      'Edit Transaction': string
      confirm: string
      cancel: string
      transaction: string
      'Delete User': string
      'Are you sure you want to delete the user': string
      'from Angelfish?': string
    }
    modals: {
      ImportTransactions: {
        selectFile: string
        confirmMappings: string
        reviewTransactions: string
        selectFileToImport: string
        next: string
        filePath: string
        filePathHelper: string
        accountToImportInto: string
        accountToImportIntoHelper: string
        searchBankAccounts: string
        csvDelimiter: string
        csvDelimiterHelper: string
        date: string
        name: string
        amount: string
        memo: string
        isPending: string
        checkNumber: string
        mapCSVHeaders: string
        transactionFields: string
        csvColumns: string
        selectColumn: string
        skip: string
        importSettings: string
        dateFormat: string
        selectDateFormat: string
        csvDelimiterRequired: string
        csvDelimiterInvalid: string
        fileParsingError: string
        mapThe: string
        mapTheHelper: string
        accounts: string
        account: string
        categories: string
        searchCategories: string
        import: string
        transactions: string
        cancel: string
      }
    }
    drawers: {
      save: string
      InstitutionDrawer: {
        edit: string
        add: string
        remove: string
        name: string
        errorName: string
        logo: string
        errorLogo: string
        logoDialog: string
        country: string
        errorCountry: string
        countryHelper: string
        website: string
        errorWebsite: string
        websiteHelper: string
        isOpen: string
        isOpenHelper: string
        namePlaceholder: string
        countryPlaceholder: string
        websitePlaceholder: string
      }
      BankAccountDrawer: {
        edit: string
        add: string
        remove: string
        name: string
        errorName: string
        namePlaceholder: string
        institution: string
        errorInstitution: string
        nameHelper: string
        accountType: string
        errorAccountType: string
        accountOwners: string
        errorAccountOwners: string
        accountOwnersHelper: string
        startBalance: string
        errorStartBalance: string
        startBalanceHelper: string
        accountLimit: string
        errorAccountLimit: string
        accountLimitHelper: string
        isOpen: string
        currency: string
        isOpenHelper: string
        errorCurrency: string
        currencyHelper: string
        institutionPlaceholder: string
        typePlaceholder: string
        currencyPlaceholder: string
      }
      ReportsSettingsDrawer: {
        reportSettings: string
        includeUnclassifiedTransactions: string
        includeUnclassifiedTransactionsHelper: string
      }
      CategoryGroupDrawer: {
        edit: string
        create: string
        delete: string
        name: string
        namePlaceholder: string
        errorName: string
        description: string
        descriptionPlaceholder: string
        errorDescription: string
        type: string
        errorType: string
        icon: string
        errorIcon: string
        color: string
        errorColor: string
      }
      CategoryDrawer: {
        edit: string
        create: string
        delete: string
        name: string
        namePlaceholder: string
        errorName: string
        description: string
        descriptionPlaceholder: string
        errorDescription: string
        type: string
        errorType: string
        group: string
        groupType: string
        icon: string
        errorIcon: string
        color: string
        errorColor: string
        searchCategories: string
      }
      UserDrawer: {
        edit: string
        create: string
        delete: string
        avatar: string
        errorAvatar: string
        name: string
        namePlaceholder: string
        errorName: string
        lastName: string
        lastNamePlaceholder: string
        errorLastName: string
        email: string
        emailPlaceholder: string
        errorEmail: string
        phoneNumber: string
        phoneNumberPlaceholder: string
        errorPhoneNumber: string
        role: string
        errorRole: string
      }
    }
  }
}
