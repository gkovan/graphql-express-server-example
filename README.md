# graphql-express-server-example

Step 1:  install dependencies
```
npm install
```

Step 2: build
```
npm run build
```

Step 3: run
```
npm run dev
```

Open browser and go to graphql playground:
```
http://localhost:9999/graphql
```


Queries to run:
```
query {
  books {
    getBooks {
      title
      author
    }
  }
}
```

```
query {
  starWars {
    films {
      title
      producer
      planets
      vehicles
      characters
    }
  }
}
```

Run both queries together:
```
query {
  starWars {
    films {
      title
      producer
      planets
      vehicles
      characters
    }
  }
  books {
    getBooks {
      title
      author
    }
  }
}
```
