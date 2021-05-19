<h1 align="center">Welcome to Poogle_backend 👋</h1>
<br/>

### ✨ [Visit Deployed Website](https://poogle-app.herokuapp.com)
### ✨ [View Demo](https://drive.google.com/file/d/1a35oIEb7L0Pq_DATVujc0-VSQjn3Of_y/view?usp=sharing)

# To run this server locally

## Prerequisites

1. Please install mongodb on your pc;
2. In your PC create folder and name it mongodb move into it and create folder data (if haven't already done so) this will store all databases of your mongodb.
3. Then cd to mongodb. 
4. Run following command in the terminal. <code>mongod --dbpath=data --bind_ip 127.0.0.1</code>  
5. This will start mongo server to serve up data from and into data folder.

## Setting up env

Make `.env` folder in root directory of this project and enter the following values

```
MONGO_USER=<your_user>
MONGO_PASSWORD=<your_password>
MONGO_DB=poogle
```

## Running app

Run following command to open server in nodemon.

```
npm run dev
```

Now run following commands:

1. npm i
2. npm start
3. after npm start in cmd type mongo
   to open mongo REPL shell
   and use command >>

show dbs

this will show u a db as poogle-api this will be database for our project ..

# Link for frontend repo:
Frontend: <br />
https://github.com/bhaveshkumarpassi/Poogle <br />



 <br />
  
## Show your support<br/>
Give a ⭐️ if you liked the project!<br/>
