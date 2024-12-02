import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:mobile/services/api_service.dart';

class AuthScreen extends StatefulWidget {
  const AuthScreen({Key? key}) : super(key: key);

  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> {
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _phoneNumberController = TextEditingController();
  final TextEditingController _aadharController = TextEditingController();

  bool _isRegistrationMode = true; // Toggle between Registration and Login
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _checkToken(); // Check token on startup
  }

  Future<void> _checkToken() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('userToken');
    if (token != null) {
      Navigator.of(context).pushReplacementNamed('/home_screen');
    }
  }

  Future<void> _registerWithAadhar() async {
    if (!_validateInputs()) return;

    setState(() {
      _isLoading = true;
    });

    try {
      final response = await ApiService.registerWithAadhar(
        name: _nameController.text,
        email: _emailController.text,
        phoneNumber: _phoneNumberController.text,
        aadharNumber: _aadharController.text,
      );

      await _saveUserDataAndNavigate(response);
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Registration failed: $e')),
      );
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _loginWithAadhar() async {
    if (!_validateInputs(forLogin: true)) return;

    setState(() {
      _isLoading = true;
    });

    try {
      final response = await ApiService.loginWithAadhar(
        phoneNumber: _phoneNumberController.text,
      );

      await _saveUserDataAndNavigate(response);
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Login failed: $e')),
      );
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _saveUserDataAndNavigate(Map<String, dynamic> response) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final userData = response['createdUser']; // Updated key to use 'createdUser'

      if (userData == null || response['accessToken'] == null) {
        throw Exception('Invalid response from server');
      }

      await prefs.setString('userToken', response['accessToken']);
      await prefs.setString('userName', userData['name'] ?? '');
      await prefs.setString('userEmail', userData['email'] ?? '');
      await prefs.setString('userPhoneNumber', userData['mobileNo'] ?? '');
      await prefs.setString('userAadharNumber', userData['aadharNo'] ?? '');
      await prefs.setString('userGender', userData['gender'] ?? '');
      await prefs.setString('userState', userData['state'] ?? '');
      await prefs.setBool('isLoggedIn', true);

      Navigator.of(context).pushReplacementNamed('/home_screen');
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to save user data: $e')),
      );
    }
  }

  bool _validateInputs({bool forLogin = false}) {
    if (_phoneNumberController.text.length != 10 ||
        int.tryParse(_phoneNumberController.text) == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter a valid 10-digit phone number.')),
      );
      return false;
    }

    if (!forLogin) {
      if (_aadharController.text.length != 12 ||
          int.tryParse(_aadharController.text) == null) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Please enter a valid 12-digit Aadhaar number.')),
        );
        return false;
      }

      if (_nameController.text.isEmpty || _emailController.text.isEmpty) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('All fields are required for registration.')),
        );
        return false;
      }
    }

    return true;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Authentication')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: SingleChildScrollView(
          child: Column(
            children: [
              const Text(
                'Welcome to Aapda Mitra',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 20),
              DropdownButton<bool>(
                value: _isRegistrationMode,
                items: const [
                  DropdownMenuItem(value: true, child: Text('Register')),
                  DropdownMenuItem(value: false, child: Text('Login')),
                ],
                onChanged: (value) {
                  setState(() {
                    _isRegistrationMode = value ?? true;
                  });
                },
              ),
              const SizedBox(height: 20),
              if (_isRegistrationMode)
                Column(
                  children: [
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
                    TextField(
                      controller: _aadharController,
                      decoration: const InputDecoration(
                        labelText: 'Aadhaar Number',
                        border: OutlineInputBorder(),
                        prefixIcon: Icon(Icons.credit_card),
                      ),
                    ),
                  ],
                ),
              const SizedBox(height: 20),
              TextField(
                controller: _phoneNumberController,
                decoration: const InputDecoration(
                  labelText: 'Phone Number',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.phone),
                ),
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: _isLoading
                    ? null
                    : (_isRegistrationMode ? _registerWithAadhar : _loginWithAadhar),
                child: _isLoading
                    ? const CircularProgressIndicator(color: Colors.white)
                    : Text(_isRegistrationMode ? 'Register' : 'Login'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
