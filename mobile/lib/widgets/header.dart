import 'package:flutter/material.dart';

class Header extends StatelessWidget {
  const Header({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(left: 16.0, right: 16.0, top: 40.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          // Back Button
          IconButton(
            icon: const Icon(Icons.arrow_back),
            onPressed: () {
              Navigator.pop(context); // This will take you back to the previous screen
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
    );
  }
}
