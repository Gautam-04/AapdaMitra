import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:mobile/screens/chatbot_screen.dart';
import 'package:mobile/screens/donation_screen.dart';
import 'package:mobile/screens/raiseIssue_screen.dart';
import 'package:mobile/widgets/header.dart';
import 'package:mobile/widgets/footer.dart';
import 'package:mobile/screens/verifiedPost_screen.dart';
import 'package:mobile/screens/sos_screen.dart';
import 'package:mobile/screens/manuals_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;
  String _userName = ''; // Holds the user's name
  String _location = 'Mumbai'; // Example static location

  final List<Map<String, String>> verifiedPosts = [
    {"title": "Flash Floods Chennai", "date": "20 Sept, 2024"},
    {"title": "Earthquake Delhi", "date": "15 Sept, 2024"},
    {"title": "Cyclone Odisha", "date": "10 Sept, 2024"},
    {"title": "Wildfires California", "date": "5 Sept, 2024"},
  ];

  @override
  void initState() {
    super.initState();
    _loadUserName();
  }

  /// Load the user's name from SharedPreferences
  Future<void> _loadUserName() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _userName = prefs.getString('userName') ?? 'User'; // Default to 'User'
    });
  }

  void _navigateTo(int index) {
    setState(() {
      _currentIndex = index;
    });
    switch (index) {
      case 0:
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => const DonationPage()),
        );
        break;
      case 1:
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Navigate to Manual")),
        );
        break;
      case 2:
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Navigate to Alerts")),
        );
        break;
      case 3:
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Navigate to Profile")),
        );
        break;
    }
  }

  void _navigateToRaiseIssue() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => const RaiseIssueScreen(),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Stack(
          children: [
            SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Header(),
                  const SizedBox(height: 20),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16.0),
                    child: Text(
                      'Hi, $_userName\n📍 $_location',
                      style: const TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),
                  _IssuesRaisedButton(),
                  const SizedBox(height: 20),
                  _ActionButtons(onRaiseIssue: _navigateToRaiseIssue),
                  const SizedBox(height: 10),
                  _SOSAndDonationButtons(),
                  const SizedBox(height: 20),
                  const Padding(
                    padding: EdgeInsets.symmetric(horizontal: 16.0),
                    child: Text(
                      'Verified Posts',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        decoration: TextDecoration.underline,
                      ),
                    ),
                  ),
                  const SizedBox(height: 10),
                  VerifiedPostsList(verifiedPosts: verifiedPosts),
                ],
              ),
            ),
          ],
        ),
      ),
      floatingActionButton: _ChatbotButton(),
      floatingActionButtonLocation: FloatingActionButtonLocation.endDocked,
      bottomNavigationBar: Footer(
        currentIndex: _currentIndex,
        onTap: _navigateTo,
      ),
    );
  }
}

class _IssuesRaisedButton extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: ElevatedButton(
        onPressed: () {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text("Navigate to Issues")),
          );
        },
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.blue,
          minimumSize: const Size(double.infinity, 50),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10),
          ),
        ),
        child: const Text(
          '02 Issues raised around you',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
        ),
      ),
    );
  }
}

class _ActionButtons extends StatelessWidget {
  final VoidCallback onRaiseIssue;

  const _ActionButtons({required this.onRaiseIssue});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: Row(
        children: [
          Expanded(
            child: ElevatedButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const ManualsScreen(),
                  ),
                );
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.white,
                side: const BorderSide(color: Colors.blue),
                minimumSize: const Size(0, 50),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
              child: const Text(
                'Manual',
                style: TextStyle(color: Colors.blue),
              ),
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: ElevatedButton(
              onPressed: onRaiseIssue,
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.white,
                side: const BorderSide(color: Colors.blue),
                minimumSize: const Size(0, 50),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
              child: const Text(
                'Raise an Issue',
                style: TextStyle(color: Colors.blue),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _SOSAndDonationButtons extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: Row(
        children: [
          Expanded(
            child: ElevatedButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const DonationPage(),
                  ),
                );
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.white,
                side: const BorderSide(color: Colors.blue),
                minimumSize: const Size(0, 50),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
              child: const Text(
                'Donation',
                style: TextStyle(color: Colors.blue),
              ),
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: ElevatedButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const SOSScreen(),
                  ),
                );
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red,
                minimumSize: const Size(0, 50),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
              child: const Text(
                'SOS',
                style: TextStyle(color: Colors.white),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class VerifiedPostsList extends StatelessWidget {
  final List<Map<String, String>> verifiedPosts;

  const VerifiedPostsList({required this.verifiedPosts});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 220,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: verifiedPosts.length,
        itemBuilder: (context, index) {
          final post = verifiedPosts[index];
          return GestureDetector(
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => VerifiedPostsScreen(posts: verifiedPosts),
                ),
              );
            },
            child: VerifiedPostCard(post: post),
          );
        },
      ),
    );
  }
}

class VerifiedPostCard extends StatelessWidget {
  final Map<String, String> post;

  const VerifiedPostCard({required this.post});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(left: 16.0),
      child: SizedBox(
        width: 200,
        child: Card(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Image.asset(
                'assets/images/Sample_Image.png',
                height: 140,
                width: double.infinity,
                fit: BoxFit.cover,
              ),
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: Text(
                  '${post['title']}\n${post['date']}',
                  style: const TextStyle(fontSize: 14),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _ChatbotButton extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return FloatingActionButton(
      onPressed: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => ChatbotPage(),
          ),
        );
      },
      child: Image.asset(
        'assets/images/Bot_Image.png',
        fit: BoxFit.cover,
        height: 56,
        width: 56,
      ),
    );
  }
}
