# Gandrīz NBA

English version of this README can be found [here](README_EN.md).

Basketbola turnīru veidošanas un pārvaldīšanas platforma un punktu skaitītājs.

### Darba plānojums

| Darbs                     | Statuss                |
| ------------------------- | ---------------------- |
| Serveris, Datubāze        | 🧪 Testēšana           |
| Jauna turnīra lapa, login | ✔️ Pabeigts            |
| Spēles, turnīra lapa      | ✔️ Pabeigts            |
| Pēcspēles analīze         | ✔️ Pabeigts            |
| Publiskās funkcijas       | 🟢 Procesā             |
| Testēšana, pabeigšana     | 🟡 Nav uzsākts         |

Iespējamie statusi:

- 🟡 Nav uzsākts
- 🟢 Procesā
- ⚠️ Problēmu risināšana
- ⏰ Kavējās
- 🕔 Gaida testēšanu
- 🧪 Testēšana
- ✔️ Pabeigts
- ❌ Nepabeigts

Programmas specifikācija atrodama <a href="https://docs.google.com/document/d/16QZTRbVObPyVj2u85zrhH_flcDA147wP-Pd8uMu7Uj8/edit#heading=h.y6c23nxmcb8a">šeit</a>

## Lokālā palaišana

Pirms pirmās palaišanas (lai instalētu vajdzīgās pakotnes):

```bash
> npm install
```

Lai palaistu React:

```bash
> cd gandriz-nba
> npm start
```

Lai palaistu serveri lokāli (**jaunā logā**):

```bash
> cd gandriz-nba/server
> node server.js
```

Lai palaistu lokāli, vajag:

- instalēt Node;
- instalēt npm (parasti nāk ar node.js)

#### Svarīgi!

Lai aplikācija funkcionētu vajag uztaisīt `.env` failu `gandriz-nba/server` mapē. Failam vajag iekļaut:

```env
# Ports uz kura darbosies serveris (React iestatīts uz 3000, visi izsaukumi uz serveri ir uz 8080 portu)
SERVER_PORT=8080

# Datubāzes konfigurācija (lietotājvārds, datubāzes resursdatora url, datubāzes nosaukums, lietotāja parole, datubāzes ports)
DB_USER=
DB_HOST=
DB_NAME=
DB_PASSWORD=
DB_PORT=

# Nejauša, gara rakstzīmju virkne (vismaz 64 rakstzīmes)
JWT_SECRET_KEY=

# Servera epasts un parole
EMAIL=
EMAIL_PASSWORD=
```
