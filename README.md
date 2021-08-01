# RazeWarts

A chrome extension for users of SW 😎

### Install

1. Clone repo
2. Run `npm install`
3. Run `npm start`

### Development 🛠 

1. Checkout new branch
2. Do stuff
3. Create PR to master

### Release 
1. Push to master
2. Github Actions will create the release and publish it 🚀


## End-User 

1. Download the newest .zip file from the release page.
2. Extract it
3. Open `build/manifest.json` and replace the placeholder with the actual site name, e.g. `"matches": ["https://example.com/*"]`. 👀
4. In chrome, go to `chrome://extensions/`
5. Click `Load unpacked extension` and select the extracted build directory.
