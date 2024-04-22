# mainmates

_mainmates_ is an app born of my own frustration at barely remembering friends' kids names, pet names, and generally feeling disconnected. It's a personal, private (but social) app that helps you to feel more connected to the people who matter in your life.

- Keep track of life events and conversations with your friends and family
- Add the big (and little) details like family and pets
- Offline-first; you don't have to sign up or share your details with anyone
- Runs on any browser, desktop or mobile. Your data is saved automatically
- Online sync support (coming soon)

**WARNING: This is alpha software, and I'm working towards a 1.0 public release. There is currently no sync or backup feature, and the app will change a lot before it gets to 1.0, which may result in loss of your data. Until the 1.0 release, you're advised _not_ to enter any data into this app which you're not prepared to lose.**

What's been done / what's to be done:

- [x] Show friends list
- [x] Add a data access layer that supports future syncing (Pouch DB)
- [x] Add a friend feature
- [x] Add a note feature
- [x] Edit existing notes
- [ ] Export friends and notes
- [ ] Add spouse / children / pet information
- [ ] First-time intro / onboarding flow

## Take it for a test-drive

- Install as an app on your phone: visit https://monodot.github.io/mainmates, then tap the Share button and the Add to to Home Screen (iOS).
- All of your data stays in your browser, and remains private to you.
- Or, you can go to the same address in your desktop web browser (but there's no sync feature yet, so your data won't be shared between devices)

**Warning:** This app runs entirely in your web browser, with no sync support yet. If you clear your web browser's cache, you will destroy all of your personal data. You will also lose all of your data if you access the app in a Private Browsing window/session.

## Developing

To hack on mainmates you probably want to serve it from a local web server. If you've got Python installed, you can use that as a simple web server:

```
git clone https://github.com/monodot/mainmates
cd mainmates/app
python -m http.server 8000
```

Then go to http://localhost:8000.

## Run on your own server

Self-hosting instructions to follow.

## License

Source code (c) 2024 Tom Donohue. Licensed under the [GNU Affero Public License (AGPL)][agpl]. See `LICENSE` for full license terms.

[agpl]: https://www.tldrlegal.com/license/gnu-affero-general-public-license-v3-agpl-3-0

