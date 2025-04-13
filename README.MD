Features to implement:
- offerId
- numer rejestracyjny

Aby uruchomić migracje, trzeba:
1) zbudować obraz na raspberry pi
2) docker exec -it f0824e1c987b bash
3) npm install tsconfig-paths --save-dev
4) npm run migration:run

Lub zmienić /backend/env na baze produkcyjną, zrobić migracje tak jak się robi lokalnie.