import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:mobile/services/api_service.dart';
import 'package:mobile/widgets/header.dart';
import 'package:mobile/widgets/footer.dart';

class IssuesRaisedScreen extends StatefulWidget {
  final List<Map<String, dynamic>>? issues;

  const IssuesRaisedScreen({Key? key, this.issues}) : super(key: key);

  @override
  _IssuesRaisedScreenState createState() => _IssuesRaisedScreenState();
}

class _IssuesRaisedScreenState extends State<IssuesRaisedScreen> {
  late Future<List<Map<String, dynamic>>> _issuesFuture;
  bool _isRefreshing = false;

  @override
  void initState() {
    super.initState();
    // Use provided issues if available; otherwise, fetch from the API
    if (widget.issues != null) {
      _issuesFuture = Future.value(widget.issues);
    } else {
      _issuesFuture = ApiService.fetchPersonalIssues();
    }
  }

  Future<void> _refreshIssues() async {
    setState(() {
      _isRefreshing = true;
    });
    try {
      final refreshedData = await ApiService.fetchPersonalIssues();
      setState(() {
        _issuesFuture = Future.value(refreshedData);
      });
    } catch (error) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Failed to refresh issues: $error'),
          backgroundColor: Colors.red,
        ),
      );
    } finally {
      setState(() {
        _isRefreshing = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            const Header(), // Added the Header widget
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
                    return RefreshIndicator(
                      onRefresh: _refreshIssues,
                      child: ListView.builder(
                        itemCount: issues.length,
                        itemBuilder: (context, index) {
                          final issue = issues[index];
                          return Card(
                            margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
                            elevation: 3,
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                if (issue['photo'] != null && issue['photo'].isNotEmpty)
                                  Image.memory(
                                    base64Decode(issue['photo']),
                                    width: double.infinity,
                                    height: 200,
                                    fit: BoxFit.cover,
                                    errorBuilder: (context, error, stackTrace) =>
                                        const Center(child: Text('Image not available')),
                                  ),
                                ListTile(
                                  title: Text(
                                    issue['issueTitle'] ?? 'No Title',
                                    style: const TextStyle(fontWeight: FontWeight.bold),
                                  ),
                                  subtitle: Text(issue['description'] ?? 'No Description'),
                                  trailing: Text(
                                    issue['status'] ?? 'Pending',
                                    style: TextStyle(
                                      color: issue['status'] == 'Resolved'
                                          ? Colors.green
                                          : Colors.red,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ),
                              ],
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
        currentIndex: 2, // Specify the appropriate index
        onTap: (index) {},
      ), // Added the Footer widget
    );
  }
}