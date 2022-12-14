"use strict";

const button = document.querySelector(".tracker__search--button");
const searchInput = document.querySelector(".tracker__search--input");
const errorElement = document.querySelector(".tracker__search--error");
const ipField = document.querySelector(".tracker__data--ip");
const locationField = document.querySelector(".tracker__data--location");
const timezoneField = document.querySelector(".tracker__data--timezone");
const ispField = document.querySelector(".tracker__data--isp");

let map;
// (IIFE function) helps to render map and data based on the user's current IP address
const getUserIpAddress = (async function () {
  try {
    const fetchIP = await fetch("https://api.ipify.org/?format=json");
    const userIP = await fetchIP.json();
    renderMap(userIP.ip);
  } catch (error) {
    errorElement.textContent = "Unable to fetch your ip address";
  }
})();

const renderData = function (data) {
  // Destructuring
  const {
    ip,
    location: { city, region, postalCode, timezone },
    isp,
  } = data;

  ipField.textContent = ip;
  locationField.textContent = `${city}, ${region} ${postalCode}`;
  timezoneField.textContent = `UTC ${timezone}`;
  ispField.textContent = isp;
};

const createMap = function (lat, lng) {
  // Initialize Map object

  map = L.map("map", { zoomControl: false }).setView([lat, lng], 13);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    crossOrigin: true,
  }).addTo(map);

  renderMarker(lat, lng);
};

const renderMarker = function (lat, lng) {
  const locationIcon = L.icon({
    iconUrl: require("../images/icon-location.svg"),
    iconSize: [36, 48],
  });

  L.marker([lat, lng], {
    icon: locationIcon,
  }).addTo(map);
};

const renderMap = async function (ip) {
  try {
    const fetchUserInfo = await fetch(
      `https://geo.ipify.org/api/v2/country,city?apiKey=at_zhl5fqzTyMPwPPeCqS9cHPq3W1HIJ&ipAddress=${ip}`
    );
    const retrievedData = await fetchUserInfo.json();

    // This function helps to display the retrieved data on the UI
    renderData(retrievedData);

    const {
      location: { lat, lng },
    } = retrievedData;

    // Creates a new map object
    createMap(lat, lng);
    console.log("%c Map successfully created", "color:green; font-weight:bold");
  } catch (error) {
    console.trace(error);
    console.error(error);
    errorElement.textContent = "Invalid IP address or Domain name";
  }
};

button.addEventListener("click", function (e) {
  // Remove Error element text
  errorElement.textContent = "";

  // Remove map object
  map.remove();

  // render the map
  renderMap(searchInput.value);
});
