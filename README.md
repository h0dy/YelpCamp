# YelpCamp

This is a project I built coding along as part of the Udemy course, [The Web Developer Bootcamp 2024](https://www.udemy.com/user/coltsteele/) by Colt Steele.

This project focuses on back-end development, so there is no ReactJS and no complex UI; it relies on **EJS** and **Bootstrap** for the front end.

I learned full CRUD operations as well as authentication and authorization, working with users, reviews, and campgrounds. Additionally, I learned:

- How to maintain user login sessions with cookies and sessions.
- How to handle validations and error handling using **Express**.
- Using tools like **Passport.js** for authentication, **Mapbox API** for map integration, **multer** with **Cloudinary** for image uploads, and much more!

You can [preview](https://yelpcamp-yjdw.onrender.com/) the project on Render.

## To Run This Project On Your Local Machine

### 1. Clone the repository

```bash
git clone https://github.com/h0dy/YelpCamp.git
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables on .env

CLOUDINARY_CLOUD_NAME=yourCloudinaryName
CLOUDINARY_KEY=yourCloudinaryKey
CLOUDINARY_SECRET=yourCloudinarySecret
MAP_TOKEN=yourMapToken

### 4. Run the application

for a better experience, use [nodemon](https://www.npmjs.com/package/nodemon) library to run the project

```bash
nodemon app
```
