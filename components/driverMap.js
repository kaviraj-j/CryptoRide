import React, { useEffect, useRef, useState } from "react";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { useContext } from "react";
import { Component } from "react";
import { FaMapMarkerAlt } from 'react-icons/fa';
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { UberContext } from "../context/uberContext";
import { ApiError } from "next/dist/server/api-utils";
const style = {
  wrapper: `flex-1 h-full w-full`,
};

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export const Map = () => {
  const [directions, setDirections] = useState([]);
  const [map, setMap] = useState(null);
  var driverMarkerRef = useRef(null);
  const {
    pickupCoordinates,
    dropoffCoordinates,
    setDriverCoordinates,
    driverCoordinates,
    selectedRideId,
  } = useContext(UberContext);
  const [currentDirectionIndex, setCurrentDirectionIndex] = useState(0);

  const handlePrevClick = () => {
    const newDirectionIndex = Math.max(0, currentDirectionIndex - 1);
    setDriverCoordinates({
      longitude: directions[newDirectionIndex].maneuver.location[0],
      latitude: directions[newDirectionIndex].maneuver.location[1],
    });
    setCurrentDirectionIndex(newDirectionIndex);
  };

  const handleNextClick = () => {
    const nextIndex = Math.min(
      directions.length - 1,
      currentDirectionIndex + 1
    );
    setDriverCoordinates({
      longitude: directions[nextIndex].maneuver.location[0],
      latitude: directions[nextIndex].maneuver.location[1],
    });
    setCurrentDirectionIndex(nextIndex);
  };

  const currentDirection = directions[currentDirectionIndex] || {};

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setDriverCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      });
      console.log(driverCoordinates);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }, []);

  const rideComplete = async () => {
    console.log("called ride completed , current ride id = " + selectedRideId);
    await fetch(
      `api/db/changeRideStatus?_id=${selectedRideId}&status=completed`
    );
  };

  const startRide = async () =>{
    console.log("Changing ride status to started.")
    await fetch(
      `api/db/changeRideStatus?_id=${selectedRideId}&status=ongoing`
    );
  }

  useEffect(() => {
    console.log("Checking driver coordinates");
    if (
      dropoffCoordinates &&
      driverCoordinates.longitude == dropoffCoordinates[0] &&
      driverCoordinates.latitude == dropoffCoordinates[1]
    ) {
      rideComplete();
    }
    if (
      dropoffCoordinates &&
      driverCoordinates.longitude == pickupCoordinates[0] &&
      driverCoordinates.latitude == pickupCoordinates[1]
    ) {
      startRide();
    }
  }, [driverCoordinates]);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: "map",
      // style: 'mapbox://styles/drakosi/ckvcwq3rwdw4314o3i2ho8tph',
      style: "mapbox://styles/mapbox/streets-v12",
      center: [88.363881, 22.572672],
      zoom: 10,
    });
    setMap(map);
    map.on("load", async () => {
      if (pickupCoordinates) {
        addToMap(map, pickupCoordinates);
      }

      if (dropoffCoordinates) {
        addToMap(map, dropoffCoordinates);
      }

      if (driverCoordinates && pickupCoordinates && dropoffCoordinates) {
        try {
          // Get the route information using Mapbox Directions API
          const response = await fetch(
            `https://api.mapbox.com/directions/v5/mapbox/driving/${driverCoordinates.longitude},${driverCoordinates.latitude};${pickupCoordinates[0]},${pickupCoordinates[1]};${dropoffCoordinates[0]},${dropoffCoordinates[1]}?geometries=geojson&steps=true&access_token=${mapboxgl.accessToken}`
          );
          const data = await response.json();
          const route = data.routes[0].geometry;

          const directions = data.routes.flatMap((route) =>
            route.legs.flatMap((leg) => leg.steps)
          );
          console.log(data.routes[0].legs[0].steps);
          directions.splice(data.routes[0].legs[0].steps.length, 0, {
            maneuver: {
              instruction: "You have reached the pickup location.",
              location: [pickupCoordinates[0], pickupCoordinates[1]],
            },
          });
          directions.push({
            maneuver: {
              instruction: "You have reached your destination.",
              location: [dropoffCoordinates[0], dropoffCoordinates[1]],
            },
          });
          // Set the directions array and current leg to the first leg
          setDirections(directions);

          console.log(directions);

          // Add the route as a source and layer on the map
          map.addSource("route", {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: route,
            },
          });

          map.addLayer({
            id: "route",
            type: "line",
            source: "route",
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "blue",
              "line-width": 3,
            },
          });

          // Add markers for pickup and dropoff coordinates
          const pickupMarker = new mapboxgl.Marker()
            .setLngLat(pickupCoordinates)
            .addTo(map);
          const dropoffMarker = new mapboxgl.Marker()
            .setLngLat(dropoffCoordinates)
            .addTo(map);
          const driverStartmarker = new mapboxgl.Marker()
            .setLngLat([
              driverCoordinates.longitude,
              driverCoordinates.latitude,
            ])
            .addTo(map);

          const driverMarker = new mapboxgl.Marker({
            draggable: true,
            color: "#73094c",
          })
            .setLngLat([
              driverCoordinates.longitude,
              driverCoordinates.latitude,
            ])
            .addTo(map);
          driverMarkerRef.current = driverMarker;
          // Fit the map to the bounds of the route and markers
          const bounds = route.coordinates.reduce(
            (bounds, coord) => bounds.extend(coord),
            new mapboxgl.LngLatBounds()
              .extend(pickupCoordinates)
              .extend(dropoffCoordinates)
          );
          map.fitBounds(bounds, { padding: 100 });
        } catch (error) {
          console.error(error);
        }
      }
    });
  }, [pickupCoordinates, dropoffCoordinates]);

  useEffect(() => {
    if (driverMarkerRef.current) {
      //console.log(driverMarkerRef.current.getLngLat());
      driverMarkerRef.current.setLngLat([
        driverCoordinates.longitude,
        driverCoordinates.latitude,
      ]);
    }
  }, [driverCoordinates]);
  const addToMap = (map, coordinates) => {
    const marker1 = new mapboxgl.Marker().setLngLat(coordinates).addTo(map);
  };

  return (
    <div className="font-readex">
      <div className={style.wrapper}>Map</div>
      {directions.length > 0 && (
        <div className="text-lg text-center fixed top-20 right-0 z-20 bg-slate-50 mx-4 p-5 rounded-xl w-80">
          <h2 className="text-center font-semibold border-b-2">Directions </h2>
          <div className="flex flex-row justify-center items-center border-2 border-bg-slate-50">
            <FaMapMarkerAlt style={{color: '#72094C'}}/>
            <p> - You are here</p>
          </div>
          <p>
            {currentDirection.maneuver && currentDirection.maneuver.instruction}
          </p>
          <div className="flex justify-between mt-2">
            <button
              onClick={handlePrevClick}
              disabled={currentDirectionIndex === 0}
            >
              <BsArrowLeft />
            </button>
            <button
              onClick={handleNextClick}
              disabled={currentDirectionIndex === directions.length - 1}
            >
              <BsArrowRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;
