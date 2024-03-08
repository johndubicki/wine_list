# wine_list
A simple CRUD app built with [Flask](https://flask.palletsprojects.com/en/3.0.x/).  Created by a self-taught human, so there's almost certainly plenty of things that are not best practice, especially in the JavaScript.

## Overview
Not quite single-page, but small enough to not really benefit from Blueprints.  The tiny bit of front-end pizazz is accomplished with [jQuery](https://jquery.com/).  The lion's share of styling is done using [Bootstrap 5.3.3](https://getbootstrap.com/).  Most of the communication between front- and back-end is done with JavaScript [fetch()](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch).

## Installation
 1. Clone the repository.
 ```
 git clone https://github.com/johndubicki/wine_list.git
 ```
 2. Navigate to the project directory.
 ```
 cd wine_list
 ```
 3. Create a virtual environment.
 ```
 python3 -m venv venv
 ```
 4. Activate it.
 ```
 source venv/bin/activate
 ```
 5. Install dependancies.
 ```
pip install -r requirements.txt
 ```
 6. Create the database.
 ```
 python3 db_setup.py
 ```
 7. Start the app.
 ```
 python3 wsgi.py
 ```