PositionSticky
=======================
[![Code Climate](https://codeclimate.com/github/katranci/PositionSticky.png)](https://codeclimate.com/github/katranci/PositionSticky)
[ ![Codeship Status for katranci/PositionSticky](https://www.codeship.io/projects/c19ac050-f3c3-0131-848b-6e4212d405f8/status)](https://www.codeship.io/projects/27957) 

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

```javascript
var element = document.getElementById('sticky');
var sticky  = PositionSticky.create(element);  
```

Examples
--------
* [Simple usage](http://katranci.github.io/PositionSticky/demos/demo1.html)
* [Support for display and float properties](http://katranci.github.io/PositionSticky/demos/demo2.html)
* [Refresh functionality](http://katranci.github.io/PositionSticky/demos/refresh.html)
* [A sidebar example](http://katranci.github.io/PositionSticky/demos/sidebar.html)


Browser Support
---------------
* Chrome
* Firefox
* Safari
* IE9+
