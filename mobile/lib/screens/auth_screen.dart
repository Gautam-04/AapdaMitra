import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'home_screen.dart';
import 'package:mobile/services/api_service.dart';

class AuthScreen extends StatefulWidget {
  const AuthScreen({Key? key}) : super(key: key);

  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _otpController = TextEditingController();
  final TextEditingController _nameController = TextEditingController();
  bool _isLoading = false;
  bool _isOtpSent = false;
  bool _isRegistrationMode = true; // Toggle between Registration and Login

  @override
  void initState() {
    super.initState();
    _checkToken(); // Check token on startup
  }

  /// Check if token exists and navigate to HomeScreen
  Future<void> _checkToken() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('userToken');
    if (token != null) {
      // Token exists, navigate to HomeScreen
      Navigator.of(context).pushReplacementNamed('/home_screen');
    }
  }

  /// Send OTP for Registration or Login
  Future<void> _sendOtp() async {
    setState(() {
      _isLoading = true;
    });

    try {
      final response = _isRegistrationMode
          ? await ApiService.registerCitizen(_emailController.text)
          : await ApiService.loginCitizen(_emailController.text);

      if (response['message'] == 'OTP sent successfully') {
        setState(() {
          _isOtpSent = true;
        });
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(response['message'])),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(response['message'] ?? 'Failed to send OTP')),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('An error occurred. Please try again later.')),
      );
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  /// Verify OTP for Registration
  Future<void> _verifyOtp() async {
    setState(() {
      _isLoading = true;
    });

    try {
      final response = await ApiService.verifyRegisteredCitizen(
        email: _emailController.text,
        name: _nameController.text,
        otp: _otpController.text,
      );

      if (response['message'] == 'User registered successfully') {
        await _saveUserDataAndNavigate(response);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(response['message'] ?? 'Invalid OTP')),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('An error occurred. Please try again later.')),
      );
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  /// Verify OTP for Login
  Future<void> _verifyLoginOtp() async {
    setState(() {
      _isLoading = true;
    });

    try {
      final response = await ApiService.verifyLoginCitizen(
        email: _emailController.text,
        otp: _otpController.text,
      );

      if (response['message'] == 'User logged in successfully') {
        await _saveUserDataAndNavigate(response);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(response['message'] ?? 'Invalid OTP')),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('An error occurred. Please try again later.')),
      );
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  /// Save user data and navigate to HomeScreen
  Future<void> _saveUserDataAndNavigate(Map<String, dynamic> response) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('userToken', response['accessToken']);
    await prefs.setString('userEmail', response['createdUser']['email']);
    await prefs.setString('userName', response['createdUser']['name']);
    await prefs.setBool('isLoggedIn', true);

    Navigator.of(context).pushReplacementNamed('/home_screen');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Authentication')),
      body: Stack(
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: SingleChildScrollView(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text(
                    'Welcome to Aapda Mitra',
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 20),
                  DropdownButton<bool>(
                    value: _isRegistrationMode,
                    items: const [
                      DropdownMenuItem(
                        value: true,
                        child: Text('Registration'),
                      ),
                      DropdownMenuItem(
                        value: false,
                        child: Text('Login'),
                      ),
                    ],
                    onChanged: (value) {
                      setState(() {
                        _isRegistrationMode = value ?? true;
                        _isOtpSent = false;
                      });
                    },
                  ),
                  const SizedBox(height: 20),
                  if (_isRegistrationMode)
                    TextField(
                      controller: _nameController,
                      decoration: const InputDecoration(
                        labelText: 'Name',
                        border: OutlineInputBorder(),
                        prefixIcon: Icon(Icons.person),
                      ),
                    ),
                  const SizedBox(height: 20),
                  TextField(
                    controller: _emailController,
                    decoration: const InputDecoration(
                      labelText: 'Email',
                      border: OutlineInputBorder(),
                      prefixIcon: Icon(Icons.email),
                    ),
                  ),
                  const SizedBox(height: 20),
                  if (_isOtpSent)
                    TextField(
                      controller: _otpController,
                      decoration: const InputDecoration(
                        labelText: 'OTP',
                        border: OutlineInputBorder(),
                        prefixIcon: Icon(Icons.lock),
                      ),
                    ),
                  const SizedBox(height: 20),
                  if (!_isOtpSent)
                    ElevatedButton(
                      onPressed: _sendOtp,
                      child: _isLoading
                          ? const CircularProgressIndicator(color: Colors.white)
                          : const Text('Send OTP'),
                    ),
                  if (_isOtpSent)
                    ElevatedButton(
                      onPressed: _isRegistrationMode ? _verifyOtp : _verifyLoginOtp,
                      child: _isLoading
                          ? const CircularProgressIndicator(color: Colors.white)
                          : const Text('Verify OTP'),
                    ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
