import 'package:flutter/material.dart';

class Header extends StatelessWidget {
  const Header({Key? key}) : super(key: key);

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
              // Profile Image on the right
              CircleAvatar(
                backgroundImage: AssetImage('assets/images/Avatar.png'),
                radius: 20,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
