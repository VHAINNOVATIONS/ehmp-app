#Introduction

This document outlines the necessary steps to install and configure the ehmp-app on a Windows workstation that has been preconfigured according to the Application Development Kit (ADK) Windows Workstation guide. The process involves installing and configuring an Apache Web Server.

#Running the ehmp-app
Prerequisites: 

Follow the Application Development Kit (ADK) Windows Workstation guide to install these Commercial-Off-the-Shelf (COTS) 
applications:

- Java SE Development Kit 8u66
- Git
- Node.js
- Grunt
- Bower
- Ruby
- Sass
- Compass
- Gradle

#Setting up Apache

Create a directory for installation of the code. This example uses "C:\ehmp" throughout the instructions. Create a "C:\ehmp\home" folder. Copy the contents of your ehmp-app folder into the "c:\ehmp\home" folder. 

##APACHE Server Configuration in Windows

Perform the following procedure to configure an Apache server on your localhost to run the ADK client:
Administrator rights will most likely be required for several of these steps.

- Download and install Apache 2.2.25 with ssl from:
 [https://archive.apache.org/dist/httpd/binaries/win32/](https://archive.apache.org/dist/httpd/binaries/win32/)
- Ensure Network Domain and Server is "localhost". Administrator's Email Address can be set to any value. After clicking **next** , select the "typical" installation type.
- After installation, open the permissions on the Apache install directory tree.
- Add "C:\Program Files (x86)\Apache Software Foundation\Apache2.2\bin" to path environment variable.
- Open a terminal and run the following commands:
 - cd "C:\Program Files (x86)\Apache Software Foundation\Apache2.2\conf"
 - set OPENSSL\_CONF="C:\Program Files (x86)\Apache Software Foundation\Apache2.2\conf\openssl.conf"
 - openssl req -new -x509 -days 365 -sha1 -newkey rsa:2048 -nodes -keyout server.key -out server.crt -config "C:\Program Files (x86)\Apache Software Foundation\Apache2.2\conf\openssl.cnf"
- Copy the httpd.conf file from the ehmp-app\conf folder to the "C:\Program Files (x86)\Apache Software Foundation\Apache2.2\conf\" folder. This overwrites the existing httpd.conf file.
- Restart Apache.

##Running the eHMP Application in Windows
At this point, you should be able to test and develop applets locally.

Navigate to [https://localhost](https://localhost) to display the eHMP login screen.

NOTE: If using Chrome, [https://localhost](https://localhost) should work. If using Firefox, [https://127.0.0.1](https://127.0.0.1) may be needed.

To login: Site is KODAK
Username: mx1234
Password: mx1234!!

Upon successful login, the My Workspace tab displays.

To continue, search and select a patient. A good patient to begin with for testing is 'eight, patient'.

Confirm the patient selection on the right hand side of the screen and also confirm any notices that may appear.

Upon successful patient selection, you should see the overview workspace.
