import 'package:flutter/material.dart';

import '../../global/app_constants.dart';

class CustomButton extends StatelessWidget {
  final Color buttonColor;
  final Color textColor;
  final String value;
  final bool isLoading;
  final VoidCallback onPressed;
  final double? height;

  const CustomButton({
    Key? key,
    this.buttonColor = primaryColor,
    required this.onPressed,
    required this.value,
    this.textColor = Colors.white,
    this.isLoading = false, this.height,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: height,
      child: MaterialButton(
        minWidth: double.infinity,
        height: 50,
        color: buttonColor,
        elevation: 0,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(11)),
        onPressed: onPressed,
        child: isLoading
            ? const Center(
                child: CircularProgressIndicator(
                  color: Colors.white,
                ),
              )
            : Text(
                value,
                style: TextStyle(
                  fontWeight: FontWeight.w400,
                  fontSize: 18,
                  color: textColor,
                ),
              ),
      ),
    );
  }
}
