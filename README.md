# Plex Music Web Prototype

A desktop-first React web prototype for a Plex music client with an Apple Music-inspired visual approach.

## What works now

- Home screen with Recent Releases, Most Played, Top Songs, Top Artists, Playlists and an Album Wall
- Search
- Album, artist, song and playlist library views
- Album and artist detail pages
- Working browser audio player
- Play, pause, next, previous, seek, volume, mute, shuffle and repeat
- Queue panel
- Demo music and generated cover art so the app works before Plex is connected
- Plex sign-in prototype using Plex's traditional PIN authentication flow
- Manual Plex server + token fallback
- Plex library loading for albums, artists, tracks and audio playlists
- Direct playback URLs from your Plex server when the browser can reach it
- Saves the chosen Plex connection in this browser
- Responsive layout for smaller windows

## Start it on Windows

### First time only

1. Install Node.js LTS from https://nodejs.org/
2. Extract this folder somewhere permanent, for example `C:\Users\YourName\Documents\Plex Music Web`.
3. Double-click `START.bat`.
4. Windows may ask about network access for Node. Allow it on Private networks.
5. The first run installs the required packages. This can take a few minutes.
6. Your browser opens to `http://localhost:5173`.

### Every time after that

Double-click `START.bat`.

Keep the black terminal window open while using the app. Closing that window stops the local development server.

## Connecting Plex

Click the gear icon in the app.

### Normal sign in

Try **Sign in with Plex** first. A Plex window opens. Sign in there, then the prototype looks for your Plex Media Server and Music library.

Browsers can be picky about direct connections to local servers. If normal sign in succeeds but the browser cannot reach the server, use the manual option.

### Manual connection

Enter your Plex server address, for example:

`http://192.168.1.20:32400`

Then enter your Plex token inside the app. Do not send the token in chat or share it with anyone.

The token is stored in this browser's local storage for this prototype.

## Important prototype note

Plex now recommends its newer JWT authentication system for new apps. This prototype uses the simpler traditional PIN flow so we can build and test the product quickly. Before publishing this as a real public app, authentication should be upgraded and hardened.

## If Plex audio does not play

The demo songs prove the player itself works. Plex playback can still fail because of browser codec support, CORS, HTTPS/local-network rules or a Plex format that the browser cannot decode directly. Those are exactly the kinds of limitations we can solve later when the web prototype becomes a Tauri desktop app.

## Files you will mostly edit later

- `src/App.tsx` contains the app behaviour and screens.
- `src/styles.css` contains the visual design.
- `public/audio/` contains the tiny demo audio clips.
