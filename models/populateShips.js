const populateShipsArray = [
  {
    name: "Galileo",
    speedInKmHr: 7.5e+6,
    capacity: 2000,
    captain: "Andrea Fettucini",
    flightAttendants: ["Mercrutio", "Romeo", "Juliet"],
    image: "/imgs/galileo.png"
  },
  {
    name: "Osiris",
    speedInKmHr: 1e+8,
    capacity: 50,
    captain: "Jeff Bezos",
    flightAttendants: ["Alexa", "Siri", "Hey Google"],
    image: "/imgs/osiris.png"
  },
  {
    name: "Valkyrie",
    speedInKmHr: 6.8e+6,
    capacity: 1500,
    captain: "Chris Tucker",
    flightAttendants: ["Petra", "Ulysses"],
    image: "/imgs/valkyrie.png"
  }
]

module.exports = populateShipsArray;

// Nice work for your seed data, however, you would probably want to seperate this file into a seperate directory.