# Worker

Worker dynamically imports and executes TypeScript files from the `src/scripts` directory with CRON Job set up and serve them as Static API or JSON Objects.

## Project Structure

- `src/scripts`: add folder of the module and add the TypeScript file here the example is `example.ts`
    - It should export a `Run` function that will be executed by the worker
    - It should export a `DATA_DIR` variable that will be used to save the data
    - It should export a `cronTimer` variable that will be used to set the cron job timer
    - It should export a `MODULE_NAME` variable that will be used to set the module name

## Api Route
- Get /api/ will list all the static file that can be served
- Get /api/(any-file-name) will serve the file
- Get /api/(any-folder-name) will list all the file in the folder
- Get /api/(any-folder-name)/(any-file-name) will serve the file
- Get /api/modules will list all the modules that can we run
- Post /api/modules/run/(any-module-name) will run the module 
    - it required post body with a password

