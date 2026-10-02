# FashionHub — Sprint 2

Sprint 2 extends the FashionHub Sprint 1 architecture into a catalog data foundation.

## Technology
- Frontend: React.js
- Backend: Node.js + Express.js
- Database: PostgreSQL
- Optional caching: Redis

## Local setup
1. Install Node.js and PostgreSQL.
2. Create a PostgreSQL database named `fashionhub`.
3. Copy `.env.example` to `.env` and set your database/JWT values.
4. Run:
   ```bash
   npm install
   npm run db:schema
   npm run db:seed
   npm test
   npm start
   ```
5. The API runs on `http://localhost:3000`.

Do not commit `.env` or real secrets.
