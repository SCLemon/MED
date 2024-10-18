
# MED Reminder
![Banner](./banner.png)

This is a daily application app created by integrating AI technology, which includes most commonly used tools to assist you in effectively managing daily life and enhancing functional convenience.

## Announcement
If the website is in HTTP environment, something might break down like Navigator API, Downloader API. <br>
But you can clone this repository and run it locally, it would proceed successfully. <br>

By the way, The Demo Website would sometimes break down as a result of the Bad Virtual Machine which is Free.
so, do not Misunderstand this Web Application QQ.


## Programming languages
- Vue CLI
```
npm install -g @vue/cli
```
- NodeJS
```
https://nodejs.org/en/download
```
- MongoDB
```
https://www.mongodb.com/download-center/community/releases
```



## API Keys

To run this project, you will need to add the following environment variables to your apiKey file

OpenAI API `API_KEY`  
```
https://platform.openai.com/
```

Fugle API `API_KEY`
```
https://newsapi.org/s/taiwan-news-api
```

Google Cloud API `API_KEY`
```
https://cloud.google.com/apis?hl=zh-TW
```

News API `API_KEY`
```
https://developer.fugle.tw/
```

Weather API `API_KEY`
```
https://www.visualcrossing.com/weather-api
```
## AppScript Setup
The code has been placed in the following folder
```
server/appscript/appscript.js
```
You only need to create an appscript at Google Platform, and get an url, and put it in the following file.
```
server/appscript/send.js
```


## Proxy Config
```
 proxy: {
      '/chat': {
        target: 'http://127.0.0.1:3007',
      },
      '/verify': {
        target: 'http://127.0.0.1:3007',
      },
      '/userInfo': {
        target: 'http://127.0.0.1:3007',
      },
      '/reminder': {
        target: 'http://127.0.0.1:3007',
      },
      '/filter': {
        target: 'http://127.0.0.1:3007',
      },
      '/aiSetting': {
        target: 'http://127.0.0.1:3007',
      },
      '/schedule': {
        target: 'http://127.0.0.1:3007',
      },
      '/imageHistory':{
        target: 'http://127.0.0.1:3007',
      },
      '/stock':{
        target: 'http://127.0.0.1:3007',
      },
      '/api':{
        target: 'http://127.0.0.1:3007',
      }
    }
```


## Run Locally

Clone the project

```bash
  git clone https://github.com/SCLemon/MED.git
```

Go to the frontend project directory

```bash
  cd med
```

Start the Frontend Pages

```bash
  npm i
  npm run serve
```

Go to the backend project directory

```bash
  cd ../server
```

Start the Backend Server

```bash
  npm i
  npm run http_server
```

## Authors

- [@SCLemon](https://github.com/SCLemon)  (2024/04/01 ~ Current)


## Support

For support, email blc0000421@gmail.com
