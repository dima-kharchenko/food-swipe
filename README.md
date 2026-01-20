# FoodSwipe

## Temat projektu
Food Swipe to prosta aplikacja webowa, umożliwiająca użytkownikom rejestrację i logowanie, przeglądanie elementów w formie quizu, ich ocenianie oraz generowanie statystyk i linków do ich udostępniania. Dane są przechowywane w bazie danych, a całość aplikacji uruchamiana jest w środowisku kontenerowym za pomocą Docker Compose.

## Autorzy
- Dmytro Kharchenko – 55653

## Opis techniczny projektu
Aplikacja składa się z 3 kontenerów:
- **Backend** - aplikacja w Pythonie oparta o Django oraz Django REST Framework, udostępniająca API i logikę biznesową.
- **Frontend** - aplikacja React(Vite), zbudowana i serwowana przez Nginx, który dostarcza statyczne pliki frontendowe oraz obrazy.
- **Baza danych** - PostgreSQL, wykorzystywana do przechowywania danych użytkowników, elementów oraz ocen.

## Funkcjonalności
Projekt zawiera następujące funkcjonalności:

- **Zarządzanie użytkownikami (CRUD)**
   - rejestracja: `backend/api/auth/register/`
   - logowanie: `backend/api/auth/login/`
   - edycja danych: `backend/api/auth/update/`
   - usunięcie konta: `backend/api/auth/delete/`

- **Zarządzanie sesją użytkownika**
   - wylogowanie: `backend/api/auth/logout/`
   - status sesji: `api/auth/status/`

- **Zarządzanie elementami**
   - pobieranie elementów według kategorii: `api/items/<str:category>/`
   - pobieranie elementów w formie quizu: `api/items/quiz/<str:category>/`
   - oceniane elementu: `api/items/rate/`

- **Statystyki**
   - generowanie statystyk: `api/stats/<str:category>/`
   - udostępnianie statystyk: `api/stats/share/<str:category>/`
   - przegląd udostępnionych statystyk: `api/stats/share/get/<str:share_id>/`

## Uruchomienie projektu
```bash
git clone https://github.com/dima-kharchenko/food-swipe
cd food-swipe/
docker compose up
```
