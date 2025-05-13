# Pill Mate

**Pill Mate** is a [Home Assistant](https://www.home-assistant.io/) addon to
help dependent people to take their medication.

This project is a prototype made for a pratical work in school.

## Development

This project is developed using a virtual machine with Home Assistant
supervised. The addon is installed using [ansible](https://www.ansible.com/).

```sh
git clone https://github.com/floflo0/pill-mate.git
cd pill-mate
cp pill_mate/.env.dist pill_mate/.env
```

Edit the `.env` file:
 - set `DEV` at 1
 - set `NODE_ENV` at development

```sh
make addon-setup
```

Then go in the logs of the addon and copy the `ADDON_ID` to `.env`.

```sh
cd pill_mate/frontend
npm install
npm run dev
```

There is hotreload for the frontend but you need to manually update the addon
backend using:

```sh
make add-update
```

## Documentation

### Backend

The backend API is documented with swagger. To open the documentation you can
run :

```sh
make swagger
```

This will open the swagger interface in your browser.

## Credits

Alarm sound from <https://pixabay.com/fr/sound-effects/phone-ringtone-clean-273554/>.
