import 'package:flutter/material.dart';
import 'package:mobile/widgets/header.dart';
import 'package:mobile/widgets/footer.dart';

class DonationCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final String shortDescription;
  final String buttonText;
  final Color buttonColor;
  final String logoAsset;

  DonationCard({
    required this.title,
    required this.subtitle,
    required this.shortDescription,
    required this.buttonText,
    required this.buttonColor,
    required this.logoAsset,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12.0),
      ),
      elevation: 6.0,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Image.asset(
                  logoAsset,
                  height: 40,
                  width: 40,
                  fit: BoxFit.cover,
                ),
                const SizedBox(width: 8),
                Text(
                  subtitle,
                  style: const TextStyle(fontSize: 12, color: Colors.grey),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              title,
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Text(
              shortDescription,
              style: const TextStyle(fontSize: 14),
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () {},
              style: ElevatedButton.styleFrom(
                backgroundColor: buttonColor,
                minimumSize: const Size(double.infinity, 45),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
              child: Text(
                buttonText,
                style: const TextStyle(color: Colors.white),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class DonationPage extends StatefulWidget {
  const DonationPage({Key? key}) : super(key: key);

  @override
  _DonationPageState createState() => _DonationPageState();
}

class _DonationPageState extends State<DonationPage> {
  int _currentIndex = 0;

  void _navigateTo(int index) {
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
              child: SingleChildScrollView(
                child: Column(
                  children: [
                    DonationCard(
                      title: 'Donate to Tamil Nadu Relief Fund',
                      subtitle: 'Tamil Nadu State Government',
                      shortDescription: 'Support victims of the Chennai Floods.',
                      buttonText: 'Donate Now',
                      buttonColor: Colors.blue,
                      logoAsset: 'assets/images/Header_Logo.png',
                    ),
                    DonationCard(
                      title: 'Donate to Tamil Nadu Relief Fund',
                      subtitle: 'Tamil Nadu State Government',
                      shortDescription: 'Support victims of the Chennai Floods.',
                      buttonText: 'Donate Now',
                      buttonColor: Colors.blue,
                      logoAsset: 'assets/images/Header_Logo.png',
                    ),
                    DonationCard(
                      title: 'Donate to Tamil Nadu Relief Fund',
                      subtitle: 'Tamil Nadu State Government',
                      shortDescription: 'Support victims of the Chennai Floods.',
                      buttonText: 'Donate Now',
                      buttonColor: Colors.blue,
                      logoAsset: 'assets/images/Header_Logo.png',
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
