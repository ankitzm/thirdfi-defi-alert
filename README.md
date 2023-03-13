## **Getting Started**

ThirdFi Chrome Extension is a powerful tool designed to get notified about any defi opportunity for a Crypto in exchange with fiat like US Dollar or Euro.

### **Feature**

- **Real-time notifications**: Stay up-to-date on the latest DeFi opportunity with real-time notifications. This can help in tracking the buy or sell opportunity automatically as it fetches crypto price every minute.
- **User-friendly interface**: The Securo Chrome Extension has a sleek and intuitive interface that makes it easy to navigate and use. User just need to select the Crypto, Fiat and their target price one time and the extension will start running anytime it is clicked.
- **Reliable information**: The information provided by the Securo Chrome Extension is reliable and up-to-date. The extension fetches data from Securo API which updates every minute.
First, run the development server:


## **Setting up development Environment**

1. Setup the repository, [fork it here](https://github.com/ankitzm/thirdfi-defi-alert/fork) and clone using <br />
```bash
git clone https://github.com/[your-username]/thirdfi-defi-alert.git
```

2. Go to [https://app.thirdfi.org/](https://app.thirdfi.org/) and sign in.

3. From developer dashboard, go to API Key setup.
![Screenshot_20230310_211245](https://user-images.githubusercontent.com/66105983/224620903-0fa34aee-3fe1-42d3-a423-382db2ed6dc6.png)


4. Click on “Create New Key”
![Screenshot_20230310_211644](https://user-images.githubusercontent.com/66105983/224620907-3b1520ad-7425-4d79-95e3-853e99eb9b13.png)


5. Save the **API key** and **Client Secret** to the **.env** file, in your code.

![Screenshot_20230310_211812](https://user-images.githubusercontent.com/66105983/224620916-f4b5837c-ed61-4330-a8e0-51fc23d7f046.png)

6. **.env** is in the root of the codebase, save the secrets here.

![Screenshot_20230310_212029](https://user-images.githubusercontent.com/66105983/224620958-923b34ba-b03b-407b-a4e9-0cfa75223e7b.png)

7. Install Dependencies
```
pnpm install
or
npm install
```

## **Starting development environment**

Run the following:
```bash
pnpm dev
# or
npm run dev
```

Open your browser and load the appropriate development build. For example, if you are developing for the chrome browser, using manifest v3, use: `build/chrome-mv3-dev`.

You can start editing the popup by modifying `popup.tsx`. It should auto-update as you make changes. `popup.tsx` checkes if the user have already saved crypto and fiat and displays the price. Else, it will shows the `selectionPage.tsx`.
For further guidance, [visit Plasmo Documentation](https://docs.plasmo.com/)

## Making production build

Run the following:
```bash
pnpm build
# or
npm run build
```

This should create a production bundle for your extension, ready to be zipped and published to the stores. The production build will be saved in `build/chrome-mv3-prod`
