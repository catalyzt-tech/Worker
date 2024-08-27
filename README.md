# Worker

Worker dynamically imports and executes TypeScript files from the `src/scripts` directory with CRON Job set up and serve them as Static API or JSON Objects.

## Project Structure

- `src/scripts`: add folder of the module and add the TypeScript file here the example is `example.ts`
    - It should export a `Run` function that will be executed by the worker
    - It should export a `DATA_DIR` variable that will be used to save the data
    - It should export a `MODULE_NAME` variable that will be used to set the module name
    - It should export a `CRON_TIMER` variable that will be used to set the cronjob timer
        - CRON_TIMER is the cronjob timer for the module, it can be undefined if the module is not a cronjob
        - Visit https://github.com/node-cron/node-cron to learn the format of cronjob

## Api Route
- Get /api/ will list all the static file that can be served
- Get /api/(any-file-name) will serve the file
- Get /api/(any-folder-name) will list all the file in the folder
- Get /api/(any-folder-name)/(any-file-name) will serve the file
- Get /api/modules will list all the modules that can we run
- Post /api/modules/run/(any-module-name) will run the module 
    - it required post body with a password


## Development / Deployment 
- Developmenet
    - if you were on the development mode must change the value of `NODE_ENV` to `dev` and use cli command to run on local
    ```
        pnpm dev:Serve
    ```

- Deployment
    - Must change the value of `NODE_ENV` to `production` and use cli command to run on production
    ```
    	pnpm run build
	    node dist/src/index.js
    ```

