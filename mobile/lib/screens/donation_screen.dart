import 'package:flutter/material.dart';
import 'package:mobile/services/api_service.dart';
import 'package:mobile/widgets/header.dart';
import 'package:mobile/widgets/footer.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:razorpay_flutter/razorpay_flutter.dart';
import 'package:shared_preferences/shared_preferences.dart';

class DonationPage extends StatefulWidget {
  const DonationPage({Key? key}) : super(key: key);

  @override
  _DonationPageState createState() => _DonationPageState();
}

class _DonationPageState extends State<DonationPage> {
  int _currentIndex = 0;
  bool _isLoading = true;
  List<Map<String, dynamic>> _fundraisers = [];
  String _errorMessage = '';
  late Razorpay _razorpay;
  final TextEditingController _amountController = TextEditingController();
  String _loggedInUserName = ""; // Hold the logged-in user's name.
  String _selectfundRaiser = "";

  String get fundraiserId => _selectfundRaiser;

  @override
  void initState() {
    super.initState();
    _razorpay = Razorpay();
    _razorpay.on(Razorpay.EVENT_PAYMENT_SUCCESS, _handlePaymentSuccess);
    _razorpay.on(Razorpay.EVENT_PAYMENT_ERROR, _handlePaymentError);
    _razorpay.on(Razorpay.EVENT_EXTERNAL_WALLET, _handleExternalWallet);
    _fetchLoggedInUser();
    _fetchFundraisers();
  }

  @override
  void dispose() {
    _razorpay.clear();
    _amountController.dispose();
    super.dispose();
  }

  Future<void> _fetchLoggedInUser() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      setState(() {
        _loggedInUserName =
            prefs.getString('userName') ?? 'Guest'; // Get username.
      });
    } catch (e) {
      print('Error fetching logged-in user: $e');
      setState(() {
        _errorMessage = 'Failed to load user information.';
      });
    }
  }

  Future<void> _fetchFundraisers() async {
    setState(() {
      _isLoading = true;
      _errorMessage = '';
    });

    try {
      final fundraisers = await ApiService.fetchFundraisers();
      setState(() {
        _fundraisers = fundraisers;
      });
    } catch (e) {
      print('Error fetching fundraisers: $e');
      setState(() {
        _errorMessage = 'Failed to load fundraisers: ${e.toString()}';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _showDonationPopup(String fundraiserId) async {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Enter Donation Amount'),
          content: TextField(
            controller: _amountController,
            keyboardType: TextInputType.number,
            decoration: const InputDecoration(hintText: 'Enter amount'),
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: const Text('Cancel'),
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.of(context).pop();
                _createOrder(fundraiserId);
              },
              child: const Text('Donate'),
            ),
          ],
        );
      },
    );
  }

  Future<void> _createOrder(String fundraiserId) async {
    final amount = int.tryParse(_amountController.text.trim()) ?? 0;
    setState(() {
      _selectfundRaiser = fundraiserId;
    });
    if (amount <= 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Please enter a valid amount.")),
      );
      return;
    }

    final url = Uri.parse("http://10.0.2.2:8000/v1/donation/create-order");
    try {
      final response = await http.post(
        url,
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({
          "amount": amount,
          "fundraiserId": fundraiserId,
          "userName": _loggedInUserName, // Pass the logged-in user's name.
        }),
      );

      if (response.statusCode == 200) {
        final order = jsonDecode(response.body)['order'];
        _openRazorpayCheckout(order['id'], amount);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
              content: Text("Failed to create order. Please try again.")),
        );
      }
    } catch (e) {
      print("Error creating order: $e");
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Error occurred. Please try again.")),
      );
    }
  }

  void _openRazorpayCheckout(String orderId, int amount) {
    var options = {
      'key': 'rzp_live_Gog8bh57PaPKoC',
      'amount': amount * 100,
      'order_id': orderId,
      'name': 'Fund Relief',
      'description': 'Donation Payment',
      'prefill': {
        'contact': '9876543210',
        'email': 'user@example.com',
      },
      'theme': {
        'color': '#F37254',
      },
    };

    try {
      _razorpay.open(options);
    } catch (e) {
      print("Error opening Razorpay: $e");
    }
  }

  void _handlePaymentSuccess(PaymentSuccessResponse response) async {
    print("Payment Successful: ${response.paymentId}");
    final amount = int.tryParse(_amountController.text.trim()) ?? 0;
    await _verifyPayment(
      response.orderId!,
      response.paymentId!,
      response.signature!,
      fundraiserId,
      amount,
    );
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text("Donation Successful! Thank you.")),
    );
  }

  Future<void> _verifyPayment(String orderId, String paymentId,
      String signature, String fundraiserId, int amount) async {
    final url = Uri.parse("http://10.0.2.2:8000/v1/donation/verify-payment");
    try {
      final response = await http.post(
        url,
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({
          "razorpay_order_id": orderId,
          "razorpay_payment_id": paymentId,
          "razorpay_signature": signature,
          "userId": "123",
          "fundraiserId": fundraiserId,
          "amount": amount,
        }),
      );

      if (response.statusCode == 200) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Donation Successful! Thank you.")),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Payment verification failed.")),
        );
      }
    } catch (e) {
      print("Error verifying payment: $e");
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Error occurred during verification.")),
      );
    }
  }

  void _handlePaymentError(PaymentFailureResponse response) {
    print("Payment Error: ${response.code} | ${response.message}");
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text("Payment failed. Please try again.")),
    );
  }

  void _handleExternalWallet(ExternalWalletResponse response) {
    print("External Wallet Selected: ${response.walletName}");
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            const Header(),
            Expanded(
              child: _isLoading
                  ? const Center(child: CircularProgressIndicator())
                  : _errorMessage.isNotEmpty
                      ? Center(
                          child: Text(
                            _errorMessage,
                            style: const TextStyle(
                                color: Colors.red, fontSize: 16),
                          ),
                        )
                      : _fundraisers.isEmpty
                          ? const Center(
                              child: Text(
                                'No fundraisers available.',
                                style: TextStyle(fontSize: 16),
                              ),
                            )
                          : ListView.builder(
                              itemCount: _fundraisers.length,
                              itemBuilder: (context, index) {
                                final fundraiser = _fundraisers[index];
                                return Card(
                                  child: ListTile(
                                    title: Text(fundraiser['title'] ?? ''),
                                    subtitle:
                                        Text(fundraiser['description'] ?? ''),
                                    trailing: ElevatedButton(
                                      onPressed: () =>
                                          _showDonationPopup(fundraiser['_id']),
                                      child: const Text('Donate Now'),
                                    ),
                                  ),
                                );
                              },
                            ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: Footer(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
      ),
    );
  }
}
