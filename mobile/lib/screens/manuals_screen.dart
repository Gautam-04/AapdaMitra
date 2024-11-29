import 'package:flutter/material.dart';
import 'package:mobile/widgets/header.dart';
import 'package:mobile/widgets/footer.dart';

class ManualsScreen extends StatefulWidget {
  const ManualsScreen({Key? key}) : super(key: key);

  @override
  _ManualsScreenState createState() => _ManualsScreenState();
}

class _ManualsScreenState extends State<ManualsScreen> {
  int _currentIndex = 3; // Index for Manuals in Footer

  void _navigateTo(int index) {
    switch (index) {
      case 0:
        Navigator.pushReplacementNamed(context, '/home_screen');
        break;
      case 1:
        Navigator.pushReplacementNamed(context, '/donation_screen');
        break;
      case 2:
        Navigator.pushReplacementNamed(context, '/raiseIssue_screen');
        break;
      case 3:
        Navigator.pushReplacementNamed(context, '/manuals_screen');
        break;
    }
    setState(() {
      _currentIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            const Header(),
            Expanded(
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: const [
                    Icon(Icons.menu_book, size: 100, color: Colors.blue),
                    SizedBox(height: 20),
                    Text(
                      'Manuals are under construction!',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                      textAlign: TextAlign.center,
                    ),
                    SizedBox(height: 10),
                    Text(
                      'Please check back later.',
                      style: TextStyle(fontSize: 16),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: Footer(
        currentIndex: _currentIndex,
        onTap: _navigateTo,
      ),
    );
  }
}
