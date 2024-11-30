import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  // Base API URL (adjust according to your backend)
  static const String _baseUrl = 'http://10.0.2.2:8000/v1/mobile';

  // Register Citizen API
  static Future<Map<String, dynamic>> registerCitizen(String email) async {
    final Uri url = Uri.parse('$_baseUrl/register-citizen');
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: json.encode({'email': email}),
    );

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to send OTP: ${response.body}');
    }
  }

  // Verify Registered Citizen API
  static Future<Map<String, dynamic>> verifyRegisteredCitizen({
    required String email,
    required String name,
    required String otp,
  }) async {
    final Uri url = Uri.parse('$_baseUrl/verify-reg-citizen');
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: json.encode({
        'email': email,
        'name': name,
        'otp': otp,
      }),
    );

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to verify OTP: ${response.body}');
    }
  }

  // Citizen Login API
  static Future<Map<String, dynamic>> loginCitizen(String email) async {
    final Uri url = Uri.parse('$_baseUrl/login-mobile');
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: json.encode({'email': email}),
    );

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to send OTP for login: ${response.body}');
    }
  }

  // Verify Logged-In Citizen API
  static Future<Map<String, dynamic>> verifyLoginCitizen({
    required String email,
    required String otp,
  }) async {
    final Uri url = Uri.parse('$_baseUrl/verify-login-citizen');
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: json.encode({
        'email': email,
        'otp': otp,
      }),
    );

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to verify login OTP: ${response.body}');
    }
  }

  // Fetch Fundraisers API
  static Future<List<Map<String, dynamic>>> fetchFundraisers() async {
    final Uri url = Uri.parse('$_baseUrl/get-fundraisers');
    try {
      final response = await http.get(
        url,
        headers: {'Content-Type': 'application/json'},
      );

      // Log the response for debugging
      print('Request URL: $url');
      print('Response Status: ${response.statusCode}');
      print('Response Body: ${response.body}');

      if (response.statusCode == 200) {
        final data = json.decode(response.body);

        // Validate the response structure
        if (data['success'] == true && data['fundraiser'] != null) {
          return List<Map<String, dynamic>>.from(data['fundraiser']);
        } else {
          throw Exception(
              'Invalid response structure: ${response.body}');
        }
      } else {
        throw Exception(
            'Failed to load fundraisers: ${response.statusCode} - ${response.body}');
      }
    } catch (e) {
      // Handle network or parsing errors
      print('Error fetching fundraisers: $e');
      throw Exception('Error fetching fundraisers: $e');
    }
  }
}
