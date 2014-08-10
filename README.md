PositionSticky
=======================
[![Code Climate](https://codeclimate.com/github/katranci/PositionSticky.png)](https://codeclimate.com/github/katranci/PositionSticky)
[![Build Status](https://travis-ci.org/katranci/PositionSticky.svg?branch=master)](https://travis-ci.org/katranci/PositionSticky) 

Usage
-----

```
 -------------------------- => window 
|   --------------------   |
|  |              ---   |==|=> container
|  |             |   |  |  |
|  |             |   |==|==|=> sticky  
|  |              ---   |  |
|  |                    |  |
|  |                    |  |
|  |                    |  |
|  |                    |  |
|   --------------------   |
|   --------------------   |
|  |                    |  |
|  |                    |  |

```

PositionSticky follows [UMD pattern](https://github.com/umdjs/umd).

###Consume as a CommonJS module
```javascript
var PositionSticky = require('./bower_components/PositionSticky/dist/PositionSticky.js');
var element = document.getElementById('sticky');
var sticky  = PositionSticky.create(element);  
```

###Consume as an AMD module
```javascript
require(['./bower_components/PositionSticky/dist/PositionSticky.js'], function(PositionSticky) {
  var element = document.getElementById('sticky');
  var sticky  = PositionSticky.create(element);
});  
```

###Consume as a global variable
```javascript
var element = document.getElementById('sticky');
var sticky  = PositionSticky.create(element);  
```

Examples
--------
* [Simple usage](http://katranci.github.io/PositionSticky/demos/display--block.html)
* [Left floating elements](http://katranci.github.io/PositionSticky/demos/float--left.html)
* [Right floating elements](http://katranci.github.io/PositionSticky/demos/float--right.html)
* [Multiple floating elements](http://katranci.github.io/PositionSticky/demos/multiple-floats.html)
* [Refresh functionality](http://katranci.github.io/PositionSticky/demos/refresh.html)
* [A sidebar example](http://katranci.github.io/PositionSticky/demos/sidebar.html)

Browser Support
---------------
* Chrome
* Firefox
* Safari
* IE9+
