
# Accredian Backend Task

This is the backend for the Accredian-Frontend-Task. This project is done as a task for Accredian Internship Program. 


## Tech Stack

**Client:** React, Material UI, Yup

**Server:** Node, Express, MySQL

**Note:** MySQL Server is hosted on [db4free](https://db4free.net/).
This is done to deploy the backend server on vercel without any hassle. 
 


## Run Locally

Clone the project

```bash
  git clone https://github.com/SanjayNithin2002/Accredian-backend-task
```

Go to the project directory

```bash
  cd Accredian-backend-task
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm start
```


## Deployment

The project is deployed on vercel:

https://accredian-backend-task-gray.vercel.app/



## Features

- MVC Architechture is followed.
- Edge cases such as User Already Exists, User Doesn't exist, Invalid Authentication are covered.
- Password is hashed using Bcrypt packaged. 
- Nodemailer is used to send OTP in email. 
- MySQL Pooling is done to improve the speed. 


