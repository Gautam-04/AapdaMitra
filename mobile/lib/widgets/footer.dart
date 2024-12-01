import 'package:flutter/material.dart';
import 'package:mobile/screens/donation_screen.dart';
import 'package:mobile/screens/home_screen.dart';
import 'package:mobile/screens/manuals_screen.dart';
import 'package:mobile/screens/raiseIssue_screen.dart';

class Footer extends StatelessWidget {
  final int currentIndex;
  final ValueChanged<int> onTap;

  const Footer({Key? key, required this.currentIndex, required this.onTap}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return BottomNavigationBar(
      currentIndex: currentIndex,
      onTap: (index) {
        onTap(index); // Notify the parent widget of the index change
        switch (index) {
          case 0:
            _navigateWithoutAnimation(context, '/home_screen');
            break;
          case 1:
            _navigateWithoutAnimation(context, '/donation_screen');
            break;
          case 2:
            _navigateWithoutAnimation(context, '/raiseIssue_screen');
            break;
          case 3:
            _navigateWithoutAnimation(context, '/manuals_screen');
            break;
        }
      },
      selectedItemColor: Colors.blue, // Highlight selected item
      unselectedItemColor: Colors.black54, // Color for unselected items
      backgroundColor: Colors.white, // Footer background color
      showUnselectedLabels: true, // Show labels for unselected items
      type: BottomNavigationBarType.fixed, // Ensures equidistant items
      items: [
        BottomNavigationBarItem(
          icon: Image.asset(
            'assets/images/footer_home.png',
            width: 24,
            height: 24,
          ),
          label: 'Home',
        ),
        BottomNavigationBarItem(
          icon: Image.asset(
            'assets/images/footer_donation.png',
            width: 24,
            height: 24,
          ),
          label: 'Donations',
        ),
        BottomNavigationBarItem(
          icon: Image.asset(
            'assets/images/footer_raiseIssue.png',
            width: 24,
            height: 24,
          ),
          label: 'Raise Issue',
        ),
        BottomNavigationBarItem(
          icon: Image.asset(
            'assets/images/footer_manual.png',
            width: 24,
            height: 24,
          ),
          label: 'Manuals',
        ),
      ],
    );
  }

  void _navigateWithoutAnimation(BuildContext context, String routeName) {
    Navigator.of(context).pushAndRemoveUntil(
      PageRouteBuilder(
        pageBuilder: (context, animation1, animation2) => _getScreen(context, routeName),
        transitionDuration: Duration.zero, // Remove the animation duration
        reverseTransitionDuration: Duration.zero,
      ),
      (route) => false, // Clear all previous routes
    );
  }

  Widget _getScreen(BuildContext context, String routeName) {
    // Define your routes to return the appropriate widget here
    switch (routeName) {
      case '/home_screen':
        return const HomeScreen();
      case '/donation_screen':
        return const DonationPage();
      case '/raiseIssue_screen':
        return const RaiseIssueScreen();
      case '/manuals_screen':
        return const ManualsScreen();
      default:
        throw Exception("Route not defined: $routeName");
    }
  }
}

