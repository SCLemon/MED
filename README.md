
# MED Reminder


This is a daily application app created by integrating AI technology, which includes most commonly used tools to assist you in effectively managing daily life and enhancing functional convenience.


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



## Run Locally

Clone the project

```bash
  git clone https://github.com/SCLemon/MED.git
```

Go to the project directory

```bash
  cd med
```

Install dependencies (Frontend and Backend Simultaneously)

```bash
  npm run fullInstall
```
Start the server (Frontend and Backend Simultaneously)

```bash
  npm run fullStart
```


## Authors

- [@SCLemon](https://github.com/SCLemon)  (2024/04/01 ~ Current)


## Support

For support, email blc0000421@gmail.com
