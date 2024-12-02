import 'package:flutter/material.dart';
import 'package:mobile/screens/auth_screen.dart'; // You can keep this or remove it if not needed temporarily.
import 'package:mobile/screens/home_screen.dart';
import 'package:mobile/screens/donation_screen.dart';
import 'package:mobile/screens/raiseIssue_screen.dart';
import 'package:mobile/screens/manuals_screen.dart';
// import 'package:shared_preferences/shared_preferences.dart'; // You can comment this out as well if it's not being used now.

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const MyApp());
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  // late Future<bool> _isLoggedInFuture;

  @override
  void initState() {
    super.initState();
    // _isLoggedInFuture = _checkLoginStatus();
  }

  // /// Check if the user is logged in
  // Future<bool> _checkLoginStatus() async {
  //   final prefs = await SharedPreferences.getInstance();
  //   return prefs.getBool('isLoggedIn') ?? false;
  // }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Aapda Mitra | NDRF',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        fontFamily: 'Inter', // Setting the global font family to 'Inter'
        scaffoldBackgroundColor: Colors.white, // Setting background color to white
        textTheme: const TextTheme(
          bodyLarge: TextStyle(fontFamily: 'Inter'), // Ensuring 'Inter' is used in the app
          bodyMedium: TextStyle(fontFamily: 'Inter'),
        ),
      ),
      initialRoute: '/',
      routes: {
        '/': (context) => const HomeScreen(),
        '/home_screen': (context) => const HomeScreen(),
        '/donation_screen': (context) => const DonationPage(),
        '/raiseIssue_screen': (context) => const RaiseIssueScreen(),
        '/manuals_screen': (context) => const ManualsScreen(),
      },
    );
  }

  // /// Error screen in case of issues with loading preferences
  // Widget _buildErrorScreen() {
  //   return Scaffold(
  //     body: Center(
  //       child: Column(
  //         mainAxisAlignment: MainAxisAlignment.center,
  //         children: [
  //           const Icon(Icons.error, color: Colors.red, size: 80),
  //           const SizedBox(height: 20),
  //           const Text(
  //             'Something went wrong!',
  //             style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
  //           ),
  //           const SizedBox(height: 10),
  //           ElevatedButton(
  //             onPressed: () {
  //               setState(() {
  //                 _isLoggedInFuture = _checkLoginStatus(); // Retry fetching login status
  //               });
  //             },
  //             child: const Text('Retry'),
  //           ),
  //         ],
  //       ),
  //     ),
  //   );
  // }
}
