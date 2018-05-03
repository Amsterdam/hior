# HIOR

> Handboek Inrichting Openbare Ruimte

Het HIOR is een integrale verzameling van het vigerend beleid voor de inrichting van de openbare ruimte in Amsterdam.
Het HIOR helpt opdrachtgevers, projectleiders, ontwerpers, adviseurs en beheerders om invuilling te geven aan het Amsterdamse beleid.

In deze applicatie kan beleid worden gezocht:
- Per thema, bijvoorbeeld 'fiets', 'voetganger', 'groen', 'water & oevers' en 'straatmeubilair'
- Per beleidsproduct, bijvoorbeeld alle hoofdlijnen van de 'visie openbare ruimte' of de 'nota parkeernormen'

De data hiervoor wordt door An-Jes Oudshoorn bijgehouden in de spreadsheet.
Het spreadsheet en de bijbehorende documenten en plaatjes bevinden zich in Objectstore.

De documenten en plaatjes worden direct van Objectstore gelezen (objectstore service)

Het spreadsheet wordt eerst verwerkt en vertaald.
Vervolgens wordt de data via een API (vsd/hior_... endpoints) beschikbaar gesteld voor verdere verwerking.
In [https://github.com/Amsterdam/various_small_datasets/tree/master/src/hior/import] bevindt zich de code daarvoor.

## Requirements

### for development

    node >= 6.0
    npm >= 3.0
    
### for deployment

    docker
    docker-compose

## Build Setup, local development

    # install dependencies
    npm install

    # serve with hot reload at localhost:8080
    npm run dev

    # build for production with minification
    npm run build

    # run unit tests
    npm run unit

    # run eslint tests
    npm run lint

    # run unit and lint tests
    npm test

## Deployment

    docker-compose build
    docker-compose up

The app is exposed at localhost:8080

### Docker tests

    cd test
    docker-compose build
    docker-compose run test

## General structure of the app

The app is based upon the template_vue project.
A customized version of this project is maintained at [https://github.com/Amsterdam/template_vue]

The main logic is concentrated in the Search component and the hior service.

## Styling

The styling is done by using the stijl repository of Amsterdam and Bootstrap 4.
