<img src="https://res.cloudinary.com/n3/image/upload/v1539999214/icon-512x512.png" alt="LAN logo" title="LAN" align="left" height="60" />
Local Alert Network
===============

Local Alert Network (LAN) is a web app designed to assist the public before, during, and after a disaster with the help of crowdsourced alerts.

## Main Features

* Facebook and Google authorization
* Real-time alerts
* Visualization of where the alert was created on a map
* Crowdsourced alerts 
* Email subscription service that notifies subscribers of alerts occurring near their home location
* A responsive design for both desktop and mobile users

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

**dotenv: ** We use dotenv npm module and a '.env' file to store local environmental variables. These appear as process.env[variable name] throughout the code.

### Installing

1. Clone or download our repo
```
2. npm install
```
3. Create a local env file
```
touch .env
```
4. Add PORT=9000
Create a MySQL remote DB and add credentials to connect
```
5. npm run build:(prod or dev)
build:dev - refers to a developer environment
build:prod - refers to a production environment 
```
```
6. npm start
```

## Deployment

Deploy to AWS using Docker
1. Create a docker image
```
docker build -t local-alert-network .
```
2. Using AWS CLI
```
aws configure
```
3. Create a new repository on AWS
4. Follow the AWS instructions to build, tag, and push the docker image you created
5. Create a new task definition on AWS
6. Create a new cluster (we used EC2)
7. Create a new service based on task definition and assign to cluster
8. Find your ECS instance within your cluster and obtain public DNS address

## Built With
[ReactJS] - frontend framework
[NodeJS/Express]- server-side framework
[Apollo Server/GraphQL] - server-side query language
[Apollo Client/GraphQL]- frontend query language
[Reach Router]- Website navigation
[Mapbox/DeckGL]- Map functionality
[Nodemailer]- Microservice notifications
[MySQL]- Database
[Cloudinary]- Media storage

## Authors


Nathan Ong-Original Author-GraphQL integration
Nathan Vang-Original Author- Performance Optimization
Nicolas Turner-Original Author- Email Microservice development

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments
Robin Kim, Feng Chen, Andy Riesenbach, Ashleigh Kessel
Icon pics - freepik.com, fjstudio
