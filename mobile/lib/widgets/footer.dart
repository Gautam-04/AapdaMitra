import 'package:flutter/material.dart';

class Footer extends StatelessWidget {
  final int currentIndex;
  final ValueChanged<int> onTap;

  const Footer({Key? key, required this.currentIndex, required this.onTap}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return BottomNavigationBar(
      currentIndex: currentIndex,
      onTap: (index) {
        onTap(index); // Update the current index in the parent widget
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
      },
      selectedItemColor: Colors.blue, // Highlight selected item
      unselectedItemColor: Colors.black54, // Color for unselected items
      backgroundColor: Colors.white, // Background color of the footer
      showUnselectedLabels: true, // Show labels for unselected items
      type: BottomNavigationBarType.fixed, // Ensures equidistant items
      items: const [
        BottomNavigationBarItem(
          icon: Icon(Icons.home),
          label: 'Home',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.volunteer_activism),
          label: 'Donations',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.report_problem),
          label: 'Raise Issue',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.menu_book),
          label: 'Manuals',
        ),
      ],
    );
  }
}
