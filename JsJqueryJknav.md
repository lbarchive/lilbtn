_**This project has been moved to [GitHub](https://github.com/livibetter/jquery-jknav).**_

# Metadata #

  * Btn: `js-jquery-jknav`
  * First Release: 2010-05-24
  * Code Last Updated: 2011-05-24 (Version 0.5.0.1)
  * Doc Last Updated: 2011-05-24
  * Status: Experimental

# Description #

js-jquery-jknav is a jQuery plugin, provides an easy way to enable jk binding navgation on a page.

# Demonstration #

See [this page](http://lilbtn.googlecode.com/hg/src/static/js/jquery/jquery.jknav.demo.html).

# Requirements #

  * jQuery 1.4

# Installation #

The basic install is easy, you only need these:

```
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>
<script src="http://lilbtn.yjl.im/js/jquery/jquery.jknav.min.js"></script>
```

Add elements to navigation list first, then initialize jknav:

```
<script>
$('h2').jknav();
$.jknav.init();
</script>
```

# Customization #

## `$(selector).jknav()` ##

```
$(selector).jknav(callback, name);
```

You can assign a `callback` function, which will be invoked after jknav navigates the page to the item.

`name` is the navigation list's name, you can have more than one list with different keys.

## `$.jknav.init()` ##

```
$.jknav.init({
  up: 'k',
  down: 'j',
  name: 'default',
  easing: 'swing',
  speed: 'normal',
  circular: true,
  reevaluate: false
  });
```

You can change the default options:

  * `up` and `down` are the keys to trigger navigation.
  * `name` is the navigation list's name.
  * `easing` and `speed` are for navigation effect.
  * `circular` indicates if it's a circular navigation.
  * If `reevaluate` is true, then jknav uses current position to decide next item to navigate to; or based on the internal `index` variable.

## `$.jknav.up()` and `$.jknav.down()` ##

Provide programmatic way to navigate. It accepts one parameter, the name of navigation set. If the parameter is missing, then it's the `default` set.

# Known Issues #

None at this moment