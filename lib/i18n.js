// Centralized translation dictionary — the only place UI text lives.
// `en` is the source of truth; `km` mirrors it. No packages, no hardcoded
// strings in components: components call t("key").
export const DEFAULT_LOCALE = "en";
export const LOCALES = ["en", "km"];

export const translations = {
  en: {
    "site.name": "Khmer Childhood Games",
    "lang.switchTo": "Switch language",

    nav: {
      home: "Home",
      browse: "Browse",
      myEntries: "My entries",
      logIn: "Log in",
      signUp: "Sign up",
      logOut: "Log out",
      submit: "Submit entry",
    },

    home: {
      eyebrow: "An archive, kept by the people who played",
      title: "Khmer childhood games that children played before smartphones",
      footer:
        "Collected from grandparents, cousins, and neighbours across Cambodia. Know a game that belongs here? Send it in.",
    },

    browse: {
      eyebrow: "The whole collection",
      title: "Browse & search every game in the archive",
    },

    search: {
      label: "Search the archive",
      placeholder: "ស្វែងរក… ឧ. ចោលឈូង, tug, Sophea / Search…",
      clear: "Clear search",
      count: "game",
      countPlural: "games",
      countFound: "found",
      loading: "Loading the archive…",
      emptyTitle: "The archive is empty right now. Check back soon — the first entries will appear here.",
      error:
        "Could not load games from the archive. Check that Supabase is set up and that the entries table exists and is seeded.",
      tryInstead: "Try one of these instead:",
      noMatch:
        "\u201C{query}\u201D didn\u2019t match any games. Try a Khmer or English name, a contributor, or a place.",
    },

    login: {
      eyebrow: "Welcome back",
      title: "Sign in to the archive",
      email: "Email",
      password: "Password",
      forgot: "Forgot password?",
      invalid: "Invalid email or password",
      signIn: "Sign in",
      signingIn: "Signing in…",
      newHere: "New to the archive?",
      createAccount: "Create an account",
      confirmed: "Your email has been confirmed. You can now sign in.",
    },

    signup: {
      eyebrow: "Join the archive",
      title: "Create your account",
      email: "Email",
      password: "Password",
      username: "Username",
      usernameHint: "(English or Khmer)",
      usernameRequired: "Please enter a username.",
      usernameTooLong: "Username must be 30 characters or fewer.",
      create: "Create account",
      creating: "Creating account…",
      already: "Already have an account?",
      signIn: "Sign in",
      duplicate:
        "An account with this email already exists. Check your inbox for the confirmation link, or sign in.",
      fail: "We could not create your account. Please try again.",
      success: "Registration successful! Please check your email to confirm your account.",
      resend: "Resend confirmation email",
      resent: "Confirmation email sent again — check your inbox, including spam.",
      resendFail: "Could not resend the email. Please try again.",
    },

    forgot: {
      eyebrow: "Account help",
      title: "Reset your password",
      email: "Email",
      enterEmail: "Enter the email address for your account.",
      sent: "Check your email for a password reset link.",
      send: "Send reset link",
      sending: "Sending…",
      fail: "We could not send a reset email. Please try again.",
      remembered: "Remembered it?",
      signIn: "Sign in",
    },

    updatePassword: {
      eyebrow: "Password reset",
      title: "Choose a new password",
      password: "New password",
      confirm: "Confirm new password",
      update: "Update password",
      updating: "Updating…",
      short: "Your password must be at least 6 characters.",
      mismatch: "The two passwords do not match.",
      updated: "Your password has been updated.",
      fail: "We could not update your password. Please try again.",
      checking: "Checking your reset link…",
      invalid: "This reset link is invalid or has expired.",
      requestNew: "Request a new one",
      back: "Back to",
      signIn: "sign in",
    },

    confirm: {
      eyebrow: "Email confirmation",
      title: "Confirm your email",
      checking: "Confirming your email…",
      invalid: "This confirmation link is invalid or has expired.",
      signIn: "Sign in",
      resendIntro: "or resend a new confirmation email below.",
      email: "Email",
      resend: "Resend confirmation email",
      sending: "Sending…",
      enterEmail: "Enter the email you registered with.",
      resent: "Confirmation email sent again — check your inbox, including spam.",
      resendFail: "Could not resend the email. Please try again.",
    },

    submit: {
      eyebrow: "Contribute to the archive",
      title: "Submit an entry",
      checking: "Checking your session…",
      signIn: "Please sign in to submit an entry.",
      signInRest: "to submit an entry.",
      btn: "Submit entry",
      submitting: "Submitting…",
      cancel: "Cancel",
      hint:
        "Entries should be Khmer childhood or traditional children's games, with accurate information. Share only photos you are allowed to use. The archive owner may review, edit, or remove submissions.",
      duplicate: "An entry with this name already exists in the archive.",
      photoFail: "The photo could not be uploaded. Please try again.",
      insertFail: "We could not save your entry. Please try again.",
      unknown: "Something went wrong. Please try again.",
      signInFirst: "Please sign in first to submit an entry.",
      success: "You submitted successfully. Now it is being reviewed.",
    },

    field: {
      nameKhmer: "Name in Khmer",
      nameEnglish: "Name in English",
      tagline: "Tagline",
      taglineOptional: "(optional)",
      description: "Description",
      steps: "How to play / Steps",
      stepsHint: "one step per line, in order",
      players: "Players",
      materials: "Materials",
      contributor: "Contributor name",
      place: "Place",
      photo: "Photo",
      photoHint: "one image up to 5 MB (no videos)",
      stepsPlaceholder:
        "One step per line, in the order you play them. Example: players line up in a circle.",
      photoPreview: "Preview of the game photo",
    },

    validation: {
      required: "\u201C{field}\u201D is required.",
      tooLong: "\u201C{field}\u201D is too long — {max} characters or fewer, please.",
      stepsRequired: "Add at least one step for How to play.",
      stepsMax: "Please keep How to play to {max} steps or fewer.",
      stepLong: "Each step must be under {max} characters.",
      photoRequired: "Choose one photo of the game.",
      photoNotImage: "That file isn't an image — videos and other files are not accepted.",
      photoTooLarge: "The photo is too large — 5 MB or smaller, please.",
      emailRequired: "Enter the email address for your account.",
    },

    editPage: {
      eyebrow: "Your contribution",
      title: "Edit entry",
      loading: "Loading your entry…",
      signIn: "Please sign in to edit your entries.",
      signInRest: "to edit your entries.",
      notOwner: "You can only edit entries you created yourself.",
      backMyEntries: "Back to my entries",
      notFound: "That entry doesn't exist.",
      backArchive: "Back to the archive",
      save: "Save changes",
      saving: "Saving…",
      cancel: "Cancel",
      saved: "Your changes have been saved.",
      duplicate: "An entry with this name already exists in the archive.",
      saveFail: "We could not save your changes. Please try again.",
      photoFail: "The photo could not be uploaded. Please try again.",
      unknown: "Something went wrong. Please try again.",
      signInFirst: "Please sign in first.",
    },

    myEntries: {
      eyebrow: "Your contributions",
      title: "My entries",
      loading: "Loading your entries…",
      signIn: "to see the entries you created.",
      loadFail: "Could not load your entries.",
      empty: "You haven't created any entries yet.",
      submitFirst: "Submit your first one",
      edit: "Edit",
      delete: "Delete",
      deleting: "Deleting…",
      confirmDelete: "Delete \u201C{title}\u201D? This cannot be undone.",
      deleteFail: "Could not delete the entry. Please try again.",
      unknown: "Something went wrong. Please try again.",
      statusPending: "Your entry is pending review.",
      statusPublished: "Your entry is published.",
      statusReturned: "Your entry has been returned.",
    },

    card: {
      contributedBy: "Contributed by",
      place: "Place",
      viewDetails: "View details",
    },

    detail: {
      allGames: "All games",
      back: "Back to all games",
      players: "Players",
      need: "You'll need",
      contributedBy: "Contributed by",
      howToPlay: "How to play",
      about: "About the game",
    },

  },

  km: {
    "site.name": "ល្បែងកុមារខ្មែរ",
    "lang.switchTo": "ប្តូរភាសា",

    nav: {
      home: "ទំព័រដើម",
      browse: "រកមើល",
      myEntries: "ល្បែងរបស់ខ្ញុំ",
      logIn: "ចូល",
      signUp: "ចុះឈ្មោះ",
      logOut: "ចាកចេញ",
      submit: "បញ្ជូនល្បែង",
    },

    home: {
      eyebrow: "បណ្ណសារ ដែលរក្សាដោយអ្នកដែលធ្លាប់លេង",
      title: "ល្បែងកុមារខ្មែរ ដែលក្មេងៗលេងមុនសម័យទូរសព្ទ",
      footer:
        "ប្រមូលពីតា យាយ បងប្អូន និងអ្នកជិតខាងទូទាំងប្រទេសកម្ពុជា។ ចេះល្បែងណាដែលគួរស្ថិតនៅទីនេះ? សូមផ្ញើមក។",
    },

    browse: {
      eyebrow: "បណ្តុំទាំងមូល",
      title: "រកមើល និង ស្វែងរកល្បែងទាំងអស់ក្នុងបណ្ណសារ",
    },

    search: {
      label: "ស្វែងរកល្បែង",
      placeholder: "ស្វែងរក… ឧ. ចោលឈូង, tug, Sophea / ស្វែងរក…",
      clear: "សម្អាតការស្វែងរក",
      count: "ល្បែង",
      countPlural: "ល្បែង",
      countFound: "រកឃើញ",
      loading: "កំពុងផ្ទុកបណ្ណសារ…",
      emptyTitle:
        "បណ្ណសារនៅទទេនៅឡើយ។ សូមត្រឡប់មកមើលវិញនៅពេលក្រោយ — ល្បែងដំបូងនឹងបង្ហាញនៅទីនេះ។",
      error:
        "មិនអាចផ្ទុកល្បែងពីបណ្ណសារបានទេ។ សូមពិនិត្យមើលការកំណត់របស់ Supabase និងតារាង entries។",
      tryInstead: "សាកល្បែងទាំងនេះជំនួស:",
      noMatch:
        "«{query}» មិនត្រូវនឹងល្បែងណាទេ។ សាកឈ្មោះជាភាសាខ្មែរ ឬអង់គ្លេស អ្នកចូលរួម ឬទីកន្លែង។",
    },

    login: {
      eyebrow: "សូមស្វាគមន៍ត្រឡប់មកវិញ",
      title: "ចូលទៅបណ្ណសារ",
      email: "អ៊ីមែល",
      password: "ពាក្យសម្ងាត់",
      forgot: "ភ្លេចពាក្យសម្ងាត់?",
      invalid: "អ៊ីមែល ឬ ពាក្យសម្ងាត់មិនត្រឹមត្រូវ",
      signIn: "ចូល",
      signingIn: "កំពុងចូល…",
      newHere: "ថ្មីនឹងបណ្ណសារ?",
      createAccount: "បង្កើតគណនី",
      confirmed: "អ៊ីមែលរបស់អ្នកត្រូវបានបញ្ជាក់ហើយ។ ឥឡូវអ្នកអាចចូលបាន។",
    },

    signup: {
      eyebrow: "រួមចំណែកជាមួយបណ្ណសារ",
      title: "បង្កើតគណនីរបស់អ្នក",
      email: "អ៊ីមែល",
      password: "ពាក្យសម្ងាត់",
      username: "ឈ្មោះអ្នកប្រើ",
      usernameHint: "(អង់គ្លេស ឬ ខ្មែរ)",
      usernameRequired: "សូមបញ្ចូលឈ្មោះអ្នកប្រើ។",
      usernameTooLong: "ឈ្មោះអ្នកប្រើត្រូវមានមិនលើស 30 តួអក្សរ។",
      create: "បង្កើតគណនី",
      creating: "កំពុងបង្កើត…",
      already: "មានគណនីហើយមែនទេ?",
      signIn: "ចូល",
      duplicate:
        "គណនីដែលមានអ៊ីមែលនេះមានរួចហើយ។ សូមពិនិត្យអ៊ីមែលសម្រាប់តំណបញ្ជាក់ ឬ ចូលគណនី។",
      fail: "យើងមិនអាចបង្កើតគណនីរបស់អ្នកបានទេ។ សូមព្យាយាមម្តងទៀត។",
      success: "ការចុះឈ្មោះបានជោគជ័យ! សូមពិនិត្យអ៊ីមែលរបស់អ្នកដើម្បីបញ្ជាក់គណនី។",
      resend: "ផ្ញើអ៊ីមែលបញ្ជាក់ម្តងទៀត",
      resent: "បានផ្ញើអ៊ីមែលបញ្ជាក់ម្តងទៀត — សូមពិនិត្យប្រអប់សារ រួមទាំងសារឥតបានការ។",
      resendFail: "មិនអាចផ្ញើអ៊ីមែលបានទេ។ សូមព្យាយាមម្តងទៀត។",
    },

    forgot: {
      eyebrow: "ជំនួយគណនី",
      title: "កំណត់ពាក្យសម្ងាត់ឡើងវិញ",
      email: "អ៊ីមែល",
      enterEmail: "សូមបញ្ចូលអ៊ីមែលរបស់គណនីអ្នក។",
      sent: "សូមពិនិត្យអ៊ីមែលរបស់អ្នកសម្រាប់តំណកំណត់ពាក្យសម្ងាត់ឡើងវិញ។",
      send: "ផ្ញើតំណកំណត់ឡើងវិញ",
      sending: "កំពុងផ្ញើ…",
      fail: "យើងមិនអាចផ្ញើអ៊ីមែលកំណត់ឡើងវិញបានទេ។ សូមព្យាយាមម្តងទៀត។",
      remembered: "នឹកឃើញហើយមែនទេ?",
      signIn: "ចូល",
    },

    updatePassword: {
      eyebrow: "កំណត់ពាក្យសម្ងាត់",
      title: "ជ្រើសរើសពាក្យសម្ងាត់ថ្មី",
      password: "ពាក្យសម្ងាត់ថ្មី",
      confirm: "បញ្ជាក់ពាក្យសម្ងាត់ថ្មី",
      update: "ធ្វើបច្ចុប្បន្នភាពពាក្យសម្ងាត់",
      updating: "កំពុងធ្វើបច្ចុប្បន្នភាព…",
      short: "ពាក្យសម្ងាត់ត្រូវមានយ៉ាងហោចណាស់ 6 តួអក្សរ។",
      mismatch: "ពាក្យសម្ងាត់ទាំងពីរមិនត្រូវគ្នាទេ។",
      updated: "ពាក្យសម្ងាត់របស់អ្នកត្រូវបានធ្វើបច្ចុប្បន្នភាព។",
      fail: "យើងមិនអាចធ្វើបច្ចុប្បន្នភាពពាក្យសម្ងាត់បានទេ។ សូមព្យាយាមម្តងទៀត។",
      checking: "កំពុងពិនិត្យតំណកំណត់ឡើងវិញ…",
      invalid: "តំណនេះមិនត្រឹមត្រូវ ឬ ផុតកំណត់ហើយ។",
      requestNew: "ស្នើសុំតំណថ្មី",
      back: "ត្រឡប់ទៅ",
      signIn: "ចូល",
    },

    confirm: {
      eyebrow: "ការបញ្ជាក់អ៊ីមែល",
      title: "បញ្ជាក់អ៊ីមែលរបស់អ្នក",
      checking: "កំពុងបញ្ជាក់អ៊ីមែល…",
      invalid: "តំណបញ្ជាក់នេះមិនត្រឹមត្រូវ ឬ ផុតកំណត់ហើយ។",
      signIn: "ចូល",
      resendIntro: "ឬ ផ្ញើអ៊ីមែលបញ្ជាក់ថ្មីខាងក្រោម។",
      email: "អ៊ីមែល",
      resend: "ផ្ញើអ៊ីមែលបញ្ជាក់ម្តងទៀត",
      sending: "កំពុងផ្ញើ…",
      enterEmail: "សូមបញ្ចូលអ៊ីមែលដែលអ្នកបានចុះឈ្មោះ។",
      resent: "បានផ្ញើអ៊ីមែលបញ្ជាក់ម្តងទៀត — សូមពិនិត្យប្រអប់សារ រួមទាំងសារឥតបានការ។",
      resendFail: "មិនអាចផ្ញើអ៊ីមែលបានទេ។ សូមព្យាយាមម្តងទៀត។",
    },

    submit: {
      eyebrow: "រួមចំណែកជាមួយបណ្ណសារ",
      title: "បញ្ជូនល្បែង",
      checking: "កំពុងពិនិត្យសម័យ…",
      signIn: "សូមចូលគណនីជាមុន ដើម្បីបញ្ជូនល្បែង។",
      signInRest: "ដើម្បីបញ្ជូនល្បែង។",
      btn: "បញ្ជូនល្បែង",
      submitting: "កំពុងបញ្ជូន…",
      cancel: "បោះបង់",
      hint:
        "ល្បែងដែលបញ្ជូន គួរជាល្បែងកុមារខ្មែរ ឬ ល្បែងប្រពៃណី ដោយមានព័ត៌មានត្រឹមត្រូវ។ សូមចែករំលែកតែរូបថតដែលអ្នកមានសិទ្ធិប្រើប្រាស់។ ម្ចាស់បណ្ណសារអាចពិនិត្យ កែសម្រួល ឬ លុបការបញ្ជូនបាន។",
      duplicate: "ល្បែងដែលមានឈ្មោះនេះមានរួចហើយក្នុងបណ្ណសារ។",
      photoFail: "មិនអាចផ្ទុករូបថតបានទេ។ សូមព្យាយាមម្តងទៀត។",
      insertFail: "យើងមិនអាចរក្សាទុកល្បែងរបស់អ្នកបានទេ។ សូមព្យាយាមម្តងទៀត។",
      unknown: "មានបញ្ហាអ្វីមួយ។ សូមព្យាយាមម្តងទៀត។",
      signInFirst: "សូមចូលគណនីជាមុន ដើម្បីបញ្ជូនល្បែង។",
      success: "អ្នកបានបញ្ជូនបានជោគជ័យ។ ឥឡូវកំពុងស្ថិតក្រោមការពិនិត្យ។",
    },

    field: {
      nameKhmer: "ឈ្មោះជាភាសាខ្មែរ",
      nameEnglish: "ឈ្មោះជាភាសាអង់គ្លេស",
      tagline: "ឃ្លាសង្ខេប",
      taglineOptional: "(ស្រេចចិត្ត)",
      description: "ការពិពណ៌នា",
      steps: "របៀបលេង / ជំហាន",
      stepsHint: "មួយជំហានក្នុងមួយបន្ទាត់",
      players: "អ្នកលេង",
      materials: "សម្ភារៈ",
      contributor: "ឈ្មោះអ្នកចូលរួម",
      place: "ទីកន្លែង",
      photo: "រូបថត",
      photoHint: "រូបថតមួយសន្លឹក មិនលើសពី 5 MB (មិនទទួលវីដេអូ)",
      stepsPlaceholder:
        "មួយជំហានក្នុងមួយបន្ទាត់ តាមលំដាប់លេង។ ឧទាហរណ៍៖ អ្នកលេងឈរជារង្វង់។",
      photoPreview: "មើលជាមុននៃរូបថតល្បែង",
    },

    validation: {
      required: "«{field}» ជាតម្រូវការ។",
      tooLong: "«{field}» វែងពេក — សូមរក្សាមិនលើស {max} តួអក្សរ។",
      stepsRequired: "សូមបន្ថែមយ៉ាងហោចណាស់មួយជំហានសម្រាប់របៀបលេង។",
      stepsMax: "សូមរក្សារបៀបលេងមិនលើស {max} ជំហាន។",
      stepLong: "ជំហាននីមួយៗត្រូវមានតិចជាង {max} តួអក្សរ។",
      photoRequired: "សូមជ្រើសរើសរូបថតមួយសន្លឹកនៃល្បែង។",
      photoNotImage: "ឯកសារនេះមិនមែនជារូបភាពទេ — មិនទទួលវីដេអូ ឬ ឯកសារផ្សេងទេ។",
      photoTooLarge: "រូបថតធំពេក — សូមរក្សាមិនលើស 5 MB។",
      emailRequired: "សូមបញ្ចូលអ៊ីមែលរបស់គណនីអ្នក។",
    },

    editPage: {
      eyebrow: "ការចូលរួមរបស់អ្នក",
      title: "កែសម្រួលល្បែង",
      loading: "កំពុងផ្ទុកល្បែង…",
      signIn: "សូមចូលគណនីដើម្បីកែសម្រួលល្បែងរបស់អ្នក។",
      signInRest: "ដើម្បីកែសម្រួលល្បែងរបស់អ្នក។",
      notOwner: "អ្នកអាចកែសម្រួលតែល្បែងដែលអ្នកបានបង្កើតប៉ុណ្ណោះ។",
      backMyEntries: "ត្រឡប់ទៅល្បែងរបស់ខ្ញុំ",
      notFound: "ល្បែងនេះមិនមានទេ។",
      backArchive: "ត្រឡប់ទៅបណ្ណសារ",
      save: "រក្សាទុកការផ្លាស់ប្តូរ",
      saving: "កំពុងរក្សាទុក…",
      cancel: "បោះបង់",
      saved: "ការផ្លាស់ប្តូររបស់អ្នកត្រូវបានរក្សាទុក។",
      duplicate: "ល្បែងដែលមានឈ្មោះនេះមានរួចហើយក្នុងបណ្ណសារ។",
      saveFail: "យើងមិនអាចរក្សាទុកការផ្លាស់ប្តូរបានទេ។ សូមព្យាយាមម្តងទៀត។",
      photoFail: "មិនអាចផ្ទុករូបថតបានទេ។ សូមព្យាយាមម្តងទៀត។",
      unknown: "មានបញ្ហាអ្វីមួយ។ សូមព្យាយាមម្តងទៀត។",
      signInFirst: "សូមចូលគណនីជាមុន។",
    },

    myEntries: {
      eyebrow: "ការចូលរួមរបស់អ្នក",
      title: "ល្បែងរបស់ខ្ញុំ",
      loading: "កំពុងផ្ទុកល្បែងរបស់អ្នក…",
      signIn: "ដើម្បីមើលល្បែងដែលអ្នកបានបង្កើត។",
      loadFail: "មិនអាចផ្ទុកល្បែងរបស់អ្នកបានទេ។",
      empty: "អ្នកមិនទាន់បានបង្កើតល្បែងណាមួយនៅឡើយទេ។",
      submitFirst: "បញ្ជូនល្បែងដំបូង",
      edit: "កែសម្រួល",
      delete: "លុប",
      deleting: "កំពុងលុប…",
      confirmDelete: "លុប «{title}»? សកម្មភាពនេះមិនអាចប្រគល់ត្រឡប់វិញបានទេ។",
      deleteFail: "មិនអាចលុបល្បែងបានទេ។ សូមព្យាយាមម្តងទៀត។",
      unknown: "មានបញ្ហាអ្វីមួយ។ សូមព្យាយាមម្តងទៀត។",
      statusPending: "ល្បែងរបស់អ្នកកំពុងរង់ចាំការពិនិត្យ។",
      statusPublished: "ល្បែងរបស់អ្នកត្រូវបានចេញផ្សាយ។",
      statusReturned: "ល្បែងរបស់អ្នកត្រូវបានប្រគល់ត្រឡប់។",
    },

    card: {
      contributedBy: "ចូលរួមដោយ",
      place: "ទីកន្លែង",
      viewDetails: "មើលលម្អិត",
    },

    detail: {
      allGames: "ល្បែងទាំងអស់",
      back: "ត្រឡប់ទៅល្បែងទាំងអស់",
      players: "អ្នកលេង",
      need: "អ្នកត្រូវការ",
      contributedBy: "ចូលរួមដោយ",
      howToPlay: "របៀបលេង",
      about: "អំពីល្បែង",
    },
  },
};

// Look up a dotted key ("nav.home") in the active locale, falling back to
// English, then to the key itself. `vars` replaces {name} placeholders.
export function translate(locale, key, vars) {
  const dict = translations[locale] || translations[DEFAULT_LOCALE];
  let value = dict;

  // Flat dotted keys like "site.name" are stored as-is; check those first.
  if (dict && typeof dict === "object" && key in dict) {
    value = dict[key];
  } else {
    for (const part of String(key).split(".")) {
      if (value && typeof value === "object" && part in value) {
        value = value[part];
      } else {
        return key;
      }
    }
  }
  let text = String(value);
  if (vars) {
    for (const [name, replacement] of Object.entries(vars)) {
      text = text.split(`{${name}}`).join(String(replacement));
    }
  }
  return text;
}