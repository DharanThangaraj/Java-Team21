# Campus Resource Management System

A comprehensive system for managing and booking campus resources like Labs, Seminar Halls, and Classrooms.

## Features

### Resource Management
- **Admin Control**: Administrators can create new resources and edit existing ones.
- **Resource Details**: Track resource names, types (Lab, Seminar Hall, Classroom), and capacities.
- **Dynamic Updates**: Modifying resources automatically reflects in total and available counts.

### Booking System
- **Transparency**: Every booking clearly identifies who booked the resource and which specific resource is reserved.
- **Role-Based Workflow**:
  - **Students**: Bookings require faculty and admin approval.
  - **Faculty**: Bookings require admin approval.
  - **Admins**: Direct booking capability.
- **Validation**: Enforces working hours (9 AM - 5 PM), break times, and role-based duration limits.

### User Security & Session Management
- **Signup Validation**: Passwords must be more than 6 characters long to ensure account security.
- **Session Timeout**: Students are automatically logged out after 10 minutes of inactivity to protect sensitive resources.

## Tech Stack
- **Backend**: Spring Boot (Java), PostgreSQL, Hibernate.
- **Frontend**: React, Tailwind CSS, Context API.
- **State Management**: React Context for Auth and Notifications.
- **Build Tools**: Maven (Backend), NPM (Frontend).

## Project Structure
- `campus-resource-system/`: Spring Boot backend application.
- `frontend/`: React frontend application.
