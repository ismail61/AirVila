import 'package:airvila/controller/global_controller.dart';
import 'package:airvila/controller/login_controller.dart';
import 'package:airvila/global/app_constants.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:lottie/lottie.dart';

import '../../global/app_global.dart';
import '../components/custom_button.dart';
import '../components/custom_text_field.dart';

class LoginScreen extends StatelessWidget {
  final _controller = Get.put(LoginController());

  LoginScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        title: Text(
          "Log In",
          style: TextStyle(
            color: Colors.grey.shade800,
          ),
        ),
      ),
      body: Obx(() {
        return AnimatedCrossFade(
          firstChild: emailScreen(),
          secondChild: phoneScreen(),
          crossFadeState: _controller.isEmailEnabled.value
              ? CrossFadeState.showFirst
              : CrossFadeState.showSecond,
          duration: const Duration(
            milliseconds: 300,
          ),
        );
      }),
      bottomNavigationBar: Obx(
        () {
          return Padding(
            padding: const EdgeInsets.all(8.0),
            child: CustomButton(
              height: 60.h,
              onPressed: () {
                _controller.userLogin(
                  _controller.emailController.text,
                  _controller.phoneController.text,
                  _controller.passwordController.text,
                );
              },
              value: "Continue",
              isLoading: _controller.isLoading.value,
            ),
          );
        },
      ),
    );
  }

  Widget emailScreen() {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 15.w),
      width: double.infinity,
      child: SingleChildScrollView(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            lottieBuilder(
              assetName: "assets/auth.json",
              height: 200.h,
              width: 200.w,
            ),
            SizedBox(
              height: 20.h,
            ),
            CustomTextField(
              hint: 'Enter Email Address',
              textEditingController: _controller.emailController,
              textInputType: TextInputType.emailAddress,
            ),
            SizedBox(
              height: 10.h,
            ),
            CustomTextField(
              hint: 'Enter Password',
              textEditingController: _controller.passwordController,
              obscureText: true,
            ),
            SizedBox(
              width: double.infinity,
              child: Align(
                alignment: Alignment.centerRight,
                child: TextButton(
                  onPressed: () {
                    _controller.isEmailEnabled.value = false;
                  },
                  child: const Text(
                    "Login with number",
                  ),
                ),
              ),
            ),
            SizedBox(
              height: 15.h,
            ),
            gotoRegistration(),
          ],
        ),
      ),
    );
  }

  Widget gotoRegistration() {
    return OutlinedButton(
      style: OutlinedButton.styleFrom(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(
            15.r,
          ),
        ),
        side: const BorderSide(
          color: primaryColor,
        ),
      ),
      onPressed: () {},
      child: const Text(
        "Already have an account? Click here",
      ),
    );
  }

  Widget phoneScreen() {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 15.w),
      width: double.infinity,
      child: SingleChildScrollView(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            lottieBuilder(
              assetName: "assets/auth.json",
              height: 200.h,
              width: 200.w,
            ),
            SizedBox(
              height: 20.h,
            ),
            CustomTextField(
              hint: 'Enter Phone Number',
              textEditingController: _controller.phoneController,
              textInputType: TextInputType.phone,
            ),
            SizedBox(
              height: 10.h,
            ),
            CustomTextField(
              hint: 'Enter Password',
              textEditingController: _controller.passwordController,
              obscureText: true,
            ),
            SizedBox(
              width: double.infinity,
              child: Align(
                alignment: Alignment.centerRight,
                child: TextButton(
                  onPressed: () {
                    _controller.isEmailEnabled.value = true;
                  },
                  child: const Text(
                    "Login with email",
                  ),
                ),
              ),
            ),
            SizedBox(
              height: 15.h,
            ),
            gotoRegistration(),
          ],
        ),
      ),
    );
  }
}
