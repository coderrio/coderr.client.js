# JavaScript library for Coderr

This library is currently available as a release candidate. Feel free to try it, and please give us feedback.

![](https://coderr.io/docs/images/libraries/js/core/error.gif)

https://coderr.io


This library supports NodeJS and the browser (es6 module). There are also integration libraries that pick up errors automatically from Express, Angular etc.

## Installation

Download this package:

```javascript
npm -I coderr.client
```

Add it to your application:

```javascript
import { err } from "coderr.client";

err.configuration.credentials("https://reporting.coderr.io", "yourAppKey");
```

DOM errors will now automatically be reported (for browser-based applications).

To report errors:

```javascript
import { err } from "coderr.client";

try {
    // Do something
    // or to just test:
    throw new Error("Something failed!");
}
catch (e) {
    // You can attach any kind of data.
    err.report(e, {userId: 11, address: { City: "Falun" }});
}
```

## Configuration

Coderr detects the environment (production/development) automatically when running in node,
for all other types of applications, specify it:

```javascript
import { err } from "coderr.client";

err.configuration.environment = 'production';
```

### Application version

To see which application version an error exist, specify it:

```javascript
import { err } from "coderr.client";

err.configuration.applicationVersion = '1.1.3';
```


# Example, integration library

You can, for instance, install the Express package:

```javascript
npm -I coderr.client.expressjs
```

And then activate it:

```javascript
import { err } from "coderr.client";
import { activatePlugin, errorMiddleware } from "coderr.client.expressjs";


activatePlugin(err.configuration);
err.configuration.credentials("https://coderr.io", "yourAppKey", "yourSharedSecret");
```

Finally, activate the error middleware as the last middleware:

```javascript
app.use(errorMiddleware);
```
