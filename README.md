# ViMo
ViMo is an online retail store for vintage movie rentals. 
![home page of the ViMo webiste](./homepage.png)
## Run it locally
1. Create a cloudinary account to get an API key and secret code
2. Create an sql database with the ``` movieapp.sql ``` file
3. Download this repository and navigate into the folder
4. Install all dependencies by running
```npm  install``` 
1. Then, start the app by running 
```npm start```.
1. Create a .env file and add the following
```
PORT=3030
DB_HOST=<host>
DB_USER=<user>
DB_PASSWORD=<password>
DB_DATABASE=<database name>
CLOUDINARY_CLOUD_NAME=<cloud name>
CLOUDINARY_KEY=<key>
CLOUDINARY_SECRET=<secret>
```
7. Finally, go to localhost:3030.

## Functionality
* To access the admin panel, use the email ```admin@gmail.com``` and password ```admin``` 
* Users can add items to the cart without having to be registered. Once the register, the cart will carry over into their account.

## The website is live here!
check out the webiste https://vimo.onrender.com/<br />
Note that the webiste is hosted on a free instance so with inactivity, the site will be down, which can delay requests by 1 minute or more.<br />
If you can access the site rightaway, please try again in about 1 minute. 
