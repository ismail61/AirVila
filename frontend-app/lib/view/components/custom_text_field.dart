import 'package:flutter/material.dart';

import '../../global/app_constants.dart';

class CustomTextField extends StatelessWidget {
  final String hint;
  final TextInputType textInputType;
  final TextEditingController textEditingController;
  final bool? obscureText;
  final Widget? trailing;
  final Widget? trailingButton;
  final Widget? leading;
  final Widget? leadingButton;

  const CustomTextField({
    Key? key,
    required this.hint,
    this.textInputType = TextInputType.text,
    this.obscureText,
    this.trailing,
    this.leading,
    required this.textEditingController,
    this.trailingButton,
    this.leadingButton,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: textEditingController,
      obscureText: obscureText ?? false,
      keyboardType: textInputType,
      decoration: InputDecoration(
        suffix: trailing,
        suffixIcon: trailingButton,
        prefix: leading,
        prefixIcon: leadingButton,
        hintText: hint,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(
            10.0,
          ),
          borderSide: const BorderSide(
            color: Colors.black54,
            width: 1.0,
          ),
        ),
        focusedBorder: OutlineInputBorder(
          borderSide: const BorderSide(
            color: primaryColor,
            width: 2.0,
          ),
          borderRadius: BorderRadius.circular(
            10.0,
          ),
        ),
      ),
    );
  }
}