<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

# Kriptomat assignment project

Simple REST API service for issuing JWT and registering/logging-in users.

## Notes

- I have added docker-compose for the dev env and simple build for the production
- I have not applied Dependency Inversion due to a code scope and to reduce the complexity (I have used concrete repository instances in services)
- I have not covered all the code with the unit tests, because the pattern was more or less the same or similar
- I have not used the ConfigService (used env variables directly) again, because of the not needed complexity for this project
- I have not applied pre-commit hooks (prettier, eslint)

## Routes

```
POST /api/auth/register
{
  name*, email*, password*, address, phone
}

POST /api/auth/login
{
  email*, password*
}

PATCH /api/users/{uuid}/password
{
  oldPassword*, newPassword*
}

PATCH /api/users/{uuid}
{
  name, email, password, address, phone
}
```

## Setup

Add localhost alias:

```
sudo nano /etc/hosts

127.0.0.1 kriptomat-api.com
```

Initialize `.env` file and build Docker env:

`sh init.sh`
