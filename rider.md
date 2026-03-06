# Rider (Phlebotomist) Application - Documentation & Plan

## 1. Overview

The Rider application is a standalone mobile app (or a dedicated, role-based module within the same app ecosystem) designed specifically for phlebotomists (riders) who collect medical samples from patients' locations. It serves as the primary tool for field staff to manage their daily assignments, navigate to patient addresses, follow sample collection protocols, and safely transfer samples to the lab.

## 2. Target Audience

- Phlebotomists / Sample Collectors
- Lab Fleet Managers (for tracking)

## 3. Core Features & User Requirements

### 3.1 Authentication & Onboarding

- **Login:** Phone number + OTP or Password.
- **Biometrics:** Quick unlock via FaceID/Fingerprint.
- **Profile:** Displays rider details, contact info, vehicle information, and assigned parent lab/hub.
- **Duty Toggle:** Online/Offline status switch to indicate availability to receive new bookings.

### 3.2 Dashboard

- **Daily Synopsis:** Quick cards showing total tasks today, completed, pending, and cancelled.
- **Performance/Earnings:** (Optional) Metrics on daily incentives or distance covered.
- **Status Warnings:** Reminders for pending lab handoffs.

### 3.3 Task/Booking Management

- **Task Feed:** A list of assigned upcoming sample collections, sorted by time slot.
- **Task Details:**
  - Patient name, age, gender.
  - Required tests/packages (indicates which and how many vacutainers/vials to carry).
  - Exact address with GPS coordinates and calculated distance.
  - Preferred collection time slot.
  - Special instructions (e.g., patient must be fasting for 12 hours).
- **Action Buttons:** "Acknowledge", "Start Journey", "Arrived", "Cancel/Report Issue" (with predefined reason codes like Patient Unavailable, Address Not Found).

### 3.4 Navigation & Tracking

- **Map Integration:** Integration with native navigation (opening Google Maps/Apple Maps with the destination coordinates).
- **Live Location Tracking:** Background location tracking that periodically updates the rider's coordinates to the backend, enabling the patient to see ETA and live tracking on their app.

### 3.5 Sample Collection Flow (SOP)

Standard Operating Procedure flow enforced by the app upon reaching the patient:

1. **Patient Verification:** Patient provides a secure OTP (from their app/SMS) which the rider enters to verify identity.
2. **Pre-requisite Checklist:** Rider confirms check-boxes (e.g., "Confirmed fasting status?", "Checked patient ID?").
3. **Barcode Scanning:** Rider uses the app's camera to scan the barcode on the sample vial/vacutainer and automatically links it to the specific test in the booking.
4. **Status Update:** Task marked as "Sample Collected".
5. **Payment Collection:** (If applicable) Record cash received or trigger a dynamic UPI payment link.

### 3.6 Drop-off / Lab Handoff Flow

- **Batch Inventory:** A screen showing a list of all active, collected samples currently in the rider's possession.
- **Lab Transfer/Handoff:** When arriving at the processing lab, the rider scans all carried samples to digitally transfer custody to the lab inventory system, marking the task lifecycle as fully closed.

### 3.7 Notifications & Alerts

- Push notifications for new immediate assignments.
- Alerts when a patient cancels or reschedules a booking currently assigned to them.
- Timely reminders for upcoming slots to ensure punctuality.

---

## 4. Technical Architecture & Tech Stack

### 4.1 Tech Stack Recommendation

Building this in **React Native (Expo)** is highly recommended since the main patient app is also in Expo.

- **Framework:** React Native / Expo (Allows code-sharing of UI components, colors, and utility functions).
- **Navigation:** Expo Router.
- **State Management:** Zustand or React Context.
- **Hardware Integrations:**
  - `expo-camera` or `react-native-vision-camera` (Barcode scanning)
  - `expo-location` (Background and foreground location tracking)
  - `expo-local-authentication` (Biometrics)

### 4.2 Architecture Approach: Separate App vs. Shared App

**Recommendation: Separate Application (`rider-app`)**

- Creating a separate frontend application connected to the same backend is best.
- **Why?** It keeps the bundle size small for both apps, simplifies the unified routing logic, minimizes security risks, and prevents patients from accidentally accessing rider screens. You can still use a monorepo (like Turborepo) to share UI components.

### 4.3 Key API Endpoints Required (To sync with Backend)

- `GET /api/rider/tasks` : Fetch daily itinerary.
- `PATCH /api/rider/tasks/{taskId}/status` : Update status (EN_ROUTE, ARRIVED, COLLECTED, FAILED).
- `POST /api/rider/track` : Push current GPS coordinates.
- `POST /api/rider/verify-otp` : Validate patient OTP for collection.
- `POST /api/rider/sample-link` : Link a scanned barcode string to a booking/test ID.

---

## 5. Phased Implementation Plan

### Phase 1: MVP (Minimum Viable Product)

_Goal: Get the core assignment and status updates working._

- Set up Expo project and basic authentication mechanism.
- Implement the Dashboard and daily Task Feed list.
- Implement Task Details View.
- Build the basic status update buttons (Start, Arrive, Complete).
- Add simple external linking to Google Maps for navigation.

### Phase 2: Core Operational Features

_Goal: Secure the collection flow and improve navigation._

- Integrate `expo-camera` for scanning vial barcodes.
- Implement Patient OTP verification step before marking as completed.
- Add background location tracking to ping backend with rider coordinates.
- Build the Lab Handoff screen to transfer custody of samples.

### Phase 3: Polish & Advanced Capabilities

_Goal: Robustness and enhanced user experience._

- **Offline Mode:** Cache today's tasks so riders can view details and scan barcodes even inside buildings with poor cellular reception (syncing when back online).
- Add Biometric App Lock.
- Detailed push notifications with custom sounds.
- In-app analytics and performance tracking for the rider.
