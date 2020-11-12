let db = require("./models");
let cities = require("./city.list.json");
//const fs = require("fs");

for (city of cities) {
    db.city
        .findOrCreate({
            where: { open_weather_map_id: city.id },
            defaults: {
                city_name: city.name,
                state: city.state,
                country: city.country,
            },
        })
        .catch((err) => console.log(err));
}
console.log(cities[0]);
