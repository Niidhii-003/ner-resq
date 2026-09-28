import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  CircleMarker,
  useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./App.css";

// --------------------------------------------------
// LEAFLET ICON FIX
// --------------------------------------------------

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// --------------------------------------------------
// LOCATIONS
// --------------------------------------------------

const locations = {
  Guwahati: [26.1445, 91.7362],
  Gangtok: [27.3389, 88.6065],
  Shillong: [25.5788, 91.8933],
  Itanagar: [27.0844, 93.6053],
};

// --------------------------------------------------
// LOCATION FEATURES
// --------------------------------------------------

const locationFeatures = {
  Guwahati: {
    Rainfall_mm: 8.5,
    Slope_Angle: 7.5,
    Soil_Saturation: 0.18,
    Vegetation_Cover: 0.48,
    Rainfall_3Day: 62.0,
    Rainfall_7Day: 310.0,
    Aspect: 120.0,
    Elevation_m: 55.0,
    NDVI_Index: 0.31,
    Land_Use_Urban: 1.0,
    Land_Use_Forest: 0.0,
    Land_Use_Agriculture: 0.0,
    Earthquake_Activity: 3.2,
    Proximity_to_Water: 0.25,
    Distance_to_Road_m: 500.0,
    Temperature_C: 27.0,
    Humidity_percent: 72.0,
    Soil_pH: 6.8,
    Clay_Content: 45.0,
    Sand_Content: 38.0,
    Silt_Content: 17.0,
    Soil_Erosion_Rate: 22.0,
    Historical_Landslide_Count: 0.0,
    Soil_Type_Gravel: 0.0,
    Soil_Type_Sand: 0.0,
    Soil_Type_Silt: 1.0,
    Soil_Type_Clay: 0.0,
    Pore_Water_Pressure_kPa: 55.0,
    Soil_Moisture_Content: 0.20,
    Microseismic_Activity: 0.30,
    Acoustic_Emission_dB: 25.0,
    Soil_Strain: 0.002,
    Soil_Temperature_C: 22.0,
    TDR_Reflection_Index: 0.35,
    Rainfall_Accumulation_Index: 180.0,
    Rainfall_Intensity_Index: 0.012,
    Short_Long_Rainfall_Ratio: 0.10,
    Slope_Rainfall_Index: 64.0,
    Moisture_Saturation_Index: 0.04,
    Water_Pressure_Risk_Index: 12.0,
  },

  Gangtok: {
    Rainfall_mm: 22.5,
    Slope_Angle: 31.5,
    Soil_Saturation: 0.62,
    Vegetation_Cover: 0.68,
    Rainfall_3Day: 165.0,
    Rainfall_7Day: 780.0,
    Aspect: 142.0,
    Elevation_m: 1547.0,
    NDVI_Index: 0.35,
    Land_Use_Urban: 1.0,
    Land_Use_Forest: 1.0,
    Land_Use_Agriculture: 0.0,
    Earthquake_Activity: 5.5,
    Proximity_to_Water: 0.34,
    Distance_to_Road_m: 880.0,
    Temperature_C: 18.0,
    Humidity_percent: 82.0,
    Soil_pH: 6.9,
    Clay_Content: 56.0,
    Sand_Content: 27.0,
    Silt_Content: 17.0,
    Soil_Erosion_Rate: 47.0,
    Historical_Landslide_Count: 4.0,
    Soil_Type_Gravel: 0.0,
    Soil_Type_Sand: 0.0,
    Soil_Type_Silt: 1.0,
    Soil_Type_Clay: 0.0,
    Pore_Water_Pressure_kPa: 95.0,
    Soil_Moisture_Content: 0.48,
    Microseismic_Activity: 0.56,
    Acoustic_Emission_dB: 34.0,
    Soil_Strain: 0.0047,
    Soil_Temperature_C: 16.9,
    TDR_Reflection_Index: 0.53,
    Rainfall_Accumulation_Index: 410.0,
    Rainfall_Intensity_Index: 0.019,
    Short_Long_Rainfall_Ratio: 0.15,
    Slope_Rainfall_Index: 267.0,
    Moisture_Saturation_Index: 0.058,
    Water_Pressure_Risk_Index: 22.5,
  },

  Shillong: {
    Rainfall_mm: 19.5,
    Slope_Angle: 24.0,
    Soil_Saturation: 0.52,
    Vegetation_Cover: 0.72,
    Rainfall_3Day: 145.0,
    Rainfall_7Day: 690.0,
    Aspect: 155.0,
    Elevation_m: 1496.0,
    NDVI_Index: 0.42,
    Land_Use_Urban: 1.0,
    Land_Use_Forest: 1.0,
    Land_Use_Agriculture: 0.0,
    Earthquake_Activity: 4.6,
    Proximity_to_Water: 0.30,
    Distance_to_Road_m: 720.0,
    Temperature_C: 19.5,
    Humidity_percent: 80.0,
    Soil_pH: 6.7,
    Clay_Content: 51.0,
    Sand_Content: 31.0,
    Silt_Content: 18.0,
    Soil_Erosion_Rate: 39.0,
    Historical_Landslide_Count: 3.0,
    Soil_Type_Gravel: 0.0,
    Soil_Type_Sand: 0.0,
    Soil_Type_Silt: 1.0,
    Soil_Type_Clay: 0.0,
    Pore_Water_Pressure_kPa: 82.0,
    Soil_Moisture_Content: 0.42,
    Microseismic_Activity: 0.46,
    Acoustic_Emission_dB: 31.0,
    Soil_Strain: 0.0038,
    Soil_Temperature_C: 17.8,
    TDR_Reflection_Index: 0.47,
    Rainfall_Accumulation_Index: 350.0,
    Rainfall_Intensity_Index: 0.017,
    Short_Long_Rainfall_Ratio: 0.14,
    Slope_Rainfall_Index: 220.0,
    Moisture_Saturation_Index: 0.052,
    Water_Pressure_Risk_Index: 19.0,
  },

  Itanagar: {
    Rainfall_mm: 21.0,
    Slope_Angle: 28.0,
    Soil_Saturation: 0.58,
    Vegetation_Cover: 0.76,
    Rainfall_3Day: 155.0,
    Rainfall_7Day: 730.0,
    Aspect: 135.0,
    Elevation_m: 350.0,
    NDVI_Index: 0.46,
    Land_Use_Urban: 1.0,
    Land_Use_Forest: 1.0,
    Land_Use_Agriculture: 0.0,
    Earthquake_Activity: 5.0,
    Proximity_to_Water: 0.28,
    Distance_to_Road_m: 650.0,
    Temperature_C: 23.0,
    Humidity_percent: 84.0,
    Soil_pH: 6.6,
    Clay_Content: 53.0,
    Sand_Content: 30.0,
    Silt_Content: 17.0,
    Soil_Erosion_Rate: 44.0,
    Historical_Landslide_Count: 3.0,
    Soil_Type_Gravel: 0.0,
    Soil_Type_Sand: 0.0,
    Soil_Type_Silt: 1.0,
    Soil_Type_Clay: 0.0,
    Pore_Water_Pressure_kPa: 90.0,
    Soil_Moisture_Content: 0.46,
    Microseismic_Activity: 0.52,
    Acoustic_Emission_dB: 33.0,
    Soil_Strain: 0.0042,
    Soil_Temperature_C: 19.0,
    TDR_Reflection_Index: 0.50,
    Rainfall_Accumulation_Index: 390.0,
    Rainfall_Intensity_Index: 0.018,
    Short_Long_Rainfall_Ratio: 0.15,
    Slope_Rainfall_Index: 250.0,
    Moisture_Saturation_Index: 0.055,
    Water_Pressure_Risk_Index: 21.0,
  },
};

// --------------------------------------------------
// RAINFALL RISK
// --------------------------------------------------

const rainfallRiskByLocation = {
  Guwahati: 0.35,
  Gangtok: 0.70,
  Shillong: 0.65,
  Itanagar: 0.68,
};

// --------------------------------------------------
// ROUTES
// --------------------------------------------------

const routes = [
  {
    id: "guwahati-shillong",
    name: "Guwahati → Shillong Corridor",
    start: "Guwahati",
    end: "Shillong",
    distance: 98,
    time: "2h 30m",
    exposure: 0.85,
    path: [
      [26.1445, 91.7362],
      [26.02, 91.82],
      [25.82, 91.86],
      [25.5788, 91.8933],
    ],
  },

  {
    id: "shillong-gangtok",
    name: "Shillong → Gangtok Corridor",
    start: "Shillong",
    end: "Gangtok",
    distance: 420,
    time: "10h 30m",
    exposure: 1.05,
    path: [
      [25.5788, 91.8933],
      [25.85, 91.45],
      [26.35, 90.65],
      [26.85, 89.75],
      [27.3389, 88.6065],
    ],
  },

  {
    id: "guwahati-itanagar",
    name: "Guwahati → Itanagar Corridor",
    start: "Guwahati",
    end: "Itanagar",
    distance: 330,
    time: "7h 30m",
    exposure: 0.95,
    path: [
      [26.1445, 91.7362],
      [26.35, 92.15],
      [26.65, 92.65],
      [26.9, 93.15],
      [27.0844, 93.6053],
    ],
  },
];

// --------------------------------------------------
// SIMULATED GPS VEHICLES
// --------------------------------------------------

const vehicleData = [
  {
    id: "NR-104",
    commodity: "Medicines",
    quantity: "120 boxes",
    start: "Guwahati",
    destination: "Shillong",
    routeId: "guwahati-shillong",
    progress: 0.64,
    speed: 38,
    status: "ON ROUTE",
  },

  {
    id: "NR-218",
    commodity: "Food Supplies",
    quantity: "2.4 tonnes",
    start: "Shillong",
    destination: "Gangtok",
    routeId: "shillong-gangtok",
    progress: 0.42,
    speed: 31,
    status: "ON ROUTE",
  },

  {
    id: "NR-307",
    commodity: "Construction Material",
    quantity: "4.8 tonnes",
    start: "Guwahati",
    destination: "Itanagar",
    routeId: "guwahati-itanagar",
    progress: 0.72,
    speed: 35,
    status: "ON ROUTE",
  },

  {
    id: "NR-412",
    commodity: "Agricultural Produce",
    quantity: "1.8 tonnes",
    start: "Itanagar",
    destination: "Guwahati",
    routeId: "guwahati-itanagar",
    progress: 0.27,
    speed: 42,
    status: "ON ROUTE",
  },
];

// --------------------------------------------------
// GPS POSITION INTERPOLATION
// --------------------------------------------------

function getPositionAlongRoute(path, progress) {
  if (!path || path.length === 0) {
    return [0, 0];
  }

  if (progress <= 0) {
    return path[0];
  }

  if (progress >= 1) {
    return path[path.length - 1];
  }

  const totalSegments = path.length - 1;

  const scaledProgress =
    progress * totalSegments;

  const segmentIndex = Math.min(
    Math.floor(scaledProgress),
    totalSegments - 1
  );

  const localProgress =
    scaledProgress - segmentIndex;

  const start = path[segmentIndex];
  const end = path[segmentIndex + 1];

  const lat =
    start[0] +
    (end[0] - start[0]) *
      localProgress;

  const lng =
    start[1] +
    (end[1] - start[1]) *
      localProgress;

  return [lat, lng];
}

// --------------------------------------------------
// TIME PARSER
// --------------------------------------------------

function parseTimeToMinutes(time) {
  const hours = time.match(/(\d+)h/);
  const minutes = time.match(/(\d+)m/);

  const h = hours ? Number(hours[1]) : 0;
  const m = minutes ? Number(minutes[1]) : 0;

  return h * 60 + m;
}

// --------------------------------------------------
// RISK LEVEL
// --------------------------------------------------

function getRiskLevel(score) {
  if (score < 0.30) return "LOW";
  if (score < 0.60) return "MODERATE";
  if (score < 0.80) return "HIGH";
  return "CRITICAL";
}

// --------------------------------------------------
// RISK SEVERITY VALUE
// --------------------------------------------------

function getRiskSeverity(level) {
  if (level === "CRITICAL") return 4;
  if (level === "HIGH") return 3;
  if (level === "MODERATE") return 2;
  return 1;
}

// --------------------------------------------------
// RISK ZONE COLORS
// --------------------------------------------------

function getRiskZoneColor(level) {
  if (level === "CRITICAL") {
    return "#dc2626";
  }

  if (level === "HIGH") {
    return "#f97316";
  }

  if (level === "MODERATE") {
    return "#eab308";
  }

  return "#16a34a";
}

function getRiskZoneWeight(level) {
  if (level === "CRITICAL") return 12;
  if (level === "HIGH") return 10;
  if (level === "MODERATE") return 8;
  return 7;
}

function getRiskZoneOpacity(level) {
  if (level === "CRITICAL") return 0.90;
  if (level === "HIGH") return 0.80;
  if (level === "MODERATE") return 0.65;
  return 0.50;
}

// --------------------------------------------------
// LOCATION HAZARD
// --------------------------------------------------

function getLocationHazard(location) {
  const feature = locationFeatures[location];

  if (!feature) {
    return 0.35;
  }

  const rainfallRisk =
    rainfallRiskByLocation[location] ?? 0.35;

  const slopeRisk = Math.min(
    feature.Slope_Angle / 45,
    1
  );

  const saturationRisk = Math.min(
    feature.Soil_Saturation,
    1
  );

  const historicalRisk = Math.min(
    feature.Historical_Landslide_Count / 5,
    1
  );

  const erosionRisk = Math.min(
    feature.Soil_Erosion_Rate / 60,
    1
  );

  const environmentalRisk =
    0.30 * rainfallRisk +
    0.25 * slopeRisk +
    0.20 * saturationRisk +
    0.15 * historicalRisk +
    0.10 * erosionRisk;

  return Math.min(
    Math.max(environmentalRisk, 0),
    1
  );
}

// --------------------------------------------------
// ROUTE HELPERS
// --------------------------------------------------

function isRouteRelevant(
  route,
  selectedLocation
) {
  return (
    route.start === selectedLocation ||
    route.end === selectedLocation
  );
}

function getRouteDestination(
  route,
  selectedLocation
) {
  if (route.start === selectedLocation) {
    return route.end;
  }

  if (route.end === selectedLocation) {
    return route.start;
  }

  return null;
}

// --------------------------------------------------
// ROUTE RANKING
// --------------------------------------------------

function calculateRouteRanking(
  selectedLocation,
  currentHazardScore
) {
  const applicableRoutes = routes.filter(
    (route) =>
      isRouteRelevant(
        route,
        selectedLocation
      )
  );

  if (applicableRoutes.length === 0) {
    return [];
  }

  const maxDistance = Math.max(
    ...applicableRoutes.map(
      (route) => route.distance
    )
  );

  const maxTime = Math.max(
    ...applicableRoutes.map(
      (route) =>
        parseTimeToMinutes(route.time)
    )
  );

  const rankedRoutes =
    applicableRoutes.map((route) => {
      const destination =
        getRouteDestination(
          route,
          selectedLocation
        );

      const selectedHazard =
        currentHazardScore > 0
          ? currentHazardScore
          : getLocationHazard(
              selectedLocation
            );

      const destinationHazard =
        getLocationHazard(
          destination
        );

      const corridorHazard =
        (selectedHazard +
          destinationHazard) /
        2;

      const exposureAdjustedHazard =
        Math.min(
          corridorHazard *
            route.exposure,
          1
        );

      const distanceComponent =
        route.distance /
        maxDistance;

      const timeComponent =
        parseTimeToMinutes(
          route.time
        ) / maxTime;

      const riskScore =
        0.65 *
          exposureAdjustedHazard +
        0.20 *
          distanceComponent +
        0.15 *
          timeComponent;

      return {
        ...route,
        destination,
        corridorHazard,
        exposureAdjustedHazard,
        distanceComponent,
        timeComponent,
        riskScore,
        riskLevel:
          getRiskLevel(riskScore),
      };
    });

  rankedRoutes.sort(
    (a, b) =>
      a.riskScore - b.riskScore
  );

  return rankedRoutes;
}

// --------------------------------------------------
// ROUTE EXPLANATION
// --------------------------------------------------

function getRouteExplanation(route) {
  if (!route) {
    return "";
  }

  const hazard = (
    route.exposureAdjustedHazard * 100
  ).toFixed(1);

  const distance = (
    route.distanceComponent * 100
  ).toFixed(0);

  const time = (
    route.timeComponent * 100
  ).toFixed(0);

  if (route.riskLevel === "LOW") {
    return `Selected because it has the lowest combined route risk, with ${hazard}% exposure-adjusted hazard, ${route.distance} km distance and ${route.time} estimated travel time.`;
  }

  if (route.riskLevel === "MODERATE") {
    return `Selected as the lowest-risk available corridor. Its score considers ${hazard}% exposure-adjusted hazard, ${distance}% normalized distance and ${time}% normalized travel time.`;
  }

  if (route.riskLevel === "HIGH") {
    return `Ranked first among the available demonstration corridors, but the route remains elevated risk due to environmental hazard exposure.`;
  }

  return `Ranked first among the available demonstration corridors, but the route is classified as critical and should be treated with caution.`;
}

// --------------------------------------------------
// MAP CENTER
// --------------------------------------------------

function MapCenter({ position }) {
  const map = useMap();

  useEffect(() => {
    map.setView(position, 7);
  }, [map, position]);

  return null;
}

// --------------------------------------------------
// VEHICLE ROUTE RISK
// --------------------------------------------------

function calculateVehicleRouteRisk(route) {
  if (!route) {
    return 0.35;
  }

  const startHazard =
    getLocationHazard(route.start);

  const endHazard =
    getLocationHazard(route.end);

  const corridorHazard =
    (startHazard + endHazard) / 2;

  return Math.min(
    corridorHazard * route.exposure,
    1
  );
}

// --------------------------------------------------
// DYNAMIC VEHICLE ZONE RISK
// --------------------------------------------------

function calculateCurrentVehicleRisk(
  vehicle,
  route,
  progress
) {
  if (!route) {
    return 0.35;
  }

  const routeProgress =
    vehicle.start === route.start
      ? progress
      : 1 - progress;

  const startHazard =
    getLocationHazard(route.start);

  const endHazard =
    getLocationHazard(route.end);

  const currentCorridorHazard =
    startHazard +
    (endHazard - startHazard) *
      routeProgress;

  const currentRisk = Math.min(
    currentCorridorHazard *
      route.exposure,
    1
  );

  return currentRisk;
}

// --------------------------------------------------
// RISK-BASED ETA DELAY
// --------------------------------------------------

function getRiskDelayMultiplier(riskLevel) {
  if (riskLevel === "CRITICAL") {
    return 0.60;
  }

  if (riskLevel === "HIGH") {
    return 0.30;
  }

  if (riskLevel === "MODERATE") {
    return 0.10;
  }

  return 0;
}

// --------------------------------------------------
// FORMAT ETA
// --------------------------------------------------

function formatEta(minutes) {
  const safeMinutes = Math.max(
    0,
    Math.round(minutes)
  );

  return `${Math.floor(
    safeMinutes / 60
  )}h ${safeMinutes % 60}m`;
}

// --------------------------------------------------
// VEHICLE STATUS
// --------------------------------------------------

function getVehicleStatus(
  vehicle,
  currentVehicleRisk
) {
  if (currentVehicleRisk >= 0.80) {
    return "CRITICAL RISK";
  }

  if (currentVehicleRisk >= 0.60) {
    return "HIGH RISK";
  }

  if (currentVehicleRisk >= 0.30) {
    return "CAUTION";
  }

  if (vehicle.progress >= 0.95) {
    return "NEAR DESTINATION";
  }

  return "ON ROUTE";
}

// --------------------------------------------------
// FIND SAFER ALTERNATIVE ROUTE
// --------------------------------------------------

function getSaferVehicleRoute(
  vehicle,
  currentRiskScore
) {
  if (
    currentRiskScore < 0.60
  ) {
    return null;
  }

  const alternatives =
    routes
      .filter(
        (route) =>
          route.id !==
            vehicle.routeId &&
          (
            route.start ===
              vehicle.start ||
            route.end ===
              vehicle.start ||
            route.start ===
              vehicle.destination ||
            route.end ===
              vehicle.destination
          )
      )
      .map((route) => {
        const riskScore =
          calculateVehicleRouteRisk(
            route
          );

        return {
          ...route,
          riskScore,
          riskLevel:
            getRiskLevel(
              riskScore
            ),
        };
      })
      .sort(
        (a, b) =>
          a.riskScore -
          b.riskScore
      );

  if (
    alternatives.length === 0
  ) {
    return null;
  }

  const safest =
    alternatives[0];

  if (
    safest.riskScore <
    currentRiskScore
  ) {
    return safest;
  }

  return null;
}

// --------------------------------------------------
// VEHICLE RECOMMENDED ACTION
// --------------------------------------------------

function getVehicleRecommendedAction(
  vehicle,
  riskLevel,
  recommendedRoute
) {
  if (riskLevel === "CRITICAL") {
    if (recommendedRoute) {
      return `Immediate action: reroute ${vehicle.id} through ${recommendedRoute.start} → ${recommendedRoute.end}.`;
    }

    return `Immediate action: stop/reassess ${vehicle.id} before continuing through the critical-risk corridor.`;
  }

  if (riskLevel === "HIGH") {
    if (recommendedRoute) {
      return `Recommended action: reroute ${vehicle.id} through ${recommendedRoute.start} → ${recommendedRoute.end}.`;
    }

    return `Recommended action: slow down and reassess the current corridor.`;
  }

  if (riskLevel === "MODERATE") {
    return `Continue monitoring ${vehicle.id}; maintain caution in the current corridor.`;
  }

  return `No immediate action required. Continue normal monitoring.`;
}

// --------------------------------------------------
// VEHICLE RISK ALERT
// --------------------------------------------------

function getVehicleRiskAlert(
  vehicle,
  route,
  progress
) {
  const riskScore =
    calculateCurrentVehicleRisk(
      vehicle,
      route,
      progress
    );

  const riskLevel =
    getRiskLevel(riskScore);

  const recommendedRoute =
    getSaferVehicleRoute(
      vehicle,
      riskScore
    );

  const recommendedAction =
    getVehicleRecommendedAction(
      vehicle,
      riskLevel,
      recommendedRoute
    );

  let message;

  if (riskLevel === "CRITICAL") {
    message = `${vehicle.id} has entered a critical-risk corridor. Immediate route reassessment recommended.`;
  } else if (riskLevel === "HIGH") {
    message = `${vehicle.id} has entered a high-risk corridor. Safer route recommended.`;
  } else if (riskLevel === "MODERATE") {
    message = `${vehicle.id} is travelling through a moderate-risk corridor and is being monitored.`;
  } else {
    message = `${vehicle.id} is travelling through a low-risk corridor.`;
  }

  return {
    score: riskScore,
    level: riskLevel,
    message,
    recommendedRoute,
    recommendedAction,
  };
}

// --------------------------------------------------
// MAIN APP
// --------------------------------------------------

function App() {
  const [selectedLocation, setSelectedLocation] =
    useState("Guwahati");

  const [prediction, setPrediction] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [backendStatus, setBackendStatus] =
    useState("checking");

  const [vehicleProgress, setVehicleProgress] =
    useState(
      vehicleData.map(
        (vehicle) => vehicle.progress
      )
    );

  const currentFeatures =
    locationFeatures[selectedLocation];

  // ------------------------------------------------
  // SIMULATED GPS MOVEMENT
  // ------------------------------------------------

  useEffect(() => {
    const interval = setInterval(() => {
      setVehicleProgress((previous) =>
        previous.map((progress, index) => {
          const vehicle =
            vehicleData[index];

          const increment =
            vehicle.speed /
            (vehicle.routeId ===
            "shillong-gangtok"
              ? 450000
              : 30000);

          const next =
            progress + increment;

          return next >= 1
            ? 0.02
            : next;
        })
      );
    }, 1000);

    return () =>
      clearInterval(interval);
  }, []);

  // ------------------------------------------------
  // AI RISK ANALYSIS
  // ------------------------------------------------

  const runAnalysis = async () => {
    setLoading(true);
    setError("");
    setBackendStatus("checking");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/predict-risk",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            features: currentFeatures,
            rainfall_risk:
              rainfallRiskByLocation[
                selectedLocation
              ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Backend returned ${response.status}`
        );
      }

      const data =
        await response.json();

      setPrediction(data);
      setBackendStatus("online");
    } catch (err) {
      console.error(err);

      setBackendStatus("offline");

      setError(
        "Unable to connect to NER-RESQ backend. Make sure FastAPI is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------------
  // HAZARD VALUES
  // ------------------------------------------------

  const hazardScore = prediction
    ? Number(
        prediction.hazard_score ??
          prediction.hazardScore ??
          0
      )
    : 0;

  const landslideProbability =
    prediction
      ? Number(
          prediction.landslide_probability ??
            prediction.landslideProbability ??
            0
        )
      : 0;

  const rainfallRisk =
    rainfallRiskByLocation[
      selectedLocation
    ];

  const riskLevel =
    prediction?.risk_level ??
    prediction?.hazard_level ??
    getRiskLevel(hazardScore);

  // ------------------------------------------------
  // ROUTE RANKING
  // ------------------------------------------------

  const routeRankings = useMemo(() => {
    const routeHazard =
      prediction
        ? hazardScore
        : getLocationHazard(
            selectedLocation
          );

    return calculateRouteRanking(
      selectedLocation,
      routeHazard
    );
  }, [
    selectedLocation,
    prediction,
    hazardScore,
  ]);

  const recommendedRoute =
    routeRankings[0];

  // ------------------------------------------------
  // VEHICLE DISPLAY DATA
  // ------------------------------------------------

  const vehicles = useMemo(() => {
    return vehicleData.map(
      (vehicle, index) => {
        const route = routes.find(
          (item) =>
            item.id ===
            vehicle.routeId
        );

        const progress =
          vehicleProgress[index];

        const routeProgress =
          vehicle.start ===
          route.start
            ? progress
            : 1 - progress;

        const position =
          getPositionAlongRoute(
            route.path,
            routeProgress
          );

        const currentVehicleRisk =
          calculateCurrentVehicleRisk(
            vehicle,
            route,
            progress
          );

        const currentVehicleRiskLevel =
          getRiskLevel(
            currentVehicleRisk
          );

        const status =
          getVehicleStatus(
            {
              ...vehicle,
              progress,
            },
            currentVehicleRisk
          );

        // ------------------------------------------------
        // DIRECTION-AWARE ETA
        // ------------------------------------------------

        const remainingProgress =
          vehicle.start === route.start
            ? 1 - progress
            : progress;

        const remaining =
          Math.max(
            0,
            Math.round(
              remainingProgress *
                parseTimeToMinutes(
                  route.time
                )
            )
          );

        // ------------------------------------------------
        // RISK-ADJUSTED ETA
        // ------------------------------------------------

        const riskDelayMultiplier =
          getRiskDelayMultiplier(
            currentVehicleRiskLevel
          );

        const riskAdjustedRemaining =
          Math.max(
            0,
            Math.round(
              remaining *
                (1 +
                  riskDelayMultiplier)
            )
          );

        const baseEta =
          formatEta(remaining);

        const riskAdjustedEta =
          formatEta(
            riskAdjustedRemaining
          );

        const etaDelayMinutes =
          Math.max(
            0,
            riskAdjustedRemaining -
              remaining
          );

        return {
          ...vehicle,
          progress,
          position,
          status,
          currentVehicleRisk,
          currentVehicleRiskLevel,

          // Original ETA
          eta: baseEta,

          // Risk-adjusted ETA
          riskAdjustedEta,

          // Delay caused by risk
          etaDelayMinutes,

          // Delay percentage
          etaDelayPercentage:
            Math.round(
              riskDelayMultiplier * 100
            ),

          // Raw remaining minutes
          remaining,

          // Risk-adjusted remaining minutes
          riskAdjustedRemaining,
        };
      }
    );
  }, [
    vehicleProgress,
  ]);

  // ------------------------------------------------
  // DYNAMIC VEHICLE RISK ALERT DATA
  // ------------------------------------------------

  const vehicleAlerts = useMemo(() => {
    return vehicles.map(
      (vehicle, index) => {
        const route =
          routes.find(
            (item) =>
              item.id ===
              vehicle.routeId
          );

        const progress =
          vehicleProgress[index] ??
          vehicle.progress;

        const alert =
          getVehicleRiskAlert(
            vehicle,
            route,
            progress
          );

        return {
          ...vehicle,
          route,
          riskScore:
            alert.score,
          riskLevel:
            alert.level,
          riskMessage:
            alert.message,
          recommendedAction:
            alert.recommendedAction,
          inHighRiskZone:
            alert.level === "HIGH" ||
            alert.level === "CRITICAL",
          recommendedRoute:
            alert.recommendedRoute,
        };
      }
    );
  }, [
    vehicles,
    vehicleProgress,
  ]);

  const activeVehicleAlerts =
    vehicleAlerts.filter(
      (vehicle) =>
        vehicle.riskLevel === "HIGH" ||
        vehicle.riskLevel === "CRITICAL"
    );

  // ------------------------------------------------
  // DYNAMIC RISK-ZONE DATA
  // ------------------------------------------------

  const riskZoneData = useMemo(() => {
    return routes.map((route) => {
      const vehiclesOnRoute =
        vehicleAlerts.filter(
          (vehicle) =>
            vehicle.routeId ===
            route.id
        );

      const baseRisk =
        calculateVehicleRouteRisk(
          route
        );

      const highestVehicleRisk =
        vehiclesOnRoute.length > 0
          ? Math.max(
              ...vehiclesOnRoute.map(
                (vehicle) =>
                  vehicle.riskScore
              )
            )
          : 0;

      const riskScore =
        Math.max(
          baseRisk,
          highestVehicleRisk
        );

      const riskLevel =
        getRiskLevel(riskScore);

      return {
        ...route,
        riskScore,
        riskLevel,
        vehicleCount:
          vehiclesOnRoute.length,
      };
    });
  }, [vehicleAlerts]);

  // ------------------------------------------------
  // DYNAMIC DASHBOARD KPIs
  // ------------------------------------------------

  const dashboardKpis = useMemo(() => {
    const activeVehicles =
      vehicles.filter(
        (vehicle) =>
          vehicle.status !==
          "NEAR DESTINATION"
      ).length;

    const highRiskCorridors =
      riskZoneData.filter(
        (route) =>
          route.riskLevel === "HIGH" ||
          route.riskLevel === "CRITICAL"
      ).length;

    const criticalCorridors =
      riskZoneData.filter(
        (route) =>
          route.riskLevel ===
          "CRITICAL"
      ).length;

    const shipmentsAtRisk =
      vehicleAlerts.filter(
        (vehicle) =>
          vehicle.riskLevel === "HIGH" ||
          vehicle.riskLevel === "CRITICAL"
      ).length;

    return {
      activeVehicles,
      highRiskCorridors,
      criticalCorridors,
      shipmentsAtRisk,
    };
  }, [
    vehicles,
    vehicleAlerts,
    riskZoneData,
  ]);

  // ------------------------------------------------
  // OVERALL NER OPERATIONAL STATUS
  // ------------------------------------------------

  const operationalStatus = useMemo(() => {
    const locationRisk =
      prediction
        ? hazardScore
        : getLocationHazard(
            selectedLocation
          );

    const highestCorridorRisk =
      riskZoneData.length > 0
        ? Math.max(
            ...riskZoneData.map(
              (route) =>
                route.riskScore
            )
          )
        : 0;

    const highestVehicleRisk =
      vehicleAlerts.length > 0
        ? Math.max(
            ...vehicleAlerts.map(
              (vehicle) =>
                vehicle.riskScore
            )
          )
        : 0;

    const overallScore =
      Math.max(
        locationRisk,
        highestCorridorRisk,
        highestVehicleRisk
      );

    const overallLevel =
      getRiskLevel(overallScore);

    let action;

    if (overallLevel === "CRITICAL") {
      action =
        "Immediate route reassessment and critical-corridor avoidance recommended.";
    } else if (overallLevel === "HIGH") {
      action =
        "Reassess affected shipments and prefer safer available corridors.";
    } else if (overallLevel === "MODERATE") {
      action =
        "Continue monitoring vehicles and corridor conditions.";
    } else {
      action =
        "Normal logistics operations with routine monitoring.";
    }

    return {
      score: overallScore,
      level: overallLevel,
      action,
      locationRisk,
      highestCorridorRisk,
      highestVehicleRisk,
    };
  }, [
    prediction,
    hazardScore,
    selectedLocation,
    riskZoneData,
    vehicleAlerts,
  ]);

  // ------------------------------------------------
  // LOCATION CHANGE
  // ------------------------------------------------

  const handleLocationChange =
    (event) => {
      const location =
        event.target.value;

      setSelectedLocation(
        location
      );

      setPrediction(null);
      setError("");
    };

  // ------------------------------------------------
  // UI
  // ------------------------------------------------

  return (
    <div className="app">

      {/* TOPBAR */}
      <header className="topbar">

        <div className="brand">

          <div className="brand-mark">
            NR
          </div>

          <div>
            <h1>
              NER-RESQ
            </h1>

            <span>
              North East Regional Risk Intelligence
            </span>
          </div>

        </div>

        <div
          className="system-status"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >

          <span
            className="status-dot"
            style={{
              background:
                backendStatus === "online"
                  ? "#16a34a"
                  : backendStatus === "offline"
                  ? "#dc2626"
                  : "#eab308",
            }}
          ></span>

          {backendStatus === "online"
            ? "System Operational"
            : backendStatus === "offline"
            ? "Backend Offline"
            : "Checking System..."}

        </div>

      </header>

      <main className="dashboard">

        {/* HERO */}
        <section className="hero">

          <div className="eyebrow">
            AI-POWERED HAZARD MONITORING
          </div>

          <h2>
            Hazard Intelligence for
            Safer Regional Logistics
          </h2>

          <p>
            AI-powered landslide and
            rainfall risk intelligence
            for logistics corridors
            across India's North East Region.
          </p>

          <div className="location-control">

            <label>
              Monitoring Location
            </label>

            <select
              value={selectedLocation}
              onChange={
                handleLocationChange
              }
            >
              <option value="Guwahati">
                Guwahati
              </option>

              <option value="Gangtok">
                Gangtok
              </option>

              <option value="Shillong">
                Shillong
              </option>

              <option value="Itanagar">
                Itanagar
              </option>
            </select>

            <button
              onClick={runAnalysis}
              disabled={loading}
            >
              {loading
                ? "Analysing..."
                : "Run AI Risk Analysis"}
            </button>

          </div>

        </section>

        {/* ERROR */}
        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}

        {/* ------------------------------------------------ */}
        {/* DYNAMIC STATS */}
        {/* ------------------------------------------------ */}

        <section className="stats-grid">

          <div className="stat-card">

            <span>
              Active Vehicles
            </span>

            <strong>
              {dashboardKpis.activeVehicles}
            </strong>

          </div>

          <div className="stat-card">

            <span>
              High-Risk Corridors
            </span>

            <strong>
              {dashboardKpis.highRiskCorridors}
            </strong>

          </div>

          <div className="stat-card">

            <span>
              Critical Corridors
            </span>

            <strong>
              {dashboardKpis.criticalCorridors}
            </strong>

          </div>

          <div className="stat-card">

            <span>
              Shipments at Risk
            </span>

            <strong>
              {dashboardKpis.shipmentsAtRisk}
            </strong>

          </div>

        </section>

        {/* ------------------------------------------------ */}
        {/* OVERALL NER OPERATIONAL STATUS */}
        {/* ------------------------------------------------ */}

        <section
          className="dashboard-card"
          style={{
            marginTop: "18px",
          }}
        >

          <div className="card-header">

            <div>

              <h2>
                Overall NER Operational Status
              </h2>

              <span className="prototype-label">
                DYNAMIC RISK INTELLIGENCE
              </span>

            </div>

            <span
              className={`risk-${operationalStatus.level.toLowerCase()}`}
            >
              {operationalStatus.level}
            </span>

          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "14px",
              marginTop: "14px",
            }}
          >

            <div
              style={{
                padding: "14px",
                borderRadius: "10px",
                background:
                  "rgba(0,0,0,0.03)",
              }}
            >

              <span
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  marginBottom: "5px",
                }}
              >
                Overall Risk Score
              </span>

              <strong
                style={{
                  fontSize: "24px",
                }}
              >
                {(
                  operationalStatus.score *
                  100
                ).toFixed(1)}
                %
              </strong>

            </div>

            <div
              style={{
                padding: "14px",
                borderRadius: "10px",
                background:
                  "rgba(0,0,0,0.03)",
              }}
            >

              <span
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  marginBottom: "5px",
                }}
              >
                Location Risk
              </span>

              <strong
                style={{
                  fontSize: "20px",
                }}
              >
                {(
                  operationalStatus.locationRisk *
                  100
                ).toFixed(1)}
                %
              </strong>

            </div>

            <div
              style={{
                padding: "14px",
                borderRadius: "10px",
                background:
                  "rgba(0,0,0,0.03)",
              }}
            >

              <span
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  marginBottom: "5px",
                }}
              >
                Highest Corridor Risk
              </span>

              <strong
                style={{
                  fontSize: "20px",
                }}
              >
                {(
                  operationalStatus.highestCorridorRisk *
                  100
                ).toFixed(1)}
                %
              </strong>

            </div>

            <div
              style={{
                padding: "14px",
                borderRadius: "10px",
                background:
                  "rgba(0,0,0,0.03)",
              }}
            >

              <span
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  marginBottom: "5px",
                }}
              >
                Highest Vehicle Risk
              </span>

              <strong
                style={{
                  fontSize: "20px",
                }}
              >
                {(
                  operationalStatus.highestVehicleRisk *
                  100
                ).toFixed(1)}
                %
              </strong>

            </div>

          </div>

          <div
            style={{
              marginTop: "14px",
              padding: "14px 16px",
              borderRadius: "10px",
              background:
                "rgba(0,0,0,0.04)",
            }}
          >

            <strong>
              Recommended Operational Action
            </strong>

            <p
              style={{
                margin:
                  "6px 0 0",
              }}
            >
              {operationalStatus.action}
            </p>

          </div>

        </section>

        {/* DASHBOARD GRID */}
        <section className="dashboard-grid">

          {/* HAZARD PREDICTION */}
          <div className="dashboard-card">

            <div className="card-header">

              <h2>
                Hazard Prediction
              </h2>

              <span
                className={`risk-${riskLevel.toLowerCase()}`}
              >
                {riskLevel}
              </span>

            </div>

            {!prediction ? (

              <div className="empty-state">
                Run AI analysis to generate
                location-specific hazard prediction.
              </div>

            ) : (

              <div className="prediction-content">

                <div
                  className="score-circle"
                  style={{
                    "--score":
                      `${Math.round(
                        hazardScore * 100
                      )}%`,
                  }}
                >

                  <strong>
                    {Math.round(
                      hazardScore * 100
                    )}
                    %
                  </strong>

                  <span>
                    Hazard Score
                  </span>

                </div>

                <div className="prediction-metrics">

                  <div>

                    <span>
                      Landslide Probability
                    </span>

                    <strong>
                      {(
                        landslideProbability *
                        100
                      ).toFixed(1)}
                      %
                    </strong>

                  </div>

                  <div>

                    <span>
                      Rainfall Risk
                    </span>

                    <strong>
                      {(
                        rainfallRisk *
                        100
                      ).toFixed(1)}
                      %
                    </strong>

                  </div>

                  <div>

                    <span>
                      Monitoring Location
                    </span>

                    <strong>
                      {selectedLocation}
                    </strong>

                  </div>

                </div>

              </div>

            )}

          </div>

          {/* EXPLAINABLE AI */}
          <div className="dashboard-card">

            <div className="card-header">

              <h2>
                Explainable AI
              </h2>

            </div>

            <div className="explanation-list">

              <div>

                <strong>
                  Rainfall Conditions
                </strong>

                <span>
                  {currentFeatures.Rainfall_3Day}
                  mm rainfall over the last 3 days.
                </span>

              </div>

              <div>

                <strong>
                  Slope
                </strong>

                <span>
                  {currentFeatures.Slope_Angle}°
                  terrain slope.
                </span>

              </div>

              <div>

                <strong>
                  Soil Saturation
                </strong>

                <span>
                  {(
                    currentFeatures.Soil_Saturation *
                    100
                  ).toFixed(0)}
                  % estimated saturation.
                </span>

              </div>

              <div>

                <strong>
                  Historical Landslides
                </strong>

                <span>
                  {
                    currentFeatures
                      .Historical_Landslide_Count
                  }{" "}
                  historical events in
                  the prototype feature set.
                </span>

              </div>

            </div>

          </div>

        </section>

        {/* REGIONAL MAP */}
        <section className="dashboard-card">

          <div className="card-header">

            <h2>
              Regional Risk Map
            </h2>

            <span>
              {selectedLocation}
            </span>

          </div>

          <div className="regional-map-container">

            <MapContainer
              center={
                locations[
                  selectedLocation
                ]
              }
              zoom={7}
              className="regional-map"
            >

              <MapCenter
                position={
                  locations[
                    selectedLocation
                  ]
                }
              />

              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {Object.entries(
                locations
              ).map(
                ([name, position]) => (

                  <CircleMarker
                    key={name}
                    center={position}
                    radius={
                      name ===
                      selectedLocation
                        ? 12
                        : 8
                    }
                  >

                    <Popup>

                      <strong>
                        {name}
                      </strong>

                      <br />

                      Prototype monitoring point

                    </Popup>

                  </CircleMarker>

                )
              )}

            </MapContainer>

          </div>

          <p className="map-note">
            Location values and corridor paths
            shown here are simulated prototype
            inputs, not live measurements.
          </p>

        </section>

        {/* AI ALERTS */}
        <section className="dashboard-card">

          <div className="card-header">

            <h2>
              AI Alerts
            </h2>

            <span>
              {activeVehicleAlerts.length} Vehicle Alerts
            </span>

          </div>

          <div className="alert-list">

            {vehicleAlerts.map(
              (vehicle) => {

                const isHighRisk =
                  vehicle.inHighRiskZone;

                return (
                  <div
                    className="alert-item"
                    key={`vehicle-${vehicle.id}`}
                  >

                    <span
                      className={`alert-indicator ${
                        isHighRisk
                          ? "high"
                          : "moderate"
                      }`}
                    ></span>

                    <div>

                      <strong>
                        {isHighRisk
                          ? `⚠️ ${vehicle.riskLevel} vehicle risk`
                          : `Vehicle ${vehicle.id} monitored`}
                      </strong>

                      <p>
                        {vehicle.riskMessage}
                      </p>

                      <p>
                        <strong>
                          🚚 Vehicle:
                        </strong>{" "}
                        {vehicle.id}
                        {" • "}
                        {vehicle.commodity}
                      </p>

                      <p>
                        <strong>
                          📍 Risk Zone:
                        </strong>{" "}
                        {vehicle.route?.name ||
                          `${vehicle.start} → ${vehicle.destination}`}
                      </p>

                      <p>
                        <strong>
                          🔄 Live Status:
                        </strong>{" "}
                        {vehicle.status}
                        {" • Current risk: "}
                        {(
                          vehicle.riskScore *
                          100
                        ).toFixed(1)}
                        %
                      </p>

                      {vehicle.etaDelayMinutes > 0 && (
                        <p>
                          <strong>
                            ⏱️ Risk-Adjusted ETA:
                          </strong>{" "}
                          {vehicle.riskAdjustedEta}
                          {" • Delay: "}
                          {vehicle.etaDelayMinutes} min
                        </p>
                      )}

                      {isHighRisk &&
                        vehicle.recommendedRoute && (
                          <p>
                            <strong>
                              🛣️ Safer Route:
                            </strong>{" "}
                            {
                              vehicle
                                .recommendedRoute
                                .name
                            }
                            {" — Risk "}
                            {(
                              vehicle
                                .recommendedRoute
                                .riskScore *
                              100
                            ).toFixed(1)}
                            %
                          </p>
                        )}

                      {isHighRisk && (
                        <p>
                          <strong>
                            🎯 Recommended Action:
                          </strong>{" "}
                          {vehicle.recommendedAction}
                        </p>
                      )}

                    </div>

                  </div>
                );
              }
            )}

            {/* LANDSLIDE ALERT */}
            <div className="alert-item">

              <span
                className={`alert-indicator ${
                  landslideProbability >= 0.60
                    ? "high"
                    : "moderate"
                }`}
              ></span>

              <div>

                <strong>
                  {prediction
                    ? landslideProbability >= 0.60
                      ? "High landslide risk detected"
                      : "Landslide risk being monitored"
                    : "Landslide risk monitoring"}
                </strong>

                <p>
                  {prediction
                    ? `${selectedLocation} has an estimated landslide probability of ${(landslideProbability * 100).toFixed(1)}%.`
                    : `Run AI Risk Analysis to evaluate landslide risk for ${selectedLocation}.`}
                </p>

              </div>

            </div>

            {/* RAINFALL ALERT */}
            <div className="alert-item">

              <span
                className={`alert-indicator ${
                  rainfallRisk >= 0.60
                    ? "high"
                    : "moderate"
                }`}
              ></span>

              <div>

                <strong>
                  {rainfallRisk >= 0.60
                    ? "Elevated rainfall risk"
                    : "Rainfall conditions monitored"}
                </strong>

                <p>
                  Prototype rainfall risk for{" "}
                  {selectedLocation} is{" "}
                  {(rainfallRisk * 100).toFixed(1)}
                  %.
                </p>

              </div>

            </div>

            {/* SOIL SATURATION ALERT */}
            <div className="alert-item">

              <span
                className={`alert-indicator ${
                  currentFeatures.Soil_Saturation >=
                  0.55
                    ? "high"
                    : "moderate"
                }`}
              ></span>

              <div>

                <strong>
                  {currentFeatures.Soil_Saturation >=
                  0.55
                    ? "High soil saturation"
                    : "Soil saturation within monitored range"}
                </strong>

                <p>
                  Estimated soil saturation is{" "}
                  {(
                    currentFeatures.Soil_Saturation *
                    100
                  ).toFixed(0)}
                  %, indicating a{" "}
                  {currentFeatures.Soil_Saturation >=
                  0.55
                    ? "higher"
                    : "moderate"}{" "}
                  saturation condition in
                  this prototype.
                </p>

              </div>

            </div>

            {/* OVERALL HAZARD ALERT */}
            <div className="alert-item">

              <span
                className={`alert-indicator ${
                  prediction &&
                  hazardScore >= 0.60
                    ? "high"
                    : "moderate"
                }`}
              ></span>

              <div>

                <strong>
                  Overall hazard assessment
                </strong>

                <p>
                  {prediction
                    ? `${selectedLocation} currently has a ${riskLevel.toLowerCase()} overall hazard level with a hazard score of ${(hazardScore * 100).toFixed(1)}%.`
                    : `Run AI Risk Analysis to generate the hazard assessment for ${selectedLocation}.`}
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* GPS VEHICLE + SUPPLY TRACKING */}
        <section className="dashboard-card">

          <div className="card-header">

            <div>

              <h2>
                GPS Vehicle & Supply Tracking
              </h2>

              <span className="prototype-label">
                SIMULATED GPS TELEMETRY
              </span>

            </div>

            <span>
              {vehicles.length} Vehicles
            </span>

          </div>

          {/* RISK-ZONE MAP */}

          <div
            className="regional-map-container"
            style={{
              position: "relative",
            }}
          >

            <MapContainer
              center={[
                26.5,
                90.5,
              ]}
              zoom={6}
              className="regional-map"
            >

              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* RISK CORRIDORS */}

              {riskZoneData.map(
                (zone) => {

                  const zoneColor =
                    getRiskZoneColor(
                      zone.riskLevel
                    );

                  const zoneOpacity =
                    getRiskZoneOpacity(
                      zone.riskLevel
                    );

                  const zoneWeight =
                    getRiskZoneWeight(
                      zone.riskLevel
                    );

                  return (
                    <div
                      key={`risk-${zone.id}`}
                    >

                      {/* WIDE COLORED RISK BAND */}

                      <Polyline
                        positions={
                          zone.path
                        }
                        pathOptions={{
                          color:
                            zoneColor,
                          weight:
                            zoneWeight,
                          opacity:
                            zoneOpacity,
                          lineCap:
                            "round",
                          lineJoin:
                            "round",
                        }}
                      >

                        <Popup>

                          <strong>
                            ⚠️{" "}
                            {zone.riskLevel}
                            {" RISK ZONE"}
                          </strong>

                          <br />
                          <br />

                          <strong>
                            Corridor:
                          </strong>{" "}
                          {zone.name}

                          <br />

                          <strong>
                            Risk Score:
                          </strong>{" "}
                          {(
                            zone.riskScore *
                            100
                          ).toFixed(1)}
                          %

                          <br />

                          <strong>
                            Risk Level:
                          </strong>{" "}
                          {zone.riskLevel}

                          <br />

                          <strong>
                            Vehicles:
                          </strong>{" "}
                          {zone.vehicleCount}

                        </Popup>

                      </Polyline>

                      {/* ROUTE CENTERLINE */}

                      <Polyline
                        positions={
                          zone.path
                        }
                        pathOptions={{
                          color:
                            "#111827",
                          weight: 2,
                          opacity: 0.80,
                          lineCap:
                            "round",
                          lineJoin:
                            "round",
                          dashArray:
                            "6 6",
                        }}
                      />

                    </div>
                  );
                }
              )}

              {/* VEHICLE MARKERS */}

              {vehicles.map(
                (vehicle) => {

                  const vehicleAlert =
                    vehicleAlerts.find(
                      (item) =>
                        item.id ===
                        vehicle.id
                    );

                  return (
                    <Marker
                      key={vehicle.id}
                      position={
                        vehicle.position
                      }
                    >

                      <Popup>

                        <strong>
                          🚚 {vehicle.id}
                        </strong>

                        <br />

                        <strong>
                          Cargo:
                        </strong>{" "}
                        {vehicle.commodity}

                        <br />

                        <strong>
                          Quantity:
                        </strong>{" "}
                        {vehicle.quantity}

                        <br />

                        <strong>
                          Route:
                        </strong>{" "}
                        {vehicle.start}
                        {" → "}
                        {vehicle.destination}

                        <br />

                        <strong>
                          Risk Zone:
                        </strong>{" "}
                        {vehicleAlert?.route?.name ||
                          `${vehicle.start} → ${vehicle.destination}`}

                        <br />

                        <strong>
                          Progress:
                        </strong>{" "}
                        {Math.round(
                          vehicle.progress *
                            100
                        )}
                        %

                        <br />

                        <strong>
                          Base ETA:
                        </strong>{" "}
                        {vehicle.eta}

                        <br />

                        <strong>
                          Risk-Adjusted ETA:
                        </strong>{" "}
                        {vehicle.riskAdjustedEta}

                        {vehicle.etaDelayMinutes > 0 && (
                          <>
                            <br />

                            <strong>
                              ETA Delay:
                            </strong>{" "}
                            +{vehicle.etaDelayMinutes} min
                            {" ("}
                            {vehicle.etaDelayPercentage}%
                            {")"}
                          </>
                        )}

                        <br />

                        <strong>
                          Live Status:
                        </strong>{" "}
                        {vehicle.status}

                        <br />

                        <strong>
                          Current Zone Risk:
                        </strong>{" "}
                        {vehicleAlert
                          ? (
                              vehicleAlert.riskScore *
                              100
                            ).toFixed(1)
                          : "—"}
                        %

                        <br />

                        <strong>
                          Risk Level:
                        </strong>{" "}
                        {vehicleAlert
                          ? vehicleAlert.riskLevel
                          : "—"}

                        {vehicleAlert?.inHighRiskZone &&
                          vehicleAlert?.recommendedRoute && (
                            <>
                              <br />
                              <br />

                              <strong>
                                ⚠️ Safer Route:
                              </strong>

                              <br />

                              {
                                vehicleAlert
                                  .recommendedRoute
                                  .name
                              }

                              <br />

                              <strong>
                                Alternative Risk:
                              </strong>{" "}
                              {(
                                vehicleAlert
                                  .recommendedRoute
                                  .riskScore *
                                100
                              ).toFixed(1)}
                              %
                            </>
                          )}

                        {vehicleAlert?.inHighRiskZone && (
                          <>
                            <br />
                            <br />

                            <strong>
                              🎯 Recommended Action:
                            </strong>

                            <br />

                            {vehicleAlert.recommendedAction}
                          </>
                        )}

                      </Popup>

                    </Marker>
                  );
                }
              )}

            </MapContainer>

          </div>

          {/* RISK LEGEND */}

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "16px",
              alignItems: "center",
              marginTop: "16px",
              padding: "12px 14px",
              borderRadius: "10px",
              background:
                "rgba(0,0,0,0.03)",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >

            <span>

              <span
                style={{
                  display:
                    "inline-block",
                  width: "26px",
                  height: "8px",
                  borderRadius: "5px",
                  background:
                    "#16a34a",
                  marginRight: "6px",
                }}
              ></span>

              LOW

            </span>

            <span>

              <span
                style={{
                  display:
                    "inline-block",
                  width: "26px",
                  height: "8px",
                  borderRadius: "5px",
                  background:
                    "#eab308",
                  marginRight: "6px",
                }}
              ></span>

              MODERATE

            </span>

            <span>

              <span
                style={{
                  display:
                    "inline-block",
                  width: "26px",
                  height: "8px",
                  borderRadius: "5px",
                  background:
                    "#f97316",
                  marginRight: "6px",
                }}
              ></span>

              HIGH

            </span>

            <span>

              <span
                style={{
                  display:
                    "inline-block",
                  width: "26px",
                  height: "8px",
                  borderRadius: "5px",
                  background:
                    "#dc2626",
                  marginRight: "6px",
                }}
              ></span>

              CRITICAL

            </span>

          </div>

          {/* VEHICLE CARDS */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "14px",
              marginTop: "18px",
            }}
          >

            {vehicles.map(
              (vehicle) => {

                const vehicleAlert =
                  vehicleAlerts.find(
                    (item) =>
                      item.id ===
                      vehicle.id
                  );

                return (
                  <div
                    key={vehicle.id}
                    className="route-alternative"
                  >

                    {/* VEHICLE ID + ROUTE */}

                    <div>

                      <span className="route-alternative-name">

                        🚚{" "}
                        {vehicle.id}

                      </span>

                      <small>
                        {vehicle.start}
                        {" → "}
                        {vehicle.destination}
                      </small>

                      <small>
                        📍 Risk Zone:{" "}
                        {vehicleAlert?.route?.name ||
                          `${vehicle.start} → ${vehicle.destination}`}
                      </small>

                      <small>
                        📦{" "}
                        {vehicle.commodity}
                        {" • "}
                        {vehicle.quantity}
                      </small>

                    </div>

                    {/* CLEAN VEHICLE METRICS */}

                    <div className="route-alternative-risk">

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: "12px",
                          marginBottom: "6px",
                        }}
                      >

                        <strong>
                          {Math.round(
                            vehicle.progress *
                              100
                          )}
                          %
                        </strong>

                        <span>
                          {vehicle.status}
                        </span>

                      </div>

                      <small>
                        Risk{" "}
                        {vehicleAlert
                          ? (
                              vehicleAlert.riskScore *
                              100
                            ).toFixed(0)
                          : "—"}
                        %
                      </small>

                      <small>
                        Risk Level:{" "}
                        {vehicleAlert?.riskLevel ||
                          "—"}
                      </small>

                      <div
                        style={{
                          marginTop: "8px",
                          paddingTop: "8px",
                          borderTop:
                            "1px solid rgba(0,0,0,0.08)",
                        }}
                      >

                        <small>
                          ETA:{" "}
                          <strong>
                            {vehicle.eta}
                          </strong>
                        </small>

                        <small>
                          Risk-Adjusted ETA:{" "}
                          <strong>
                            {vehicle.riskAdjustedEta}
                          </strong>
                        </small>

                        {vehicle.etaDelayMinutes > 0 && (
                          <small>
                            ⏱️ Delay +{vehicle.etaDelayMinutes} min
                          </small>
                        )}

                      </div>

                      {vehicleAlert?.inHighRiskZone && (
                        <small
                          style={{
                            display: "block",
                            marginTop: "8px",
                          }}
                        >
                          🎯{" "}
                          {vehicleAlert.recommendedAction}
                        </small>
                      )}

                    </div>

                  </div>
                );
              }
            )}

          </div>

          <p className="map-note">

            Colored risk bands represent simulated
            hazard zones along the demonstration
            logistics corridors. Vehicle positions
            and telemetry are simulated for the
            prototype.

          </p>

        </section>

        {/* ROUTE OPTIMISER */}
        <section className="dashboard-card route-optimizer-card">

          <div className="card-header">

            <div>

              <h2>
                Route Optimiser
              </h2>

              <span className="prototype-label">
                AI RISK-AWARE ROUTE RANKING
              </span>

            </div>

          </div>

          {routeRankings.length === 0 ? (

            <div className="route-empty">

              <div className="route-empty-icon">
                🛣️
              </div>

              <strong>
                No route available
              </strong>

              <p>
                No demonstration corridor is
                connected to this location.
              </p>

            </div>

          ) : (

            <>

              <div className="route-map-container">

                <MapContainer
                  center={
                    locations[
                      selectedLocation
                    ]
                  }
                  zoom={6}
                  className="route-map"
                >

                  <MapCenter
                    position={
                      locations[
                        selectedLocation
                      ]
                    }
                  />

                  <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {routeRankings.map(
                    (route, index) => (

                      <Polyline
                        key={route.id}
                        positions={
                          route.path
                        }
                        weight={
                          index === 0
                            ? 6
                            : 4
                        }
                        opacity={
                          index === 0
                            ? 0.95
                            : 0.55
                        }
                      >

                        <Popup>

                          <strong>
                            {route.name}
                          </strong>

                          <br />

                          Route Risk:{" "}
                          {(
                            route.riskScore *
                            100
                          ).toFixed(1)}
                          %

                          <br />

                          Risk Level:{" "}
                          {route.riskLevel}

                        </Popup>

                      </Polyline>

                    )
                  )}

                  <Marker
                    position={
                      locations[
                        selectedLocation
                      ]
                    }
                  >

                    <Popup>

                      <strong>
                        {selectedLocation}
                      </strong>

                      <br />

                      Selected monitoring location

                    </Popup>

                  </Marker>

                </MapContainer>

              </div>

              {recommendedRoute && (

                <div className="route-best">

                  <div className="route-best-left">

                    <div className="route-best-icon">
                      ✓
                    </div>

                    <div className="route-best-info">

                      <span>
                        RECOMMENDED ROUTE
                      </span>

                      <strong>
                        {recommendedRoute.name}
                      </strong>

                      <small>
                        {recommendedRoute.distance}
                        {" km • "}
                        {recommendedRoute.time}
                      </small>

                      <small>
                        Why selected:{" "}
                        {getRouteExplanation(
                          recommendedRoute
                        )}
                      </small>

                    </div>

                  </div>

                  <div className="route-best-risk">

                    <span>
                      Route Risk
                    </span>

                    <strong>
                      {(
                        recommendedRoute.riskScore *
                        100
                      ).toFixed(1)}
                      %
                    </strong>

                    <small>
                      {recommendedRoute.riskLevel}
                    </small>

                  </div>

                </div>

              )}

              <div className="route-alternatives">

                <div className="route-section-label">
                  Alternative Routes
                </div>

                {routeRankings
                  .slice(1)
                  .map((route) => (

                    <div
                      className="route-alternative"
                      key={route.id}
                    >

                      <div>

                        <span className="route-alternative-name">
                          {route.name}
                        </span>

                        <small>
                          {route.distance}
                          {" km • "}
                          {route.time}
                        </small>

                      </div>

                      <div className="route-alternative-risk">

                        <strong>
                          {(
                            route.riskScore *
                            100
                          ).toFixed(1)}
                          %
                        </strong>

                        <span>
                          {route.riskLevel}
                        </span>

                      </div>

                    </div>

                  ))}

              </div>

              <p className="route-method-note">

                Route ranking selects the
                lowest-risk applicable
                demonstration corridor.
                Risk combines hazard exposure
                (65%), distance (20%) and
                travel time (15%). Higher
                percentage means higher route
                risk. These are demonstration
                corridors for the prototype,
                not live road-segment
                measurements.

              </p>

            </>

          )}

        </section>

      </main>

      <footer className="footer">

        NER-RESQ • AI-powered hazard
        intelligence prototype for safer
        regional logistics.

      </footer>

    </div>
  );
}

export default App;