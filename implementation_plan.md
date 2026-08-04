# Implementation Plan

## Goal
Fix CORS, UI issues, missing logos, and add new features (Name Numerology, Custom Number Request), while updating the database with new numbers and settings.

## Proposed Changes

### Backend Changes
- **CORS Fix:** Update `backend/app.js` to unconditionally allow `http://localhost:5173` and the deployed Render URL, solving the local dev vs live server CORS block.
- **Data Migration Script (`backend/scripts/updateData.js`):**
  - Delete all existing numbers.
  - Insert the 24 new Airtel numbers from the handwritten list.
  - Prices will be distributed among: ₹899, ₹2499, ₹2799, ₹4999, ₹6999, and ₹11999.
  - Update global `Settings`: Set UPI ID to `yespay.mabs1467858wkit0263@yesbankltd` and WhatsApp number to `+919888695199`.

### Frontend Changes
- **QRPayment UI Fix:** Fix the overlapping line and text in the "Total Amount" box in `QRPayment.jsx` by adjusting CSS `z-index` and padding.
- **Logo Fix:** Update `Header.jsx` to use a reliable public URL or SVG for the main logo so it stops breaking.
- **New Feature - Search by Name:** Add a "Search by Name" input on the homepage or numbers list that converts a user's name to a T9 dialpad number (e.g., DEEPAK -> 333725) and searches for numbers containing that sequence.
- **New Feature - Request a Number:** Add a "Request Custom Number" form where users can submit their specific requirements.

## User Review Required

> [!IMPORTANT]
> - This plan will **DELETE all your existing numbers** and replace them with the 24 Airtel numbers from your notebook image. Is this what you want?
> - The prices will be distributed among 899, 2499, 2799, 4999, 6999, and 11999 as requested.
> - Please approve this plan so I can begin execution.
