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
            const Header(), // Keeping the header from your original code
            Expanded(
              child: EarthquakeManualPage(), // Added the EarthquakeManualPage here
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

class EarthquakeManualPage extends StatelessWidget {
  final List<String> manualImages = [
    'assets/images/image 2.png',
    'assets/images/image 4.png',
    'assets/images/image 5.png',
    'assets/images/image 6.png',
    'assets/images/image 7.png',
    'assets/images/image 8.png',
  ];

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Expanded(
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: GridView.builder(
              itemCount: manualImages.length,
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2, // Two cards per row
                mainAxisSpacing: 10.0,
                crossAxisSpacing: 10.0,
              ),
              itemBuilder: (context, index) {
                return Card(
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16.0),
                  ),
                  elevation: 4,
                  child: Center(
                    child: Padding(
                      padding: const EdgeInsets.all(12.0), // Add padding around the image
                      child: Image.asset(
                        manualImages[index],
                        height: 240, // Image height
                        width: 260, // Image width
                        fit: BoxFit.contain, // Ensures the image fits within the available space
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
        ),
        
      ],
    );
  }
}
