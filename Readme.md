# To run this server locally

## Prerequisites

1. Plz install mongodb on your pc;
2. Find the path of mongo file inside the bin folder
3. copy that path and run in cmd
4. In your PC create folder and name it mongodb move into it and create folder data (if haven't already done so) this will store all databases of your mongodb
   then cd to mongodb and run following : mongod --dbpath=data --bind_ip 127.0.0.1  
   this will start mongo server to serve up data from and into data folder.

## Setting up env

Make `.env` folder in root directory and enter the following values

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

# To Create Spaces
postman URL: http://localhost:3001/spaces/me/image
Under body-> select form-data
There you will be asked to fill key value pairs:
Key                        Value
-> image                      Attach image file by selecting the file type option

->name                       {Space Name}
->stringId                    {stringId}

# To get Images of Spaces
location = http://localhost:3001/spaces/{spaceId}/image
now use
`<img src={location} />`