# JavaScript library for Coderr

This library is alpha. Feel free to try it, and please give us feedback.

## Example

```html
<html>
    <head>
        <script src="coderr.browser.js"></script>
        <script>
            // Setup
            var config = new coderr.Configuration("http://localhost:50473/", "f7aeacfdbe5447cdada6aa9ee21d24fb");
            var reporter = new coderr.Coderr(config);

            // report all unhandled errors
            reporter.catchDomErrors();



            // This is how manual reporting is done.
            // 
            // In this case not really nessacary since 
            // "catchDomErrors" would have reprted it.
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

## Example from UI

![](docs/error_example.png)

Example showing the "userAgent" context collection.

Coderr automatically includes information about the window, document, cookies, navigator and screen.