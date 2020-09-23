FROM ikhnaton/node:12.16.1
VOLUME ["/app"]
WORKDIR /app

CMD npm ci && npm run dev
