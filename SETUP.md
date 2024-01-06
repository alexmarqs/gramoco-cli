# Setup

These instructions will guide you through setting up your Instagram Business/Creator account to work with this tool.

## Step 1: Ensure You Have an Instagram Business/Creator Account

- Make sure your Instagram account is a Business/Creator account, as required by the Instagram Graph API.

- To convert your personal account to a Business/Creator account:
  1. Open Instagram and go to your profile.
  2. Tap the menu icon (☰) and select 'Settings'.
  3. Tap 'Account' and choose 'Switch to Professional Account'.
  4. Follow the prompts to complete the setup.

## Step 2: Link Your Instagram Business Account to a Facebook Page

- Link your Instagram Business account to a Facebook Page:
  1. Go to your Instagram profile settings.
  2. Tap 'Account' and then 'Linked Accounts'.
  3. Select 'Facebook' and follow the instructions to link your account.

## Step 3: Create a Facebook Developer Account and App

- **Who Can Do It:** Any individual with a Facebook account can create a Facebook Developer Account and subsequently set up a Facebook App. This is not restricted to business account holders.

- **Purpose:** The Facebook App acts as a bridge between your software and the Instagram Graph API, allowing you to authenticate and make requests to the API.

- **Process:**
  1. Visit the [Facebook Developers](https://developers.facebook.com/) website and sign in.
  2. Create a new app by selecting 'My Apps' > 'Create App'.
  3. Choose an app type that suits your needs (e.g., 'For Everything Else').
  4. Fill in the necessary details for your app.

## Step 4: Configure Instagram Graph API

- Configure the Instagram Graph API in your Facebook App:
  1. In your App's dashboard, navigate to 'Products' and add 'Instagram'.
  2. Set up the Instagram Graph API settings as required.

## Step 5: Add Your Instagram Business/Creator Account as a Test User 
(**Ignore this step if you are using a Facebook Developer Account that is linked to the Instagram Business/Creator account you want to use with this tool**)

- Add your account as a test user for app development purposes:
  1. In the 'Roles' section of your Facebook App settings, add your Instagram Business account as a test user.
  2. This step allows access to the Graph API features in development mode.

## Step 6: Graph API Explore

- Use the Graph API Explorer to generate an access token for your Instagram Business/Creator account:
  1. In your Facebook App dashboard, navigate to 'Tools' > 'Graph API Explorer'.
  2. Select your app from the dropdown menu.
  3. Generate a token.
  4. In the 'Permissions' tab, select the permissions you want to grant your app: `instagram_basic`.
  5. Click 'Generate Access Token'.
  6. Copy the access token and save it in the config file in the property `INSTAGRAM_ACCESS_TOKEN`.


 ## Step 7: Get Your Instagram Business/Creator Account ID

- In the Graph API Explorer, make sure you have the permissions: `pages_show_list`, `business_management`, `instagram_basic`  (you will need these permissions only once to get your Instagram Business/Creator account ID, after this you can just use the basic permissions: `instagram_basic` again)

- Generate token. Then, submit the following query:

```
me/accounts
```

- Copy the ID shown in the response and use it to do the following query:

```
{your_id}/?fields=instagram_business_account
```

- Copy the ID of your Instagram Account shown in the response and save it in the config file in the property `INSTAGRAM_ACCOUNT_ID`.

    
## Important Notes

- Keep any tokens or sensitive information secure.
