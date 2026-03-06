# API Documentation - Sukra Polyclinic

This document outlines the required backend API endpoints for the Online Sample Collection Lab (Sukra Polyclinic), including detailed request parameters and response data types as extracted from the frontend usage.

## Base URL

`https://enthusiastic-emotion-production-f0cf.up.railway.app/api`

## Authentication

All protected endpoints require a Bearer token in the `Authorization` header.
`Authorization: Bearer <token>`

### 1. Send OTP

Request a 6-digit verification code to be sent to a mobile number.

- **Endpoint**: `POST /auth/send-otp`
- **Body**:
  ```json
  {
    "mobile": "string" // 10-digit number
  }
  ```
- **Response**: `200 OK` on success.

### 2. Verify OTP

Verify the OTP sent to the mobile number.

- **Endpoint**: `POST /auth/verify-otp`
- **Body**:
  ```json
  {
    "mobile": "string",
    "otp": "string" // 6-digit code
  }
  ```
- **Response**:
  ```json
  {
    "token": "string",
    "isNewUser": "boolean",
    "user": {
      "id": "number",
      "name": "string",
      "mobile": "string",
      "dob": "string (YYYY-MM-DD)"
    }
  }
  ```

### 3. Complete Signup

Initialize user profile for new users.

- **Endpoint**: `POST /auth/signup`
- **Body**:
  ```json
  {
    "name": "string",
    "dob": "string (YYYY-MM-DD)",
    "mobile": "string"
  }
  ```
- **Response**:
  ```json
  {
    "user": {
      "id": "number",
      "name": "string",
      "mobile": "string",
      "dob": "string"
    }
  }
  ```

### 4. Get Current User

Retrieve information about the currently logged-in user.

- **Endpoint**: `GET /auth/current`
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "user": {
      "id": "number",
      "name": "string",
      "mobile": "string",
      "dob": "string"
    }
  }
  ```

---

## Tests & Packages

### 1. List Tests

Retrieve a paginated list of individual lab tests.

- **Endpoint**: `GET /tests`
- **Query Params**:
  - `page`: number (default: 1)
  - `limit`: number (default: 50)
  - _Optional Filters_:
    - `department`: string
    - `testCode`: string
    - `testName`: string
    - `methodName`: string
    - `specimen`: string
    - `specimenVolume`: string
    - `container`: string
    - `reported`: string
    - `minAmount`: number
    - `maxAmount`: number
    - `specialInstruction`: string
- **Response**:
  ```json
  {
    "tests": [
      {
        "id": "number",
        "department": "string",
        "testCode": "string",
        "testName": "string",
        "amount": "number",
        "methodName": "string",
        "specimen": "string",
        "specimenVolume": "string",
        "container": "string",
        "reported": "string",
        "specialInstruction": "string (optional)",
        "createdAt": "string (optional)",
        "updatedAt": "string (optional)"
      }
    ],
    "pagination": {
      "total": "number",
      "page": "number",
      "limit": "number",
      "totalPages": "number"
    }
  }
  ```

### 2. Get Single Test Details

- **Endpoint**: `GET /tests/:id`
- **Response**: Returns the single `Test` object matching the parameters in the list above.

### 3. List Packages

Retrieve a paginated list of health packages.

- **Endpoint**: `GET /packages`
- **Query Params**:
  - `page`: number
  - `limit`: number
  - _Optional Filters_:
    - `name`: string
    - `minPrice`: number
    - `maxPrice`: number
    - `testName`: string
    - `testCode`: string
    - `department`: string
    - `methodName`: string
    - `specimen`: string
    - `specimenVolume`: string
    - `container`: string
    - `reported`: string
    - `specialInstruction`: string
- **Response**:
  ```json
  {
    "data": [
      {
        "id": "number",
        "name": "string",
        "description": "string (optional)",
        "price": "number",
        "tests": [
          /* Array of Full Test objects from above */
        ],
        "createdAt": "string (optional)",
        "updatedAt": "string (optional)"
      }
    ],
    "pagination": {
      "total": "number",
      "page": "number",
      "limit": "number",
      "totalPages": "number"
    }
  }
  ```

### 4. Get Single Package Details

- **Endpoint**: `GET /packages/:id`
- **Response**: Returns the single `Package` object matching the detailed parameters in the list above.

---

## Bookings

### 1. Create Booking

Submit a new booking request. This endpoint uses `multipart/form-data` to handle possible prescription file uploads.

- **Endpoint**: `POST /bookings`
- **Request Type**: `multipart/form-data`
- **Fields**:
  - `name`: string
  - `age`: number
  - `gender`: string (`MALE`, `FEMALE`, `BISEXUAL`, `TRANSGENDER`)
  - `mobile`: string
  - `address`: string
  - `latitude`: number (stringified)
  - `longitude`: number (stringified)
  - `date`: string (YYYY-MM-DD)
  - `timeSlot`: string (e.g., "08:00-09:00")
  - `prcDoctor`: string (optional, chosen doctor name)
  - `paymentMode`: string (`PAY_LATER`, `ESEWA`, `KHALTI`, `BANK_TRANSFER`)
  - `items`: Array of objects (appended as `items[0][type]`, `items[0][name]`, etc.)
    - `type`: `test` | `package`
    - `name`: string
    - `price`: number
    - `testId`: number (if type is test)
    - `packageId`: number (if type is package)
  - `file`: File (Prescription image/PDF, optional)

- **Response**: `201 Created`

### 2. My Bookings

Retrieve bookings for the logged-in user.

- **Endpoint**: `GET /bookings/my`
- **Query Params**:
  - `page`: number
  - `limit`: number
  - `status`: string (optional: `PENDING`, `SCHEDULED`, `SAMPLE_COLLECTED`, `COMPLETED`, `CANCELLED`)
- **Response**:
  ```json
  {
    "data": [
      {
        "id": "number",
        "name": "string",
        "date": "string",
        "timeSlot": "string",
        "status": "string",
        "paymentMode": "string (optional)",
        "paymentStatus": "string",
        "createdAt": "string",
        "items": [
          {
            "id": "number",
            "type": "\"test\" | \"package\"",
            "name": "string",
            "price": "number",
            "testId": "number (optional)",
            "packageId": "number (optional)"
          }
        ]
      }
    ],
    "pagination": {
      "total": "number",
      "page": "number",
      "limit": "number"
    }
  }
  ```

### 3. Cancel Booking

Cancel an existing booking request based on its ID.

- **Endpoint**: `PATCH /bookings/:id/cancel`
- **Response**: `200 OK`

---

## Profile & Settings

### 1. Update Profile

Update the user's name or date of birth.

- **Endpoint**: `PATCH /auth/profile`
- **Body**:
  ```json
  {
    "name": "string (optional)",
    "dob": "string (YYYY-MM-DD, optional)"
  }
  ```
- **Response**: Updated user object.

---

## Saved Addresses

_(Note: Endpoint documented, pending full integration)_

### 1. List Addresses

- **Endpoint**: `GET /addresses`
- **Response**:
  ```json
  [
    {
      "id": "number",
      "label": "string", // e.g., "Home", "Office"
      "address": "string",
      "latitude": "number",
      "longitude": "number",
      "isDefault": "boolean"
    }
  ]
  ```

### 2. Add Address

- **Endpoint**: `POST /addresses`
- **Body**:
  ```json
  {
    "label": "string",
    "address": "string",
    "latitude": "number",
    "longitude": "number",
    "isDefault": "boolean"
  }
  ```
- **Response**: `201 Created`

### 3. Update Address

- **Endpoint**: `PATCH /addresses/:id`
- **Body**: Same as Add Address (all fields optional).

### 4. Delete Address

- **Endpoint**: `DELETE /addresses/:id`

---

## Health Records (Medical History)

_(Note: Endpoint documented, pending full integration)_

### 1. List Records

Retrieve all medical history, including uploaded prescriptions and previous test reports.

- **Endpoint**: `GET /health-records`
- **Response**:
  ```json
  [
    {
      "id": "number",
      "title": "string",
      "date": "string (ISO Date)",
      "fileUrl": "string (URL)",
      "type": "string", // "REPORT" | "PRESCRIPTION" | "OTHER"
      "source": "string" // "INTERNAL" (system generated) | "EXTERNAL" (user upload)
    }
  ]
  ```

### 2. Upload Record

Upload an external medical document.

- **Endpoint**: `POST /health-records`
- **Request Type**: `multipart/form-data`
- **Fields**:
  - `title`: string
  - `type`: string
  - `file`: File (image/PDF)
- **Response**: `201 Created`

### 3. Delete Record

- **Endpoint**: `DELETE /health-records/:id`

---

## Notifications

_(Note: Mocked/Stubbed)_

### 1. List Notifications

- **Endpoint**: `GET /notifications`
- **Response**:
  ```json
  [
    {
      "id": "string",
      "title": "string",
      "message": "string",
      "time": "string (ISO Date)",
      "read": "boolean"
    }
  ]
  ```
