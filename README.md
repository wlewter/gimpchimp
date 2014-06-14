gimpChimp
=========

The gimpChimp is a tool used by Dark Age of Camelot players to display all their characters in one
 place. It's written entirely in javaScript using Nodejs for the backend and Angularjs for the front. 
 It uses mongodb to store the character information. 
 

###Requirements to run local
1. [mongodb](http://www.mongodb.org) - written with v2.4.9
    * follow install directions for your platform
    * the dev environment is configured to connect to mongo using the default settings.
        * host: localhost
        * port: 27017
    * this is configurable in the lib/config/env/development.js file
2. git client
3. [nodejs](http://nodejs.org) - written with v0.10.26
    * follow install directions for your platform
4. [npm](https://www.npmjs.org) - written with v1.4.3
    * gets installed with nodejs
5. [grunt](http://gruntjs.com)- written with v0.1.13
    * npm install -g grunt-cli 
6. [bower](http://bower.io) -written with v1.3.5
    * npm install -g bower
7. HTML5 enabled browser
    * newest versions of Chrome, Firefox, Safari, Opera, IE should work. IE has lots of little
    differences to watch out for.

###Installation:

    git clone https://github.com/wlewter/gimpchimp.git
    cd gimpchimp
    npm install
    bower install

This will create the site with default bootstrap styling. I use the bootstrap cyborg theme. To
implement this, you need to download the theme from here:
[http://bootswatch.com/cyborg/](http://bootswatch.com/cyborg/)

Overwrite the bootstrap.min.css and bootstrap.css files in your app/bower_components/bootstrap/dist/css
folder with the cyborg versions.


###Running local:
**make sure mongo is started**

inside your gimpchimp folder:

    grunt serve

This will start up a local instance of node and should start up your default browser. If it doesn't
then the site can be accessed at [http://localhost:9000](http://localhost:9000)

In order for the email functionality to work, ie the contact form and password retrieval, you will
need to set up a gmail account and configure the username and password for it. This information is
located in lib/config/env/development.js. Simply replace the placeholder username and password with
real account information:

```javascript
  gmail: {
    username: 'someemail@somewhere.com',
    password: '11111111'
  }
```


###Building for dist
inside your gimpchimp folder

    grunt build
    
This will create a fresh dist folder, ready to be moved to the server.


