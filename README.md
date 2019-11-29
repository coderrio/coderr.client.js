# JavaScript library for Coderr

This library is currently avilable as a release candidate. Feel free to try it, and please give us feedback.

https://coderr.io

## Examples

The following examples are just demonstrating basic usage:

### Using plain browser scripts

```html
<html>
    <head>
        <script src="coderr.browser.js"></script>
        <script>
            // Setup
            var config = new coderr.Configuration("https://report.coderr.io", "f7aeacfdbe5447cdada6aa9ee21d24fb");
            var reporter = new coderr.Coderr(config);

            // report all unhandled errors
            reporter.catchDomErrors();



            // This is how manual reporting is done.
            // 
            // In this case not really nessacary since 
            // "catchDomErrors" would have reported it.
            try {
                var a = 10 / 0;
            }
            catch (err){
                reporter.report(err, {userName: "arne"});
            }
        </script>
    </head>
</html>
```` 

**From the Coderr Server UI**

![](docs/error_example.png)

Example showing the "userAgent" context collection.

For browsers, Coderr automatically includes information about the window, document, cookies, navigator and screen.

## Using TypeScript

```typescript
import { CoderrClient, Configuration } from "coderr.client";
import { catchVueErrors } from "./Coderr.Vue"

var config = new Configuration("https://report.coderr.io/", "8ffd506b153f4ca690daaf6abd5fdcdf");
config.environmentName = 'production';
config.applicationVersion = 'v1.0';

var client = new CoderrClient(config);
client.catchDomErrors();
catchVueErrors(client);
```

**Result**

![](docs/vue.png)

For VueJs, Coderr collections information about the failing component, the HTML for the rendered component view, selected routes and more.


# Questions

https://discuss.coderr.io
