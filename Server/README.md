[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
<img src="https://i.imgur.com/dPAUev4.png" width=100 />

<h3 align="center">[DRAG0N E-COMMERCE PC STORE]</h3>

  <p align="center">
A full-featured modern e-commerce platform built with React (Vite) and Node.js + Express + Prisma. This platform offers a complete shopping experience with secure authentication, product browsing, dynamic filtering, and order management.
    <br />
    <a href="https://documenter.getpostman.com/view/36229537/2sB34eJh22"><strong>Postman Collection »</strong></a>
    <br />
    <br />
    <a href="https://github.com/HazemSarhan/dragon-ecommerce-backend/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/HazemSarhan/dragon-ecommerce-backend/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->

## Table of Contents

- [Features](#features)
- [Tools & Stack](#tools)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Installation](#installation)

## Features

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- Cloudinary
- JWT
- Stripe

## Tools & Stack

<div align="center">
    <img src="https://skillicons.dev/icons?i=js,nodejs,express,postgres,prisma,vercel" /><br>
</div>

## Getting Started

- Node.js: Version 18 or higher

## Pictures

<img src="https://i.imgur.com/g0i757o.jpeg" alt="Image">

## Check out the frontend repo:

<div>
<a href="https://github.com/HazemSarhan/dragon-ecommerce-frontend">Frontend Repo</a>
</div>

## Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```env
PORT = 3000
JWT_SECRET = your-jwt-secret-key
JWT_LIFETIME = 1d
DATABASE_URL = your-db-connection-url
CLOUD_NAME = your-cloudinary-api-cloud-name
CLOUD_API_KEY = your-cloudinary-api-cloud-key
CLOUD_API_SECRET = your-cloudinary-api-cloud-secret-key
STRIPE_SECRET_KEY = your-stripe-secret-key
CLIENT_URL = your-frontend-url
SERVER_URL = your-server-url
```

## Installation :

1. Clone the repository:

```sh
git clone https://github.com/HazemSarhan/dragon-ecommerce-backend.git
```

2. Navigate into the project directory:

```sh
cd /dragon-ecommerce-backend
```

3. Install dependencies:

```sh
npm install
```

4. Set up environment variables:
   Check: [Environment Variables](#environment-variables)

5. Start the server:

```sh
npm run dev
```

> [!TIP]
> First registered account role will automatically set to => ADMIN

[contributors-shield]: https://img.shields.io/github/contributors/HazemSarhan/dragon-ecommerce-backend?style=for-the-badge
[contributors-url]: https://github.com/HazemSarhan/dragon-ecommerce-backend/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/HazemSarhan/dragon-ecommerce-backend.svg?style=for-the-badge
[forks-url]: https://github.com/HazemSarhan/dragon-ecommerce-backend/network/members
[stars-shield]: https://img.shields.io/github/stars/HazemSarhan/dragon-ecommerce-backend.svg?style=for-the-badge
[stars-url]: https://github.com/HazemSarhan/dragon-ecommerce-backend/stargazers
[issues-shield]: https://img.shields.io/github/issues/HazemSarhan/dragon-ecommerce-backend.svg?style=for-the-badge
[issues-url]: https://github.com/HazemSarhan/dragon-ecommerce-backend/issues
[license-shield]: https://img.shields.io/github/license/HazemSarhan/dragon-ecommerce-backend.svg?style=for-the-badge
[license-url]: https://github.com/HazemSarhan/dragon-ecommerce-backend/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/hazemmegahed/
[product-screenshot]: images/screenshot.png
[node-js]: https://svgur.com/i/19bZ.svg
[express-js]: https://svgur.com/i/19a1.svg
[mongo-db]: https://svgur.com/i/19b4.svg
[jwt]: https://svgshare.com/i/19bi.svg
[db]: https://i.imgur.com/0CzwXXA.png
