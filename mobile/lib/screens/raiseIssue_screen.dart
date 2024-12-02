import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:geolocator/geolocator.dart';
import 'package:mobile/services/api_service.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:mobile/widgets/header.dart';
import 'package:mobile/widgets/footer.dart';
import 'package:flutter_image_compress/flutter_image_compress.dart';

class RaiseIssueScreen extends StatefulWidget {
  const RaiseIssueScreen({super.key});

  @override
  State<RaiseIssueScreen> createState() => _RaiseIssueScreenState();
}

class _RaiseIssueScreenState extends State<RaiseIssueScreen> {
  final PageController _pageController = PageController();
  int _currentIndex = 0;
  File? _selectedImage;
  final ImagePicker _imagePicker = ImagePicker();

  String? _title;
  String? _description;
  String? _selectedCategory;
  Position? _currentPosition;
  bool _isSubmitting = false;

  final List<String> _categories = [
    "Natural Disaster",
    "Medical",
    "Fire",
    "Infrastructure",
    "Other"
  ];

  Future<void> _pickImage(ImageSource source) async {
    final permission = source == ImageSource.camera
        ? await Permission.camera.request()
        : await Permission.storage.request();

    if (permission.isGranted) {
      final pickedFile = await _imagePicker.pickImage(source: source);
      if (pickedFile != null) {
        setState(() {
          _selectedImage = File(pickedFile.path);
        });
      }
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
            content: Text(
                "${source == ImageSource.camera ? 'Camera' : 'Storage'} permission is required to select an image")),
      );
    }
  }

  Future<void> _locateUser() async {
    bool serviceEnabled;
    LocationPermission permission;

    serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Please enable location services")),
      );
      return;
    }

    permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Location permission is denied")),
        );
        return;
      }
    }

    if (permission == LocationPermission.deniedForever) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
            content: Text("Location permission is permanently denied")),
      );
      return;
    }

    try {
      final position = await Geolocator.getCurrentPosition(
          desiredAccuracy: LocationAccuracy.high);
      setState(() {
        _currentPosition = position;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
            content: Text(
                "Location fetched: ${position.latitude}, ${position.longitude}")),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Failed to fetch location: $e")),
      );
    }
  }

  Future<void> _submitIssue() async {
    if (_selectedImage == null ||
        _title == null ||
        _description == null ||
        _selectedCategory == null ||
        _currentPosition == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Please fill in all the details")),
      );
      return;
    }

    setState(() {
      _isSubmitting = true;
    });

    try {
      // final bytes = await _selectedImage!.readAsBytes();
      // final String photoBase64 = base64Encode(bytes);
      final originalBytes = await _selectedImage!.readAsBytes();

      final compressedBytes = await FlutterImageCompress.compressWithList(
        originalBytes,
        quality: 70,
      );

      // Encode the compressed image to Base64
      final String photoBase64 = base64Encode(compressedBytes);
      final String location =
          "${_currentPosition!.latitude},${_currentPosition!.longitude}";

      final response = await ApiService.addIssue(
        photoBase64: photoBase64,
        title: _title!,
        description: _description!,
        emergencyType: _selectedCategory!,
        location: location,
      );

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(response['message'])),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Failed to submit issue: $e")),
      );
    } finally {
      setState(() {
        _isSubmitting = false;
      });
    }
  }

  void _navigateToPage(int pageIndex) {
    _pageController.animateToPage(
      pageIndex,
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeInOut,
    );
  }

  Widget _styledButton(String text, bool isPrimary, VoidCallback onPressed) {
    return GestureDetector(
      onTap: onPressed,
      child: Container(
        width: isPrimary ? 158 : 146,
        height: 34,
        decoration: ShapeDecoration(
          color: isPrimary ? const Color(0xFF2B3674) : Colors.transparent,
          shape: RoundedRectangleBorder(
            side: isPrimary
                ? BorderSide.none
                : const BorderSide(width: 1, color: Color(0xFF2B3674)),
            borderRadius: BorderRadius.circular(10),
          ),
        ),
        child: Center(
          child: Text(
            text,
            style: TextStyle(
              color: isPrimary ? Colors.white : const Color(0xFF2B3674),
              fontSize: 14,
              fontFamily: 'Inter',
              fontWeight: FontWeight.w700,
            ),
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: PageView(
          controller: _pageController,
          physics: const NeverScrollableScrollPhysics(),
          children: [
            // Page 1: Upload Image
            SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Header(),
                  const SizedBox(height: 20),
                  const Padding(
                    padding: EdgeInsets.symmetric(horizontal: 16.0),
                    child: Text('Step 1: Upload Image',
                        style: TextStyle(
                            fontSize: 24, fontWeight: FontWeight.bold)),
                  ),
                  const SizedBox(height: 20),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16.0),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        ElevatedButton.icon(
                          onPressed: () => _pickImage(ImageSource.camera),
                          icon: const Icon(Icons.camera),
                          label: const Text("Camera"),
                        ),
                        ElevatedButton.icon(
                          onPressed: () => _pickImage(ImageSource.gallery),
                          icon: const Icon(Icons.photo_library),
                          label: const Text("Gallery"),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16.0),
                    child: Container(
                      height: 200,
                      width: double.infinity,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: Colors.blue, width: 2),
                      ),
                      child: _selectedImage != null
                          ? ClipRRect(
                              borderRadius: BorderRadius.circular(10),
                              child: Image.file(
                                _selectedImage!,
                                fit: BoxFit.cover,
                              ),
                            )
                          : const Center(
                              child: Text(
                                'No image selected',
                                style:
                                    TextStyle(fontSize: 16, color: Colors.blue),
                              ),
                            ),
                    ),
                  ),
                  const SizedBox(height: 20),
                  Center(
                    child:
                        _styledButton("Next", true, () => _navigateToPage(1)),
                  ),
                ],
              ),
            ),
            // Page 2: Title, Description, and Category
            SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Header(),
                    const SizedBox(height: 20),
                    const Text('Step 2: Details',
                        style: TextStyle(
                            fontSize: 24, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 20),
                    TextField(
                      decoration: const InputDecoration(
                          labelText: 'Title', border: OutlineInputBorder()),
                      onChanged: (value) => _title = value,
                    ),
                    const SizedBox(height: 20),
                    TextField(
                      decoration: const InputDecoration(
                          labelText: 'Description',
                          border: OutlineInputBorder()),
                      onChanged: (value) => _description = value,
                      maxLines: 3,
                    ),
                    const SizedBox(height: 20),
                    DropdownButtonFormField<String>(
                      decoration: const InputDecoration(
                          labelText: "Category", border: OutlineInputBorder()),
                      value: _selectedCategory,
                      items: _categories
                          .map((category) => DropdownMenuItem(
                              value: category, child: Text(category)))
                          .toList(),
                      onChanged: (value) {
                        setState(() {
                          _selectedCategory = value;
                        });
                      },
                      hint: const Text("Select a Category"),
                    ),
                    const SizedBox(height: 20),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        _styledButton(
                            "Previous", false, () => _navigateToPage(0)),
                        _styledButton("Next", true, () => _navigateToPage(2)),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            // Page 3: Location and Submit
            SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Header(),
                    const SizedBox(height: 20),
                    const Text('Step 3: Location & Submit',
                        style: TextStyle(
                            fontSize: 24, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 20),
                    ElevatedButton.icon(
                      onPressed: _locateUser,
                      icon: const Icon(Icons.location_on),
                      label: const Text("Get Current Location"),
                    ),
                    const SizedBox(height: 20),
                    if (_currentPosition != null)
                      Text(
                        "Location: ${_currentPosition!.latitude}, ${_currentPosition!.longitude}",
                        style: const TextStyle(fontSize: 16),
                      ),
                    const SizedBox(height: 20),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        _styledButton(
                            "Previous", false, () => _navigateToPage(1)),
                        _styledButton(
                          "Submit",
                          true,
                          (_isSubmitting ? null : _submitIssue) as VoidCallback,
                        ),
                      ],
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
        onTap: (index) => setState(() => _currentIndex = index),
      ),
    );
  }
}
