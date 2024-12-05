import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:mobile/services/api_service.dart';
import 'package:mobile/widgets/header.dart';
import 'package:mobile/widgets/footer.dart';

class IssuesRaisedScreen extends StatefulWidget {
  const IssuesRaisedScreen({Key? key, required this.issues}) : super(key: key);

  final List<Map<String, dynamic>> issues;

  @override
  _IssuesRaisedScreenState createState() => _IssuesRaisedScreenState();
}

class _IssuesRaisedScreenState extends State<IssuesRaisedScreen> {
  late Future<List<Map<String, dynamic>>> _issuesFuture;

  @override
  void initState() {
    super.initState();
    _issuesFuture = ApiService.fetchPersonalIssues(); // Initial fetch
  }

  Future<void> _refreshIssues() async {
    setState(() {
      _issuesFuture = ApiService.fetchPersonalIssues();
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
              child: FutureBuilder<List<Map<String, dynamic>>>(
                future: _issuesFuture,
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return const Center(child: CircularProgressIndicator());
                  } else if (snapshot.hasError) {
                    return Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Text(
                            'Something went wrong.',
                            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                          ),
                          Padding(
                            padding: const EdgeInsets.symmetric(vertical: 10),
                            child: Text(
                              '${snapshot.error}',
                              textAlign: TextAlign.center,
                              style: const TextStyle(color: Colors.red),
                            ),
                          ),
                          ElevatedButton(
                            onPressed: _refreshIssues,
                            child: const Text('Retry'),
                          ),
                        ],
                      ),
                    );
                  } else if (snapshot.hasData) {
                    final issues = snapshot.data!;
                    if (issues.isEmpty) {
                      return const Center(
                        child: Text(
                          'No issues raised by you.',
                          style: TextStyle(fontSize: 16),
                        ),
                      );
                    }

                    // Debug the fetched issues
                    print('Fetched Issues: $issues');

                    return RefreshIndicator(
                      onRefresh: _refreshIssues,
                      child: ListView.builder(
                        itemCount: issues.length,
                        itemBuilder: (context, index) {
                          final issue = issues[index];
                          return Card(
                            margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
                            elevation: 6,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(25),
                            ),
                            child: Container(
                              padding: const EdgeInsets.all(16),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(25),
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  if (issue['photo'] != null && issue['photo'].isNotEmpty)
                                    ClipRRect(
                                      borderRadius: BorderRadius.circular(15),
                                      child: Padding(
                                        padding: const EdgeInsets.only(bottom: 8),
                                        child: Image.memory(
                                          base64Decode(issue['photo']),
                                          width: double.infinity,
                                          height: 220,
                                          fit: BoxFit.cover,
                                          errorBuilder: (context, error, stackTrace) =>
                                              const Center(child: Text('Image not available')),
                                        ),
                                      ),
                                    ),
                                  ListTile(
                                    title: Text(
                                      issue['issueTitle'] ?? 'No Title',
                                      style: const TextStyle(
                                        fontWeight: FontWeight.bold,
                                        color: Color(0xFF2B3674),
                                      ),
                                    ),
                                    subtitle: Text(
                                      issue['description'] ?? 'No Description',
                                      style: const TextStyle(
                                        color: Color(0xFF2B3674),
                                      ),
                                    ),
                                    trailing: Text(
                                      issue['status'] ?? 'Pending',
                                      style: TextStyle(
                                        color: issue['status'] == 'Verified'
                                            ? Colors.green
                                            : Colors.red,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
                    );
                  } else {
                    return const Center(
                      child: Text(
                        'No data available.',
                        style: TextStyle(fontSize: 16),
                      ),
                    );
                  }
                },
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: Footer(
        currentIndex: 2,
        onTap: (index) {},
      ),
    );
  }
}