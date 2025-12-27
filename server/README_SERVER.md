    Smart Auction Platform - Server


    This server provides two demo endpoints for payments and invoices:


    POST /api/payment  { name, method, amount }  -> { success:true, invoiceId }
    -> saves invoice JSON and HTML under server/invoices/

    GET /api/invoice/:id  -> returns invoice JSON

To run:
  npm install
  node index.js

