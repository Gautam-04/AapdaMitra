import 'package:flutter/material.dart';
import 'package:mobile/services/api_service.dart';
import 'package:mobile/widgets/footer.dart';
import 'package:mobile/widgets/header.dart';

class VerifiedPostsScreen extends StatefulWidget {
  const VerifiedPostsScreen({super.key, required List<Map<String, String>> posts});

  @override
  _VerifiedPostsScreenState createState() => _VerifiedPostsScreenState();
}

class _VerifiedPostsScreenState extends State<VerifiedPostsScreen> {
  int _currentIndex = 0;
  List<Map<String, dynamic>> posts = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    fetchPosts();
  }

  Future<void> fetchPosts() async {
    try {
      final List<Map<String, dynamic>> fetchedPosts =
          await ApiService.fetchVerifiedPosts();
      setState(() {
        posts = fetchedPosts;
        isLoading = false;
      });
    } catch (error) {
      setState(() {
        isLoading = false;
      });
      print('Error fetching verified posts: $error');
    }
  }

  void _navigateTo(int index) {
    setState(() {
      _currentIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(100.0),
        child: const Header(),
      ),
      body: SafeArea(
        child: isLoading
            ? const Center(child: CircularProgressIndicator())
            : posts.isEmpty
                ? const Center(child: Text('No verified posts available'))
                : SingleChildScrollView(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const SizedBox(height: 20),
                        ListView.builder(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          itemCount: posts.length,
                          itemBuilder: (context, index) {
                            final post = posts[index];
                            return PostCard(post: post);
                          },
                        ),
                      ],
                    ),
                  ),
      ),
      bottomNavigationBar: Footer(
        currentIndex: _currentIndex,
        onTap: _navigateTo,
      ),
    );
  }
}

class PostCard extends StatelessWidget {
  final Map<String, dynamic> post;

  const PostCard({super.key, required this.post});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 10.0, horizontal: 16.0),
      child: Container(
        decoration: BoxDecoration(
          border: Border.all(color: Colors.grey.shade300),
          borderRadius: BorderRadius.circular(10.0),
          color: Colors.white,
        ),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(10.0),
                child: post['imageUrl'] != null
                    ? Image.network(
                        post['imageUrl'] ?? 'https://via.placeholder.com/150',
                        height: 200,
                        width: double.infinity,
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) => Container(
                          height: 200,
                          width: double.infinity,
                          color: Colors.grey[300],
                          child: const Icon(
                            Icons.broken_image,
                            size: 50,
                            color: Colors.grey,
                          ),
                        ),
                      )
                    : Container(
                        height: 200,
                        width: double.infinity,
                        color: Colors.grey[300],
                        child: const Icon(
                          Icons.broken_image,
                          size: 50,
                          color: Colors.grey,
                        ),
                      ),
              ),
              const SizedBox(height: 10),
              post['title'] != null
                  ? Text(
                      post['title'] ?? 'No Title',
                      style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                      overflow: TextOverflow.ellipsis,
                    )
                  : const SizedBox.shrink(),
              const SizedBox(height: 10),
              post['date'] != null
                  ? Text(
                      post['date'] ?? 'No Date',
                      style: const TextStyle(fontSize: 16, color: Colors.grey),
                    )
                  : const SizedBox.shrink(),
              const SizedBox(height: 10),
              post['body'] != null
                  ? Text(
                      post['body'] ?? 'No description available',
                      style: const TextStyle(fontSize: 16),
                    )
                  : const SizedBox.shrink(),
              const SizedBox(height: 10),
              post['location'] != null
                  ? Text(
                      'Location: ${post['location'] ?? 'Unknown'}',
                      style: const TextStyle(fontSize: 16, color: Colors.grey),
                    )
                  : const SizedBox.shrink(),
              const SizedBox(height: 10),
              post['type'] != null
                  ? Text(
                      'Type: ${post['type'] ?? 'Unknown'}',
                      style: const TextStyle(fontSize: 16, color: Colors.grey),
                    )
                  : const SizedBox.shrink(),
              const SizedBox(height: 10),
              post['source'] != null
                  ? Text(
                      'Source: ${post['source'] ?? 'Unknown'}',
                      style: const TextStyle(fontSize: 16, color: Colors.grey),
                    )
                  : const SizedBox.shrink(),
              const SizedBox(height: 10),
              post['priority'] != null
                  ? Text(
                      'Priority: ${post['priority'] ?? 'Normal'}',
                      style: const TextStyle(fontSize: 16, color: Colors.grey),
                    )
                  : const SizedBox.shrink(),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }
}
