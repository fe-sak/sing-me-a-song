
# Sing me a song

<img src="https://s8.gifyu.com/images/Peek-2022-05-09-12-51.gif" alt='' />

## About this project

This is a web page where you can recommend youtube links!

## Why?

The front and back end were forked, so the main goal of this project is to practice testing with cypress and jest


## Functionalities

- Recommend a new song (only youtube links are accepted)
- Top page (order by score in descending order)
- Random page (get a random recommendation)
- Upvote
- Downvote
- Recommendations are deleted if the score reaches -6

## Technologies used

- e2e tests: ![Cypress](https://img.shields.io/badge/-Cypress-05122A?style=flat&logo=cypress)&nbsp;
- Integration and unit tests: ![Jest](https://img.shields.io/badge/-Jest-05122A?style=flat&logo=jest)&nbsp;

## Pre-requisites
These dependencies must be installed in your machine.
- [nodejs](https://nodejs.org/en/download/)
- [postgresql](https://www.postgresql.org/download/)

## How to install this app

  **Cloning the Repository**
Note that this repository contains front-end and back-end folders. 

```
$ git clone git@github.com:fe-sak/sing-me-a-song.git
$ cd sing-me-a-song
```

**Installing dependencies**

The install command must be executed for both front-end and back-end folders. Enter a folder using the cd bash command:
```
$ cd front-end/
```

_or_

```
$ cd back-end/
```

Then, run the command inside the folder: 
```
$ yarn
```

_or_

```
$ npm install
```

## Configure environment
### Front-end:

Create a .env file inside the front-end folder root with the contents:
```
REACT_APP_API_BASE_URL=http://localhost:5000
```
This is a connection string, used by your front-end project so it can connect with your back-end. Note at the end the number 5000. This number is 
the port chosen by the back-end to receive http requests. If you change your back-end port, you must also change it here in the REACT_APP_API_BASE_URL 
environment variable. (You may change it in back-end/src/server.ts)

### Back-end:

Create a .env file inside the back-end folder root with the contents: 

```
DATABASE_URL=postgres://POSTGRES_USER:POSTGRES_PASSWORD@localhost:POSTGRES_PORT/DATABASE_NAME
```
This is the connection string for your back-end to connect with your postgresql service inside your machine. You must first install postgresql and 
create a user. Usually, POSTGRES_USER is "postgres" and POSTGRES_PASSWORD is "123456" if you created the user exactly as  the postgresql doc suggests.
The same applies to the POSTGRES_PORT, which is usually 5432.
The database_name, though,  must be chosen by you.

You must also create a .env.test file for your test variable.

```
DATABASE_URL=postgres://POSTGRES_USER:POSTGRES_PASSWORD@localhost:POSTGRES_PORT/DATABASE_NAME_test
```
This DATABASE_URL is used the test environment, which is run by jest.
Notice the "test" at the end of the DATABASE_NAME. This is only a suggestion, you can choose any name for your database, as long as it is
different from the one at .env


## How to run this app

With all dependencies installed and the environment properly configured, you can now run the app in development mode:

```
$ cd front-end/
$ npm run start
```

And the back-end:

```
$ cd back-end/
$ npm run dev
```

Note that you must run both front-end and back-end at the same time.

## Testing

### e2e Tests
The e2e tests are run by cypress in the front-end folder. Both front-end and back-end apps must be running.
Run the front-end with:

```
npm run start
```
This is the standard react-script.

Now, for the back-end, run it with:
```
npm run dev:test
```
This script changes the .env to .env.test, so the database used is the DATABASE_NAME_test.

Then, open cypress with:

```
$ npx cypress open
```

Run each spec. If the test body gets a green checkmark, it is done and valid. (Don't mind the random http requests created by the react-player lib)


### Integration tests and unit tests
Both are run by jest in the back-end folder. This step doesn't require front-end and back-end to be executing in dev test mode. Only the next
command is needed:
```
npm run test
```
Notice a new folder "coverage" was created. Inside. there's a index.html file. Open it in your browser to view the test coverage.
