eHMP
========

This repository contains the eHMP ADK (Application Development Kit) and Applets. See documentation/index.html for further information on the ADK.


Anatomy
========
An **applet** is a single unit of visual functionality. Examples of applets include a list of allergies, an ability to enter a new allergy, ability to place a new order.
A **layout** is an abstract arrangement of applets. A screen typically chooses from a set of ADK predefined layout.
A **screen** is a defined collection of applets.
An **application** is a collection of screens.


Directory Structure
=========

| Directory         | Description                                 |
| ----------------- |---------------------------------------------|
| _assets/          | images, compiled CSS, plugins and libraries |
| api/              | ADK Services                                |
| app/              | applets and screens                         |
| bower_components/ | 3rd party libraries                         |
| bower.json        | Bower configuration                         |
| config.js         | Grunt configuration                         |
| documentation/    | ADK documentation                           |
| main/             | ADK components and utilities                |


License
=========

The libraries included in this repo are licensed for redistribution. The included Highcharts libraries are not free, but are redistributed under the terms of Highsoft's [non-commercial license](http://shop.highsoft.com/faq/non-commercial#non-commercial-redistribution).
