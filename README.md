# Medical Record Entry System

An electronic health record system that lets healthcare providers add patients and consultation entries.

## Dependencies

Requires: node.js [Install](https://nodejs.org)

This project uses `yarn` as it's package manager.

```bash
npm -g i yarn
```

### Install

```bash
yarn
```

## Backend

- node/express in TS

### Endpoints

- `/api/ping` - responds with `pong` and status `200 OK`
- `/api/diagnoses` - list of diagnosis codes used to treat patients
- `/api/patients` - patient data
- `/api/patients/:id/entries` - list of entries by the healthcare provider recording the patients
  consultation including description, type of visit (hospital/check up/occupational healthcare), diagnosis, specialist, etc

All data is server side validated for type and max lengths.

### Dev build

Run the backend

```bash
yarn dev2
```

Server listens on port 3001 by default or can be configured via PORT env var.

### Prod build

Compile TS

```bash
yarn tsc
```

which will output the generated JS into `dist/`.

```bash
yarn start
```

## Frontend

- React in TS
- Semantic UI
- Formik forms (validation with Yup)

### Development

Stock standard Create React App with TS template

For dev builds, the app uses a [proxy to handle API requests](https://create-react-app.dev/docs/proxying-api-requests-in-development).
Update the proxy field in `package.json` to where ever the server is running, which will typically be `localhost:3001`.
For testing on mobile, you can update it to a local ip instead. You need to restart the CRA dev server for the changes to take effect.

```bash
yarn start
```

### Production

```bash
yarn build
```
