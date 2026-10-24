# MCZ-pelletstove-esphome
Get your old MCZ pelletstove in Home Assistant with ESPHome

## Disclaimer
The code for this project is fully developed with AI (ChatGPT). This is an experimental community project, not an official MCZ integration. Reception and package contents have been examined based on a single installation. Other MCZ models, remote controls, or LilyGO revisions are not automatically compatible.
The configuration has been verified at the software level; the full physical operation
of all transmission commands and temperature control must be tested for each individual installation.

## Why?
I have a lot of things in Home Assistant but my pelletstove is to old (around 13 years) to have wifi. The remote has fallen multiple times from the couch and half the screen is not readable. This project was to get the stove in Home Assistant and operate it from there so I can use some extra features (for example to start it when I leave from work so it's hot in the living room when I arrive). It works with my MCZ Ego AIR 2.0 which uses a remote on the 434.5Mhz band.

## Functions
- Explicit on/off; power levels 1–5.
- Fan 1: 1–5/Auto. Fan 2: 0–5/Auto, where 0 means off.
- Receives signals from the original remote control and updates settings in HA accordingly.
- Retains settings and target temperature.
- Automatic control using an existing HA temperature sensor; functions even when the dashboard is closed.
- Card displaying target temperature (+/−), measured temperature, modes, fan settings, and the most recent command.
- OLED display showing device name/IP address, set to 30% contrast, with the text position shifting every five minutes to avoid burn-in on the screen.

The card uses on the auto setting an external temperature sensor (I have a cheap [Xiaomi](LYWSD03MMC)) to use as a thermostat:
  - greater than 2 °C difference: power and ventilator 1 on full
  - between 0,5 and 1 °C: power and ventilator 1 on 3
  - < 0,5 °C: both on 1
  - ventilator 2 is on the side if you use a pipe to another room. Which I don't so it's always off.

<img width="615" height="832" alt="Pelletstove_card" src="https://github.com/user-attachments/assets/bde2b6dd-e948-4d25-8522-2b6770767c61" />

You can still use the original remote. The card updates the settings when changed through the remote but please be advised that the AUTO mode on this package is different from the AUTO mode from the original remote. I have no idea which AUTO settings the pelletstove would use... **I would advise to only use the existing remote with this software if you use the MANUAL setting**.

## Hardware
I use a Lilygo T3 v1.6.1 with a SX1278 and screen integrated. I suppose it would work on the more modern T3-S3 but they were sold out and had only the T3 in stock.
I 3d printed a minimalistic case from [Thingiverse](https://www.thingiverse.com/thing:6096729). In the remix tab you find the case for the T3-S3 version.

## Software
Home Assistant with ESPHome addon (I'm on 2026.10.0). I'm from Belgium so it's in Dutch but it should be trivial to translate it.

## Installation
1. create in ESPHome a new device and use pelletkachel.example.yaml to build the firmware. Use your own secrets for the wifi, etc. ;-)
2. place mcz-bediening.yaml in /homeassistant/esphome/packages/
3. Leave mcz_remote_id: "0x000000"` for now. Validate and install through USB. Use wifi for later updates.
4. Find your own remote ID:
   1. With an ID of `0x000000`, the ESP is in **listening mode**. Transmission is blocked in this state.
   2. Open the ESPHome logs and place the remote control near the LilyGO device.
   3. Change a fan setting and confirm by pressing **Enter**.
   4. Look for a line containing `[mcz_discovery]`, `CRC OK`, and, for example, `ID=123456`.
   5. Repeat this a few times using your remote control to confirm the ID.
   6. Enter those six hex characters into the firmware ESPHome file, prefixed with `0x`
   7. Reinstall the firmware. Now, only packets with this ID will be processed as valid commands, and the card will be able to transmit.
5. Put pelletkachel-card.js in /homeassistant/www/ (if www didn't exist, restart HA)
6. add the following in HA in settings --> dashboard --> three dots in the top right corner --> sources and add "/local/pelletkachel-card.js?v=1.2.1" as a js source.
7. Optional: check in developer tools --> statuses if all entities exist.
