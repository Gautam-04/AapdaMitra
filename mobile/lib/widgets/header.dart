import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class Header extends StatelessWidget {
  const Header({Key? key}) : super(key: key);

  Future<void> _logout(BuildContext context) async {
    final prefs = await SharedPreferences.getInstance();

    // Remove all stored user data
    await prefs.remove('userToken');
    await prefs.remove('userName');
    await prefs.remove('userEmail');
    await prefs.remove('userPhoneNumber');
    await prefs.remove('userAadharNumber');
    await prefs.remove('userGender');
    await prefs.remove('userState');
    await prefs.setBool('isLoggedIn', false); // Set the login status to false

    // Redirect to authentication screen
    Navigator.pushNamedAndRemoveUntil(
      context,
      '/auth_screen', // Navigate to the Auth Screen
      (route) => false, // Clear all previous routes
    );
  }

  // Show a confirmation dialog for logging out
  Future<void> _showLogoutDialog(BuildContext context) async {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Logout'),
          content: const Text('Do you really want to logout?'),
          actions: <Widget>[
            TextButton(
              child: const Text('Cancel'),
              onPressed: () {
                Navigator.of(context).pop(); // Close the dialog
              },
            ),
            TextButton(
              child: const Text('Logout'),
              onPressed: () {
                Navigator.of(context).pop(); // Close the dialog
                _logout(context); // Proceed with logout
              },
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(top: 30.0), // Adjust this value to lower the header
      child: Container(
        width: MediaQuery.of(context).size.width, // Full width of the screen
        height: 55,
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(0.2), // Reduced opacity for a softer shadow
              spreadRadius: 1, // Less spread to make the shadow less outward
              blurRadius: 3, // Lower blur for a subtle effect
              offset: const Offset(0, 2), // Slightly smaller offset for a gentler shadow
            ),
          ],
        ),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              // Back Button
              IconButton(
                icon: const Icon(Icons.arrow_back),
                onPressed: () {
                  Navigator.pushNamedAndRemoveUntil(
                    context,
                    '/home_screen', // Navigate to the home screen
                    (route) => false, // Clear all previous routes
                  );
                },
              ),
              // Centered Logo
              Expanded(
                child: Center(
                  child: Image.asset(
                    'assets/images/Header_Logo.png',
                    height: 40,
                  ),
                ),
              ),
              // Profile Image on the right with logout confirmation
              GestureDetector(
                onTap: () {
                  _showLogoutDialog(context); // Show logout confirmation dialog
                },
                child: CircleAvatar(
                  backgroundImage: AssetImage('assets/images/Avatar.png'),
                  radius: 20,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
