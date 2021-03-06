# Survey App

This application is a simple survey build in NodeJS with Express and Sequelize

## Setup & Installation

The first step is to check out the code from Github.

	# ssh
	git clone git@github.com:bubbafoley/survey.git

	# https
	git clone https://github.com/bubbafoley/survey.git

Now it's time to set up the database. Create a new MySQL database called `survey` and import the [db.sql](./db.sql) file from the repository. This creates the database schema and also adds some sample data that can be viewed from the admin section.

You also need to update [config/database.json](./config/database.json) with your database credentials.

	{
		"username": "root",
		"password": "root",
		"database": "survey",
		"host": "127.0.0.1",
		"dialect": "mysql"
	}

Next install all of Node dependencies with npm and start the web server.

	npm install
	npm start

Now the app will be accessible from a web browser at [http://localhost:3000/]()

## Survey Questions

The app presents a user with a random survey question. Each time the page is reloaded a different question is shown. If a user has answered a question it is not shown again. When the questions are exhausted a message is displayed explaining that there are no more questions. 

![Survey demo](./public/images/survey.png)

When a new user visits the app they are given a unique identifier that is stored in the database and tracked in the browser with a cookie.

## Admin Section

The admin section is available at [http://localhost:3000/admin](). To log in with the default administrator account you can use the following credentials:

**Username**: administrator
**Password**: admin123

Passwords are hashed using the [bcrypt](https://www.npmjs.com/package/bcrypt) library using a 10 round hash.

The dashboard shows the 5 most recent questions and guests. Using the top navigation you can access both the question list and the guest list.

![Admin dashboard](./public/images/dashboard.png)

The questions page shows a list of all questions with options to add new questions, edit existing questions and view the survey results of a question.

![Questions page](./public/images/questions.png)

The survey results page shows all of the response options and the number of times they were selected by a guest.

![Survey results](./public/images/results.png)

The edit question screen allows you to edit the question and edit the responses. You can alter the text of the questions, add/remove response options and delete the question.

![Edit question](./public/images/edit.png)

The guests screen shows a list of unique ids of all the guests that have visited the app. 

![Guests screen](./public/images/guests.png)

When viewing guest information you can see their survey responses in addition to their IP address and browser user agent data.

![View guest screen](./public/images/guest.png)

The users screen shows a list of all administrators and allows for the creation of new admins. The ability to remove the default admin account has been disabled to prevent getting locked out of the system. When adding a new user the app checks against the current user database to keep usernames unique. This constraint is also enforced on the backend through a unique index in the MySQL database table.

![Add user screen](./public/images/adduser.png)

## Mobile Responsive

The app uses Bootstrap's responsive utilities so there is a seamless experience between desktop and mobile.

![Mobile survey](./public/images/mobile.png) ![Mobile edit screen](./public/images/admin-mobile.png)
