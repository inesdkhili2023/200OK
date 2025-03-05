package com.ahch.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.json.JSONArray;
import org.json.JSONObject;

@Service
public class GeocodingService {

    private static final String GEOCODING_API = "https://nominatim.openstreetmap.org/search?format=json&q=";

    public double[] getCoordinates(String location) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = GEOCODING_API + location.replace(" ", "%20");
            String response = restTemplate.getForObject(url, String.class);
            System.out.println("🌍 Fetching coordinates for: " + location);
            System.out.println("🔍 API Response: " + response);
            JSONArray jsonArray = new JSONArray(response);
            if (jsonArray.length() > 0) {
                JSONObject jsonObject = jsonArray.getJSONObject(0);
                double latitude = jsonObject.getDouble("lat");
                double longitude = jsonObject.getDouble("lon");
                System.out.println("✅ Coordinates found: Lat=" + latitude + ", Lon=" + longitude);

                return new double[]{latitude, longitude};
            }else {
                System.out.println("⚠️ No coordinates found for: " + location);
            }
        } catch (Exception e) {
            System.err.println("❌ Error fetching coordinates: " + e.getMessage());
        }
        return new double[]{0.0, 0.0}; // Return 0 if location not found
    }
}
