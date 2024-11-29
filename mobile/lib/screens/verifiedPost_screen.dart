import 'package:flutter/material.dart';
import 'package:mobile/widgets/footer.dart';
import 'package:mobile/widgets/header.dart'; // Import the Header widget

class VerifiedPostsScreen extends StatefulWidget {
  final List<Map<String, String>> posts; // Accept the list of posts

  const VerifiedPostsScreen({super.key, required this.posts});

  @override
  _VerifiedPostsScreenState createState() => _VerifiedPostsScreenState();
}

class _VerifiedPostsScreenState extends State<VerifiedPostsScreen> {
  int _currentIndex = 0;

  // This function will handle the navigation for the footer
  void _navigateTo(int index) {
    setState(() {
      _currentIndex = index;
    });
    // You can add logic here to navigate to different screens based on the index if required
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(100.0), // Set height for your header
        child: const Header(), // Use your custom Header widget here
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 20), // Add spacing below the header if needed
              ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: widget.posts.length,
                itemBuilder: (context, index) {
                  final post = widget.posts[index];
                  return Padding(
                    padding: const EdgeInsets.symmetric(vertical: 10.0, horizontal: 16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Image.asset(
                          'assets/images/Sample_Image.png',
                          height: 200,
                          width: double.infinity,
                          fit: BoxFit.cover,
                        ),
                        const SizedBox(height: 10),
                        Text(
                          post['title'] ?? 'No Title',
                          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 10),
                        Text(
                          post['date'] ?? 'No Date',
                          style: const TextStyle(fontSize: 16, color: Colors.grey),
                        ),
                        const SizedBox(height: 10),
                        const Text(
                          'Details: This is a description of the verified post that provides more information about the incident or post being shared.',
                          style: TextStyle(fontSize: 16),
                        ),
                        const SizedBox(height: 20),
                      ],
                    ),
                  );
                },
              ),
            ],
          ),
        ),
      ),
      bottomNavigationBar: Footer( // Reuse Footer widget
        currentIndex: _currentIndex,
        onTap: _navigateTo,
      ),
    );
  }
}
