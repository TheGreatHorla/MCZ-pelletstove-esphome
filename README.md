# MCZ-pelletstove-esphome
Get your old MCZ pelletstove in Home Assistant with ESPHome

**Disclaimer**: The code for this project is fully developed with AI (ChatGPT).

I have a lot of things in Home Assistant but my pelletstove is to old (around 13 years) to have wifi. The remote has fallen multiple times from the couch and half the screen is not readable. This project was to get the stove in Home Assistant and operate it from there so I can use some extra features (for example to start it when I leave from work so it's hot in the living room when I arrive). It works with my MCZ Ego AIR 2.0 which uses a remote on the 434.5Mhz band.

It has a card which can use an external temperature sensor (I have a cheap [Xiaomi](LYWSD03MMC)) to use as a thermostat (the auto setting):
  - greater than 2 °C difference: power and ventilator 1 on full
  - between 0,5 and 1 °C: power and ventilator 1 on 3
  - < 0,5 °C: both on 1
  - ventilator 2 is on the side if you use a pipe to another room. Which I don't so it's always off.

<img width="615" height="832" alt="Pelletstove_card" src="https://github.com/user-attachments/assets/bde2b6dd-e948-4d25-8522-2b6770767c61" />

## Hardware
I use a Lilygo T3 v1.6.1 with a SX1278 and screen integrated. I suppose it would work on the more modern T3-S3 but they were sold out and had only the T3 in stock.
I 3d printed a minimalistic case from [Thingiverse](https://www.thingiverse.com/thing:6096729). In the remix tab you find the case for the T3-S3 version.

## Software
Home Assistant with ESPHome addon. I'm from Belgium so it's in Dutch but it should be trivial to translate it.

## Installation
1. place mcz-bediening.yaml in /homeassistant/esphome/packages/
2. create in ESPHome a new device and use pelletkachel.yaml to build the firmware
3. I'm guessing every remote is the same but you can use your old remote to check if every button has the same settings with the live logging in ESPHome.
4. Put pelletkachel-card.js in /homeassistant/www/
5. add the following in HA in settings --> dashboard --> three dots in the top right corner --> sources and add "/local/pelletkachel-card.js?v=1.2.0" as a js source.
6. add the card to a dashboard (kaart.yaml)
