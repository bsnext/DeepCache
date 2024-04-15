# DeepCache
Classic cache library, but with allowed dump methods.<br>
<b>Very early-stage and unstable.</b>

## Usage:
```ts
new DeepCache(options = {})
```

#### Options:
* ttl - Default keys time-to-live in seconds (Default: 60)
* ttc - Default time for collect expired keys in seconds (Default: 60)
* separator - Separator for split keys to levels 

    *Example: "users:id", for use DeepCache.values("users:\*")*
* separator - Separator for split keys to levels 
* cloning - Use "structoredClone" for cache records (Default: false)
* events - Enable emitting events (Default: false)

## API:
* DeepCache.set()
* DeepCache.get()
* DeepCache.has()
* DeepCache.del()
* DeepCache.values()
* DeepCache.saveDump()
* DeepCache.loadDump()
* DeepCache.clean()
* DeepCache.on();

## Events:
* set
* del
* expired