# mainmates

**NOTICE: This is alpha software, and I'm working towards a 1.0 public release. There is currently no sync or backup feature, and the app will change a lot before it gets to 1.0. Until the 1.0 release, you're advised _not_ to enter any data into this app which you're not prepared to lose.**

A personal, private social app that helps you to make stronger connections with the people who matter in your life.

- Offline-first
- Cross-platform Progressive Web App (PWA)
- Online sync support (coming soon)

## Take it for a test-drive

- You can use the public version at https://monodot.github.io/mainmates.
- For the best experience on mobile, install the app to your Home Screen (iOS).
- All of your data stays in your browser, and remains private to you.

**Warning:** This app runs entirely in your web browser, with no sync support yet. If you clear your web browser's cache, you will destroy all of your personal data.

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

