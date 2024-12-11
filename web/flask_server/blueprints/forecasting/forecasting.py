import os
import json
import requests
from dotenv import load_dotenv
from groq import Groq

# Load environment variables
load_dotenv()
OPENWEATHER_API_KEY = os.getenv('OPENWEATHER_API_KEY')
GROQ_API_KEY = os.getenv('GROQ_API_KEY')

# Initialize the GROQ client
groq_client = Groq(api_key=GROQ_API_KEY)

# Initialize Flask app

def fetch_weather_data(city_name, latitude, longitude):
    """Fetch weather data for a city using OpenWeatherAPI."""
    base_url = "https://api.openweathermap.org/data/2.5/weather"
    params = {
        "lat": latitude,
        "lon": longitude,
        "appid": OPENWEATHER_API_KEY,
        "units": "metric"
    }
    try:
        response = requests.get(base_url, params=params)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        return {"error": str(e)}

def generate_forecast_narrative(weather_data, city_name):
    """Generate a disaster forecast narrative using GROQ LLM."""
    try:
        temp = weather_data.get('main', {}).get('temp', 0)
        wind_speed = weather_data.get('wind', {}).get('speed', 0)
        humidity = weather_data.get('main', {}).get('humidity', 0)
        weather_condition = weather_data.get('weather', [{}])[0].get('description', '').lower()

        # Prompt for the GROQ LLM
        prompt = f"""Analyze the following weather conditions for {city_name}:
        - Temperature: {temp}°C
        - Wind Speed: {wind_speed} m/s
        - Humidity: {humidity}%
        - Condition: {weather_condition}
        Read above this data and forecast potential disasters such as [
        'heatwave', 
        'coldwave', 
        'storm', 
        'cyclone', 
        'flood', 
        'drought', 
        'landslide', 
        'earthquake',
        'hailstorm',
        ] 
        Generate accurate small 3-4 word forecast. Not longer. Avoid generating random forecasts."""
        
        completion = groq_client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are an NDRF officer. Your duty is to generate small 2-3 words to the point forecast based the weather data provided to you."},
                {"role": "user", "content": prompt}
            ],
            model="llama-3.3-70b-versatile",
            temperature=0,
            max_tokens=50
        )
        return completion.choices[0].message.content.strip()
    except Exception as e:
        return f"Forecast unavailable: {str(e)}"

def determine_color_code(forecast_narrative):
    """Determine a color code based on the forecast narrative."""
    narrative = forecast_narrative.lower()

    # Define keywords for different severity levels
    severe_conditions = ['heat wave', 'cold wave', 'storm', 'cyclone', 'flood', 
                         'drought', 'landslide', 'earthquake', 'hailstorm', 
                         'wildfire', 'tornado', 'blizzard', 'hurricane']
    moderate_conditions = ['rain', 'thunderstorm', 'windy', 'air quality alert', 
                           'poor air quality', 'gusty winds', 'drizzle', 'fog']
    
    # Determine the color code
    if any(term in narrative for term in severe_conditions):
        return "red"  # Severe conditions
    elif any(term in narrative for term in moderate_conditions):
        return "yellow"  # Moderate conditions
    else:
        return "green"  # Safe conditions

def get_weather_for_regions(region_data):
    """Fetch weather data and generate forecast for all regions."""
    forecast_data = {}

    for region, cities in region_data["regions"].items():
        region_forecasts = []
        for city in cities:
            weather_data = fetch_weather_data(city["name"], city["lat"], city["lon"])

            if "error" in weather_data:
                print(f"Error fetching weather data for {city['name']}: {weather_data['error']}")
                continue

            forecast_narrative = generate_forecast_narrative(weather_data, city["name"])
            color_code = determine_color_code(forecast_narrative)

            region_forecasts.append({
                "city": city["name"],
                "forecast_narrative": forecast_narrative,
                "color_code": color_code
            })

        forecast_data[region] = region_forecasts

    return forecast_data

# Define the route to get weather forecast
@forecast.route('/v1/weather-forecast')
def weather_forecast():
    region_data = {
    "regions": {
        "North": [
            {"name": "Delhi", "lat": 28.6139, "lon": 77.2090},
            {"name": "Chandigarh", "lat": 30.7333, "lon": 76.7794},
            {"name": "Jammu", "lat": 32.7266, "lon": 74.8570},
            {"name": "Lucknow", "lat": 26.8467, "lon": 80.9462},
            {"name": "Amritsar", "lat": 31.6340, "lon": 74.8723},
            {"name": "Shimla", "lat": 31.1048, "lon": 77.1734},
            {"name": "Dehradun", "lat": 30.3165, "lon": 78.0322},
            {"name": "Varanasi", "lat": 25.3176, "lon": 82.9739},
            {"name": "Agra", "lat": 27.1767, "lon": 78.0081},
            {"name": "Kanpur", "lat": 26.4499, "lon": 80.3319}
        ],
        "South": [
            {"name": "Bangalore", "lat": 12.9716, "lon": 77.5946},
            {"name": "Chennai", "lat": 13.0827, "lon": 80.2707},
            {"name": "Trivandrum", "lat": 8.5241, "lon": 76.9366},
            {"name": "Hyderabad", "lat": 17.3850, "lon": 78.4867},
            {"name": "Coimbatore", "lat": 11.0168, "lon": 76.9558},
            {"name": "Mysore", "lat": 12.2958, "lon": 76.6394},
            {"name": "Madurai", "lat": 9.9252, "lon": 78.1198},
            {"name": "Vijayawada", "lat": 16.5062, "lon": 80.6480},
            {"name": "Kochi", "lat": 9.9312, "lon": 76.2673},
            {"name": "Visakhapatnam", "lat": 17.6868, "lon": 83.2185}
        ],
        "East": [
            {"name": "Kolkata", "lat": 22.5726, "lon": 88.3639},
            {"name": "Bhubaneswar", "lat": 20.2961, "lon": 85.8245},
            {"name": "Patna", "lat": 25.5941, "lon": 85.1376},
            {"name": "Guwahati", "lat": 26.1445, "lon": 91.7362},
            {"name": "Ranchi", "lat": 23.3441, "lon": 85.3096},
            {"name": "Durgapur", "lat": 23.5204, "lon": 87.3119},
            {"name": "Cuttack", "lat": 20.4625, "lon": 85.8828},
            {"name": "Siliguri", "lat": 26.7271, "lon": 88.3953},
            {"name": "Gaya", "lat": 24.7955, "lon": 84.9994},
            {"name": "Imphal", "lat": 24.8170, "lon": 93.9368}
        ],
        "West": [
            {"name": "Mumbai", "lat": 19.0760, "lon": 72.8777},
            {"name": "Ahmedabad", "lat": 23.0225, "lon": 72.5714},
            {"name": "Pune", "lat": 18.5204, "lon": 73.8567},
            {"name": "Jaipur", "lat": 26.9124, "lon": 75.7873},
            {"name": "Surat", "lat": 21.1702, "lon": 72.8311},
            {"name": "Udaipur", "lat": 24.5854, "lon": 73.7125},
            {"name": "Jodhpur", "lat": 26.2389, "lon": 73.0243},
            {"name": "Rajkot", "lat": 22.3039, "lon": 70.8022},
            {"name": "Vadodara", "lat": 22.3072, "lon": 73.1812},
            {"name": "Indore", "lat": 22.7196, "lon": 75.8577}
        ],
        "Central": [
            {"name": "Bhopal", "lat": 23.2599, "lon": 77.4126},
            {"name": "Nagpur", "lat": 21.1458, "lon": 79.0882},
            {"name": "Jabalpur", "lat": 23.1815, "lon": 79.9864},
            {"name": "Indore", "lat": 22.7196, "lon": 75.8577},
            {"name": "Raipur", "lat": 21.2514, "lon": 81.6296},
            {"name": "Gwalior", "lat": 26.2183, "lon": 78.1828},
            {"name": "Bilaspur", "lat": 22.0796, "lon": 82.1391},
            {"name": "Ujjain", "lat": 23.1793, "lon": 75.7849},
            {"name": "Satna", "lat": 24.6005, "lon": 80.8322},
            {"name": "Dewas", "lat": 22.9676, "lon": 76.0534}
        ]
    }
}

    try:
        forecast_data = get_weather_for_regions(region_data)
        return jsonify(forecast_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500