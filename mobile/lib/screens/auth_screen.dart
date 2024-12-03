import 'package:flutter/material.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:mobile/services/api_service.dart';
import 'package:firebase_messaging/firebase_messaging.dart';

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

  bool _isRegistrationMode = true;
  bool _isLoading = false;
  String? _fcmToken; // Store FCM token

  @override
  void initState() {
    super.initState();
    setupPushNotification();
    Future.delayed(Duration.zero, () async {
      await _checkToken();
    });
  }

  Future<void> setupPushNotification() async {
    final fcm = FirebaseMessaging.instance;

    // Request permission and fetch FCM token
    await fcm.requestPermission();
    _fcmToken = await fcm.getToken();
    if (_fcmToken != null) {
      print('FCM Token: $_fcmToken');
    }
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
    if (_fcmToken == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('fcm_token_not_found'.tr())),
      );
      return;
    }

    setState(() {
      _isLoading = true;
    });

    try {
      final response = await ApiService.registerWithAadhar(
        name: _nameController.text,
        email: _emailController.text,
        phoneNumber: _phoneNumberController.text,
        aadharNumber: _aadharController.text,
        fcmToken: _fcmToken!, // Pass FCM token
      );
      await _saveUserDataAndNavigate(response);
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('registration_failed'.tr(args: [e.toString()]))),
      );
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _loginWithAadhar() async {
    if (!_validateInputs(forLogin: true)) return;
    if (_fcmToken == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('fcm_token_not_found'.tr())),
      );
      return;
    }

    setState(() {
      _isLoading = true;
    });

    try {
      final response = await ApiService.loginWithAadhar(
        phoneNumber: _phoneNumberController.text,
        fcmToken: _fcmToken!, // Pass FCM token
      );
      await _saveUserDataAndNavigate(response);
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('login_failed'.tr(args: [e.toString()]))),
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
    final userData = response['createdUser'] ?? response['user']; // Handle both cases
    if (userData == null || response['accessToken'] == null) {
      throw Exception('invalid_response'.tr());
    }

    // Save user data
    await prefs.setString('userToken', response['accessToken']);
    await prefs.setString('userId', userData['_id'] ?? ''); // Save userId
    await prefs.setString('userName', userData['name'] ?? '');
    await prefs.setString('userEmail', userData['email'] ?? '');
    await prefs.setString('userPhoneNumber', userData['mobileNo'] ?? '');
    await prefs.setString('userAadharNumber', userData['aadharNo'] ?? '');
    await prefs.setString('userGender', userData['gender'] ?? '');
    await prefs.setString('userState', userData['state'] ?? '');
    await prefs.setBool('isLoggedIn', true);

    // Navigate to home screen
    Navigator.of(context).pushReplacementNamed('/home_screen');
  } catch (e) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('save_user_data_failed'.tr(args: [e.toString()]))),
    );
  }
}


  bool _validateInputs({bool forLogin = false}) {
    if (_phoneNumberController.text.length != 10 ||
        int.tryParse(_phoneNumberController.text) == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('invalid_phone_number'.tr())),
      );
      return false;
    }

    if (!forLogin) {
      if (_aadharController.text.length != 12 ||
          int.tryParse(_aadharController.text) == null) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('invalid_aadhar_number'.tr())),
        );
        return false;
      }

      if (_nameController.text.isEmpty || _emailController.text.isEmpty) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('all_fields_required'.tr())),
        );
        return false;
      }
    }

    return true;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('authentication'.tr())),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: SingleChildScrollView(
          child: Column(
            children: [
              Text(
                'welcome_text'.tr(),
                style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 20),
              DropdownButton<bool>(
                value: _isRegistrationMode,
                items: [
                  DropdownMenuItem(value: true, child: Text('register'.tr())),
                  DropdownMenuItem(value: false, child: Text('login'.tr())),
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
                      decoration: InputDecoration(
                        labelText: 'name'.tr(),
                        border: const OutlineInputBorder(),
                        prefixIcon: const Icon(Icons.person),
                      ),
                    ),
                    const SizedBox(height: 20),
                    TextField(
                      controller: _emailController,
                      decoration: InputDecoration(
                        labelText: 'email'.tr(),
                        border: const OutlineInputBorder(),
                        prefixIcon: const Icon(Icons.email),
                      ),
                    ),
                    const SizedBox(height: 20),
                    TextField(
                      controller: _aadharController,
                      decoration: InputDecoration(
                        labelText: 'aadhar_number'.tr(),
                        border: const OutlineInputBorder(),
                        prefixIcon: const Icon(Icons.credit_card),
                      ),
                    ),
                  ],
                ),
              const SizedBox(height: 20),
              TextField(
                controller: _phoneNumberController,
                decoration: InputDecoration(
                  labelText: 'phone_number'.tr(),
                  border: const OutlineInputBorder(),
                  prefixIcon: const Icon(Icons.phone),
                ),
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: _isLoading
                    ? null
                    : (_isRegistrationMode ? _registerWithAadhar : _loginWithAadhar),
                child: _isLoading
                    ? const CircularProgressIndicator(color: Colors.white)
                    : Text(_isRegistrationMode ? 'register'.tr() : 'login'.tr()),
              ),
              const SizedBox(height: 20),
              DropdownButton<String>(
                value: context.locale.languageCode,
                items: [
                  DropdownMenuItem(value: 'en', child: Text('English')),
                  DropdownMenuItem(value: 'hi', child: Text('हिन्दी')),
                  DropdownMenuItem(value: 'mr', child: Text('मराठी')),
                ],
                onChanged: (languageCode) {
                  if (languageCode != null) {
                    context.setLocale(Locale(languageCode));
                  }
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
