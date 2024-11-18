## Examensarbete YRGO WU23

Fanny Karlsson och Lucas Ackerberg

HT 2024 YRGO Göteborg

## Getting Started

För att få projektet att fungera måste följande instruktioner följas:

```bash
cd backend
npm install
cd /config
node createdb.js
cd ..
nodemon server.js

cd frontend
npm install
npm run dev

```

Detta kommer att generera ett "start" projekt med lite basic kurser, behandlingar osv. Dessa kommer dock inte att ha några fungerande bilder. För att få åtkomst till admin panelen logga in med dummy användaren lucas@1.se.

För att betalningarna skall fungera måste STRIPES lokala CLI vara installerad. Detta kan laddas ner [här](https://stripe.com/en-se).

När den väl är installerad se tilla att köra följande command:

```bash
stripe login
```

Detta kommer prompta dig till en setup sida som loggar in dig och genererar en local key. Sätt in denna i din ENV fil.

Kör sedan för att sätta igång deras webhook forwarded för att kunna testa betalningarna lokalt:

```bash
 stripe listen --forward-to localhost:3000/webhook
```

## Techstak

Byggt med Vue, Node.js, Express.js, Mysql och Stripe

## Live länk

www.sn-beauty.se
