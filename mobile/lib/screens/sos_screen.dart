import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:shared_preferences/shared_preferences.dart'; // Import SharedPreferences
import 'package:mobile/widgets/header.dart';
import 'package:mobile/widgets/footer.dart';
import 'package:mobile/services/api_service.dart'; // Import ApiService

class SOSScreen extends StatefulWidget {
  const SOSScreen({super.key});

  @override
  _SOSScreenState createState() => _SOSScreenState();
}

class _SOSScreenState extends State<SOSScreen> with SingleTickerProviderStateMixin {
  bool _isEmergencySelected = false;
  String _selectedEmergencyType = '';
  String? _currentLocation;
  int _sosButtonClickCount = 0;
  late AnimationController _animationController;
  late Animation<Color?> _colorAnimation;

  final List<String> _emergencyTypes = [
    'Natural Disaster',
    'Medical',
    'Fire',
    'Infrastructure',
    'Other',
  ];

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    )..repeat(reverse: true);

    _colorAnimation = ColorTween(
      begin: Colors.red,
      end: Colors.white.withOpacity(0.5),
    ).animate(
      CurvedAnimation(
        parent: _animationController,
        curve: Curves.easeInOut,
      ),
    );
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  Future<Position?> _getLocationWithPermission() async {
    if (await Permission.location.request().isGranted) {
      return await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Location permission is required to use this feature.')),
      );
      return null;
    }
  }

  Future<void> _fetchLocation() async {
    final position = await _getLocationWithPermission();
    if (position != null) {
      setState(() {
        _currentLocation = '${position.latitude}, ${position.longitude}';
      });
    }
  }

  void _submitEmergency() async {
    // Fetch location before submitting the SOS
    if (_currentLocation == null) {
      await _fetchLocation();
    }

    try {
      // Retrieve stored user details
      final prefs = await SharedPreferences.getInstance();
      final String? name = prefs.getString('userName');
      final String? email = prefs.getString('userEmail');

      // Check if name and email are available
      if (name == null || email == null) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('User details not found. Please log in again.')),
        );
        return;
      }

      final response = await ApiService.sendSos(
        name: name,
        email: email,
        location: _currentLocation ?? 'Unknown Location',
        emergencyType: _selectedEmergencyType,
      );

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('SOS sent successfully: ${response['message']}')),
      );

      // Reset SOS UI
      _cancelSOS();
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to send SOS: $e')),
      );
    }
  }

  void _showEmergencyDropdown() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (BuildContext context) {
        String? tempSelectedType = _selectedEmergencyType;

        return StatefulBuilder(
          builder: (BuildContext context, StateSetter setModalState) {
            return Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Text(
                    'Select Emergency Type',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 20),
                  DropdownButtonFormField<String>(
                    value: tempSelectedType!.isNotEmpty ? tempSelectedType : null,
                    decoration: InputDecoration(
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                      hintText: 'Choose Emergency Type',
                    ),
                    items: _emergencyTypes.map((String type) {
                      return DropdownMenuItem<String>(
                        value: type,
                        child: Text(type),
                      );
                    }).toList(),
                    onChanged: (String? newValue) {
                      setModalState(() {
                        tempSelectedType = newValue!;
                      });
                    },
                  ),
                  const SizedBox(height: 20),
                  ElevatedButton(
                    onPressed: tempSelectedType != null && tempSelectedType!.isNotEmpty
                        ? () {
                            Navigator.pop(context);
                            setState(() {
                              _selectedEmergencyType = tempSelectedType!;
                              _isEmergencySelected = true;
                              _submitEmergency(); // Send SOS when submitting emergency
                            });
                          }
                        : null,
                    style: ElevatedButton.styleFrom(
                      minimumSize: const Size(double.infinity, 50),
                      backgroundColor: Colors.red,
                    ),
                    child: const Text(
                      'Submit Emergency',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 16,
                      ),
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  void _cancelSOS() {
    setState(() {
      _isEmergencySelected = false;
      _selectedEmergencyType = '';
      _currentLocation = null;
      _sosButtonClickCount = 0;
      _animationController.reset();
      _animationController.repeat(reverse: true);
    });
  }

  void _handleSOSClick() {
    setState(() {
      _sosButtonClickCount += 1;

      if (_sosButtonClickCount >= 5) {
        _isEmergencySelected = true;
        _selectedEmergencyType = 'SOS Triggered';
        _submitEmergency(); // Send SOS automatically
        _animationController.forward(); // Start blinking animation
      } else if (!_isEmergencySelected) {
        _showEmergencyDropdown();
      }
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
              child: Center(
                child: AnimatedBuilder(
                  animation: _colorAnimation,
                  builder: (context, child) {
                    return GestureDetector(
                      onTap: _isEmergencySelected ? null : _handleSOSClick,
                      child: Container(
                        width: 300,
                        height: 300,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: _isEmergencySelected
                              ? _colorAnimation.value
                              : Colors.red,
                          boxShadow: [
                            BoxShadow(
                              color: Colors.red.withOpacity(0.5),
                              spreadRadius: 10,
                              blurRadius: 20,
                            ),
                          ],
                        ),
                        child: Center(
                          child: Text(
                            _isEmergencySelected
                                ? _selectedEmergencyType
                                : 'SOS',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              fontSize: _isEmergencySelected ? 24 : 72,
                              fontWeight: FontWeight.bold,
                              color: _isEmergencySelected
                                  ? Colors.red
                                  : Colors.white,
                            ),
                          ),
                        ),
                      ),
                    );
                  },
                ),
              ),
            ),
            if (_isEmergencySelected)
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: [
                    if (_currentLocation != null)
                      Text(
                        'Current Location: $_currentLocation',
                        style: const TextStyle(
                          fontSize: 16,
                          color: Colors.black54,
                        ),
                      ),
                    const SizedBox(height: 10),
                    ElevatedButton(
                      onPressed: _cancelSOS,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.red,
                        minimumSize: const Size(150, 50),
                      ),
                      child: const Text(
                        'Cancel SOS',
                        style: TextStyle(color: Colors.white, fontSize: 16),
                      ),
                    ),
                  ],
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
