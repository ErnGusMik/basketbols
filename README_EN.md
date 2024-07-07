# Gandrīz NBA (Nearly NBA)

A platform for creating and managing basketball tournaments.

!ATTENTION! The server may be very slow to send responses (~30sec), because I am using hosting it on a free server (which means it shuts off after a while of inactivity).

### Progress

| Job                         | Status                 |
| --------------------------- | ---------------------- |
| Server, database            | 🧪 Testing             |
| 'New tournament' page, auth | ✔️ Finished            |
| Games, tournament pages     | ✔️ Finished            |
| After-game analysis         | ✔️ Finished            |
| 'Public' functions          | 🟢 In process          |
| Testing, finalizing         | 🟡 Not begun           |

Possible statuses:

- 🟡 Not begun
- 🟢 In process
- ⚠️ Problem solving
- ⏰ Late
- 🕔 Waiting for testing
- 🧪 Testing
- ✔️ Finished
- ❌ Finished/errors

The program specification can be found <a href="https://docs.google.com/document/d/16QZTRbVObPyVj2u85zrhH_flcDA147wP-Pd8uMu7Uj8/edit#heading=h.y6c23nxmcb8a">here</a>. (In Latvian)

## Running locally

Before first launch (to install all necessary dependencies):

```bash
> npm install
```

To launch React:

```bash
> cd gandriz-nba
> npm start
```

To launch the server locally (**in a new window**):

```bash
> cd gandriz-nba/server
> node server.js
```

To launch locally, you need to:

- install Node;
- install npm (bundled with node.js usually)

#### Important!

In order for the application to run properly, you need to create a `.env` file in the `gandriz-nba/server` folder. The file must include:

```env
# The port on which the server should run (React set to port 3000, all calls to server are to port 8080)
SERVER_PORT=8080

# Database configuration (username, db host, database name, password, port)
DB_USER=
DB_HOST=
DB_NAME=
DB_PASSWORD=
DB_PORT=

# Random, long string of characters (at least 64)
JWT_SECRET_KEY=

# Server email and password
EMAIL=
EMAIL_PASSWORD=
```
