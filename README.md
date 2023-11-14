## Tailwind CSS
This project utilizes Tailwind CSS for styling. Before running the project you must first run the following in the `frontend` directory:

```bash
npx tailwindcss -i ./src/styles/index.css -o ../../dist/output.css --watch
```

If not found, npm install first:
```bash
npm install tailwindcss
```

## Running the Project
To run the project in development mode, run the following:

```bash
npm run dev
```
This command will start the development server, and you can access the project at `http://localhost:8081` in your web browser (or whatever endpoint is defined in vite.config.ts).
