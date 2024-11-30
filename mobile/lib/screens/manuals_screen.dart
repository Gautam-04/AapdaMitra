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
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Manuals',
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 16.0),
                    ManualButton(
                      title: 'CPR Manual',
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) =>
                                const InstructionPage(title: 'CPR Manual Instructions'),
                          ),
                        );
                      },
                    ),
                    ManualButton(
                      title: 'Earthquake Manual',
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const EarthquakeManualPage(),
                          ),
                        );
                      },
                    ),
                    ManualButton(
                      title: 'Fire Extinguisher Manual',
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const FireExtinguisherManualPage(),
                          ),
                        );
                      },
                    ),
                    ManualButton(
                      title: 'Flood Manual',
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) =>
                                const InstructionPage(title: 'Flood Manual Instructions'),
                          ),
                        );
                      },
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

class ManualButton extends StatelessWidget {
  final String title;
  final VoidCallback onTap;

  const ManualButton({required this.title, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: ElevatedButton(
        style: ElevatedButton.styleFrom(
          foregroundColor: Colors.black,
          backgroundColor: Colors.white,
          elevation: 4,
          padding: const EdgeInsets.symmetric(vertical: 16.0),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8.0),
          ),
        ),
        onPressed: onTap,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              title,
              style: const TextStyle(fontSize: 16.0, fontWeight: FontWeight.w500),
            ),
            const Icon(Icons.arrow_forward_ios, size: 16.0),
          ],
        ),
      ),
    );
  }
}

class FireExtinguisherManualPage extends StatelessWidget {
  const FireExtinguisherManualPage({Key? key}) : super(key: key);

  final List<String> manualImages = const [
    'assets/images/extinguisher_1.png',
    'assets/images/extinguisher_2.png',
    'assets/images/extinguisher_3.png',
    'assets/images/extinguisher_4.png',
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            const Header(),
            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: GridView.builder(
                  itemCount: manualImages.length,
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    mainAxisSpacing: 10.0,
                    crossAxisSpacing: 10.0,
                  ),
                  itemBuilder: (context, index) {
                    return Card(
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16.0),
                      ),
                      elevation: 4,
                      child: Padding(
                        padding: const EdgeInsets.all(12.0),
                        child: Image.asset(
                          manualImages[index],
                          fit: BoxFit.contain,
                        ),
                      ),
                    );
                  },
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.only(right: 16.0, bottom: 16.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  InkWell(
                    onTap: () {
                      // Add chatbot click functionality here
                    },
                    child: CircleAvatar(
                      radius: 30,
                      backgroundColor: Colors.indigo,
                      child: CircleAvatar(
                        radius: 26,
                        backgroundImage: AssetImage('assets/images/Bot_Image.png'),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: Footer(
        currentIndex: 3,
        onTap: (index) {
          if (index != 3) {
            Navigator.pushReplacementNamed(
              context,
              ['/home_screen', '/donation_screen', '/raiseIssue_screen'][index],
            );
          }
        },
      ),
    );
  }
}

class EarthquakeManualPage extends StatelessWidget {
  const EarthquakeManualPage({Key? key}) : super(key: key);

  final List<String> manualImages = const [
    'assets/images/image 2.png',
    'assets/images/image 4.png',
    'assets/images/image 5.png',
    'assets/images/image 6.png',
    'assets/images/image 7.png',
    'assets/images/image 8.png',
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            const Header(),
            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: GridView.builder(
                  itemCount: manualImages.length,
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    mainAxisSpacing: 10.0,
                    crossAxisSpacing: 10.0,
                  ),
                  itemBuilder: (context, index) {
                    return Card(
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16.0),
                      ),
                      elevation: 4,
                      child: Padding(
                        padding: const EdgeInsets.all(12.0),
                        child: Image.asset(
                          manualImages[index],
                          fit: BoxFit.contain,
                        ),
                      ),
                    );
                  },
                ),
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: Footer(
        currentIndex: 3,
        onTap: (index) {
          if (index != 3) {
            Navigator.pushReplacementNamed(
              context,
              ['/home_screen', '/donation_screen', '/raiseIssue_screen'][index],
            );
          }
        },
      ),
    );
  }
}

class InstructionPage extends StatelessWidget {
  final String title;

  const InstructionPage({required this.title, Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(title),
      ),
      body: Center(
        child: Text(
          'Instructions for $title',
          style: const TextStyle(fontSize: 18.0, fontWeight: FontWeight.bold),
        ),
      ),
    );
  }
}
