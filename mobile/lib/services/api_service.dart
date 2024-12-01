import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  // Base API URL
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
    final response = await http.get(
      url,
      headers: {'Content-Type': 'application/json'},
    );

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      if (data['success'] == true && data['fundraiser'] != null) {
        return List<Map<String, dynamic>>.from(data['fundraiser']);
      } else {
        throw Exception('Invalid response structure: ${response.body}');
      }
    } else {
      throw Exception(
          'Failed to load fundraisers: ${response.statusCode} - ${response.body}');
    }
  }

  // Send SOS API
  static Future<Map<String, dynamic>> sendSos({
    required String name,
    required String email,
    required String location,
    required String emergencyType,
  }) async {
    final Uri url = Uri.parse('$_baseUrl/send-sos');
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: json.encode({
        'name': name,
        'email': email,
        'location': location,
        'emergencyType': emergencyType,
      }),
    );

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to send SOS: ${response.body}');
    }
  }

  // Add Issue API
  static Future<Map<String, dynamic>> addIssue({
    required String photoBase64,
    required String title,
    required String description,
    required String emergencyType,
    required String location,
  }) async {
    final Uri url = Uri.parse('$_baseUrl/add-issue');
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: json.encode({
        'photo': photoBase64,
        'title': title,
        'description': description,
        'emergencyType': emergencyType,
        'location': location,
      }),
    );

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to raise issue: ${response.body}');
    }
  }
}
