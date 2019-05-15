# seek

## Requiriments
You need has Docker Installed in your operational system.  
Create a folder called mysql in root folder of project.

## OBS. About API
Maybe your browser blocked self-signed certificates.  
If this occurs you must add an exception for API to  
work with HTTPS, access the URL of API with HTTPS to  
work or change the SPA to use HTTP.

## Project Docker setup

In root folder use `$ docker-compose up -d`.  
Wait 4 or 5 minutes (for npm install process) and access URL localhost:8080

## Project setup commands for docker-compose.yml
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
