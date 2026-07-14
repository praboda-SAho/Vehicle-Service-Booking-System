# REVLINE — Vehicle Service Booking System (Backend API)

Node.js + Express + MongoDB REST API for the Vehicle Service Booking System.
Matches the front-end UI: service tickets, work-order style bookings, and a
Received → Confirmed → In Service → Ready status tracker.

## Setup

```bash
npm install
cp .env.example .env    # then fill in your MongoDB URI and JWT secret
npm run seed             # inserts the 6 services used in the UI
npm run dev               # starts the server with nodemon (or: npm start)
```

Requires a running MongoDB instance (local or MongoDB Atlas).

## Folder Structure

```
config/db.js            MongoDB connection
models/                 User, Service, Booking schemas
controllers/             Route logic
routes/                  Express routers
middleware/auth.js       JWT auth + role-based access control
utils/                    Work order ID generator, service seed script
server.js                 App entry point
```

## Roles

- **customer** — default role on registration. Can create bookings, view own bookings.
- **mechanic** — can view all bookings, update status.
- **admin** — full access: manage services, assign mechanics, update any booking.

(Set a user's role directly in MongoDB, or add an admin-only endpoint later.)

## API Reference

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a new customer |
| POST | `/api/auth/login` | Public | Login, returns JWT |
| GET | `/api/auth/me` | Logged in | Get current user |

### Services
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/services` | Public | List active services (for the ticket grid) |
| POST | `/api/services` | Admin | Add a new service |
| PUT | `/api/services/:id` | Admin | Update a service |
| DELETE | `/api/services/:id` | Admin | Deactivate a service |

### Bookings
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/bookings` | Customer | Create a booking (work order) |
| GET | `/api/bookings/my` | Customer | View own bookings |
| GET | `/api/bookings/track/:workOrderId` | Public | Track a booking by work order ID |
| GET | `/api/bookings` | Admin/Mechanic | View all bookings (`?status=` filter optional) |
| PATCH | `/api/bookings/:id/status` | Admin/Mechanic | Update booking status |
| PATCH | `/api/bookings/:id/assign` | Admin | Assign a mechanic to a booking |

## Example: Create a Booking

```http
POST /api/bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "vehicle": { "model": "Toyota Aqua", "plateNumber": "CAB-1234", "year": 2019 },
  "serviceIds": ["<serviceId1>", "<serviceId2>"],
  "preferredDate": "2026-07-20",
  "preferredTime": "09:30 AM",
  "notes": "Slight noise from front left wheel"
}
```

Response includes a generated `workOrderId` (e.g. `WO-482913`) matching the
format shown on the front-end work order ticket, plus the calculated `total`.

## Connecting the Front-End

In `vehicle-service-booking-ui.html`, replace the local `services` array and
the `confirmBooking()` function's local state with `fetch()` calls to:
- `GET /api/services` on page load, to populate the ticket grid
- `POST /api/bookings` when the user clicks "Confirm Booking"
- `GET /api/bookings/track/:workOrderId` to drive the live status tracker
