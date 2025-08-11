# 🐕 SitSwap - Dog Sitting Community Platform

A modern, full-stack web application connecting dog owners with trusted pet sitters in their community. Built with Spring Boot and React, featuring a point-based reward system and comprehensive pet management.

## 🌟 Features

### For Dog Owners
- **Pet Profile Management** - Create detailed profiles for multiple pets with photos, breed info, special needs, and energy levels  
- **Request Creation** - Post dog-sitting requests with flexible scheduling
- **Point System** - Earn points by pet-sitting for others, spend points to request services  
- **Real-time Dashboard** - Track active requests, upcoming appointments, and pet family overview  

### For Pet Sitters
- **Browse Available Requests** - Filter and sort requests by date, location, and point value  
- **Detailed Pet Information** - Access comprehensive pet details including special needs and temperament  
- **Accept Requests** - Simple one-click acceptance system with immediate point rewards

### Core Functionality
- **User Authentication & Authorization** - Secure login system with BCrypt password encryption
- **Image Upload & Management** - Pet photo uploads with preview and optimization  
- **Responsive Design** - Beautiful, mobile-first UI with smooth animations  
- **Point-based Economy** - Balanced system encouraging community participation

## 🛠️ Tech Stack

### Backend
- Spring Boot 3.0+ - RESTful API with comprehensive endpoints  
- Spring Security - JWT-based authentication and authorization  
- Spring Data JPA - Database operations with Hibernate ORM  
- MySQL - Primary database for user and pet data  
- Maven - Dependency management and build automation  
- Spring Boot Actuator - Health checks and monitoring  

### Frontend
- React 18 - Modern functional components with hooks  
- React Router - Client-side routing with protected routes  
- CSS3 & Animations - Custom styling with smooth transitions  
- Responsive Design - Mobile-first approach with CSS Grid/Flexbox  
- File Upload - Image handling with preview functionality  
- Form Validation - Client-side and server-side validation

### Additional Technologies
- RESTful API Design - Clean, intuitive endpoint structure  
- Image Processing - File upload optimization and storage  
- Error Handling - Comprehensive error management across layers  
- Input Validation - Data sanitization and security measures

## 🚀 Quick Start

### Prerequisites
- Java 17 or higher  
- Node.js 16+ and npm  
- MySQL 8.0+  
- Maven 3.6+  

### Backend Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/sitswap.git
cd sitswap/backend

# Configure database in application.properties
# Update spring.datasource.url, username, password

# Install dependencies and run
mvn clean install
mvn spring-boot:run
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Start development server
npm start
```

### The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:8080

## 🏗️ Architecture & Design Patterns

### Backend Architecture
- Controller Layer - REST endpoints with proper HTTP status codes  
- Service Layer - Business logic separation and transaction management  
- Repository Layer - Data access abstraction with JPA repositories

### Frontend Architecture
- Component-Based Design - Reusable, modular React components  
- Custom Hooks - Shared logic extraction for API calls and state management  
- Responsive Design - Mobile-first CSS with modern layout techniques  
- State Management - React Context and local state for optimal performance

## 🔐 Security Features
- JWT Authentication - Stateless authentication with secure token handling  
- Password Encryption - BCrypt hashing for secure password storage  
- Input Validation - Server-side validation preventing injection attacks  
- CORS Configuration - Secure cross-origin resource sharing setup  
- File Upload Security - Image validation and safe storage practices  

## 📊 Database Schema

### Key Entities
- Users - Authentication and profile information  
- Pets - Comprehensive pet data with relationships  
- DogSit Requests - Sitting requests with scheduling and location  
- Points Transactions - Point-based reward system tracking  

### Relationships
- User → Pets (One-to-Many)  
- User → Requests (One-to-Many as owner)  
- User → Accepted Requests (One-to-Many as sitter)  
- Request → Pet (Many-to-One)  

## 🎨 UI/UX Highlights
- Modern Glass-morphism Design - Translucent cards with backdrop blur effects  
- Smooth Animations - CSS transitions and keyframe animations throughout  
- Color Psychology - Green-focused palette promoting trust and nature  
- Intuitive Navigation - Clear user flows and breadcrumb navigation

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/login`  
- `POST /api/auth/register`  
- `POST /api/auth/refresh`  

### User Management
- `GET /api/users/{id}`  
- `PUT /api/users/{id}`  
- `GET /api/users/{id}/pets`  
- `POST /api/users/{id}/pets`  

### Pet Management
- `GET /api/pets/{id}`  
- `PUT /api/pets/{id}`  
- `DELETE /api/pets/{id}`  
- `POST /api/pets/{id}/image`  

### Dog-Sitting Requests
- `GET /api/dogsits/status/{status}`  
- `POST /api/dogsits`  
- `PUT /api/dogsits/{id}/accept/{userId}`  
- `POST /api/dogsits/{id}/image`  
