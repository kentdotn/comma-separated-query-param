comma-separated-query-param
===========================

Let clients request with array of parameter values in a tidy notation.

## What you can get?

Express.js allows you to request with array of parameter values in this fashion:
```
http://example.com/?a=1&a=2&a=3&a=4
```

... then, you can get `["1", "2", "3", "4"]` via `req.query["a"]`.

Now with this middleware, clients allow to request with more tidy fashion:
```
http://example.com/?a=1,2,3,4
```

Cool, isn't it?

## Example
```Typescript
// import the parser middleware
import commaSeparatedParameterListParser from "comma-separated-query-param";
// set the middleware
app.use(commaSeparatedParameterListParser({
    // all parameters start with 'a' now allow to have comma-separated parameter value array
    pattenrs: [/^a/],
    // ... but for parameter 'ax', commas are not treated as array separators
    excludes: ["ax"]
}));
```
In above case, you can make requests like
```
http://example.com/?aa=1,2,3&ax=one,two,three&bb=x,y,z
```
and get `aa=["1","2","3"]`, `ax="one,two,three"` and `bb="x,y,z"`.
