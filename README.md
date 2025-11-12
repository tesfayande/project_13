# Project 13

## Définissez une solution fonctionnelle et concevez l’architecture d’une application

## 📝 Project Overview

This repository contains the project13 of  OpenClassrooms [Angular and Java development](https://openclassrooms.com/fr/paths/533-developpeur-full-stack-java-et-angular) development path. It was built as a fullstack Chat web application with:

- **Backend**: Spring Boot (Java) for REST API
- **Frontend**: Angular (TypeScript) for user interface


## 🛠️ Technologies Used

### Backend (Spring Boot)

- Spring Boot
- Spring Data JPA
- Hibernate
- Maven
- Mysql
- WebSocket

### Frontend (Angular)

- Angular
- RxJS
- WebSocket

## 🚀 Installation & Setup

1. **Clone the repository**
  
        git remote add origin https://github.com/tesfayande/project_13.git

### Backend Setup

        cd backend

1. **Configure database**
   - Create a database in your DBMS
   - Update application.properties with your DB credentials
   - Database sql [database schema](https://github.com/tesfayande/project_13/blob/main/Db/data.sql)
   - Database diagram  ![My Db Diagram](https://github.com/tesfayande/project_13/blob/main/Resources/Pr13_DB_Diagramm.png)

2. **Build and run**

## Using Maven

        mvn clean install
        mvn spring-boot:run

### Or run directly from IDE

4.Verify backend is running**

- Open http://localhost:8080

### Frontend Setup

1.**Navigate to frontend directory**

        cd frontend

2.**Install dependencies**

        npm install

3.**Run development server**

        ng serve

4.**Access the application**

- Open  http://localhost:4200  in your browser
