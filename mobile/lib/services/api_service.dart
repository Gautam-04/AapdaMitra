import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  // Base API URL
  static const String _baseUrl = 'http://10.0.2.2:8000/v1/mobile';

  // Register with Aadhar API
  static Future<Map<String, dynamic>> registerWithAadhar({
    required String name,
    required String email,
    required String phoneNumber,
    required String aadharNumber,
    required String fcmToken, // Added FCM token
  }) async {
    final Uri url = Uri.parse('$_baseUrl/verify-aadhar');
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: json.encode({
        'name': name,
        'email': email,
        'mobileNo': phoneNumber,
        'aadharNo': aadharNumber,
        'fcmToken': fcmToken, // Send FCM token
      }),
    );

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Error: ${response.body}');
    }
  }

  // Login with Aadhar API
  static Future<Map<String, dynamic>> loginWithAadhar({
    required String phoneNumber,
    required String fcmToken, // Added FCM token
  }) async {
    final Uri url = Uri.parse('$_baseUrl/login-with-aadhar');
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: json.encode({
        'mobileNo': phoneNumber,
        'fcmToken': fcmToken, // Send FCM token
      }),
    );

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Error: ${response.body}');
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

  // Fetch Verified Posts API
  static Future<List<Map<String, dynamic>>> fetchVerifiedPosts() async {
    final Uri url = Uri.parse('$_baseUrl/get-all-post');
    final response = await http.get(
      url,
      headers: {'Content-Type': 'application/json'},
    );

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      if (data['success'] == true && data['verified'] != null) {
        return List<Map<String, dynamic>>.from(data['verified']);
      } else {
        throw Exception('Invalid response structure: ${response.body}');
      }
    } else {
      throw Exception(
          'Failed to fetch verified posts: ${response.statusCode} - ${response.body}');
    }
  }

// Fetch Personal Issues API
  static Future<List<Map<String, dynamic>>> fetchPersonalIssues() async {
  final Uri url = Uri.parse('$_baseUrl/get-personal-issue');

  // Fetch userId from SharedPreferences
  final prefs = await SharedPreferences.getInstance();
  final userId = prefs.getString('userId') ?? '';
  print('Fetched userId: $userId'); // Debugging userId

  if (userId.isEmpty) {
    throw Exception('User ID not found in local storage');
  }

  // Send POST request
  final response = await http.post(
    url,
    headers: {'Content-Type': 'application/json'},
    body: json.encode({'userId': userId}),
  );

  print('API Response: ${response.body}'); // Debugging response body

  if (response.statusCode == 200) {
    final data = json.decode(response.body);

    // Ensure the 'personalIssues' key exists
    if (data['personalIssues'] != null) {
      final issues = data['personalIssues'];

      // Handle cases where 'personalIssues' is a list or a single object
      if (issues is List) {
        return List<Map<String, dynamic>>.from(issues);
      } else if (issues is Map<String, dynamic>) {
        return [issues]; // Wrap single issue in a list
      } else {
        throw Exception('Unexpected format for personal issues');
      }
    } else {
      throw Exception('No issues found for the user');
    }
  } else {
    throw Exception(
        'Failed to fetch personal issues: ${response.statusCode} - ${response.body}');
  }
}

}
