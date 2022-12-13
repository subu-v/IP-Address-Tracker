"use strict";

const button = document.querySelector(".tracker__search--button");
const searchInput = document.querySelector(".tracker__search--input");
const ipField = document.querySelector(".tracker__data--ip");
const locationField = document.querySelector(".tracker__data--location");
const timezoneField = document.querySelector(".tracker__data--timezone");
const ispField = document.querySelector(".tracker__data--isp");
let map;

const getUserIpAddress = (async function () {
  const fetchIP = await fetch("https://api.ipify.org/?format=json");
  const userIP = await fetchIP.json();
  renderMap(userIP.ip);
})();

const renderData = function (data) {
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

const renderMarker = function (lat, lng) {
  const locationIcon = L.icon({
    iconUrl: require("../images/icon-location.svg"),
    iconSize: [36, 48],
  });

  L.marker([lat, lng], {
    icon: locationIcon,
  }).addTo(map);
};

const createMap = function (lat, lng) {
  map = L.map("map", { zoomControl: false }).setView([lat, lng], 13);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
  }).addTo(map);
};

const renderMap = async function (ip) {
  const fetchUserInfo = await fetch(
    `https://geo.ipify.org/api/v2/country,city?apiKey=at_VpIUevGOjDKfNMddcE6asZ7G4HBX5&ipAddress=${ip}`
  );
  const retrievedData = await fetchUserInfo.json();
  renderData(retrievedData);

  const {
    location: { lat, lng },
  } = retrievedData;

  createMap(lat, lng);
  renderMarker(lat, lng);
};

button.addEventListener("click", function (e) {
  map.remove();
  renderMap(searchInput.value);
});
