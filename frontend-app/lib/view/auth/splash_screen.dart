import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:lottie/lottie.dart';

import '../../controller/global_controller.dart';

class SplashScreen extends StatelessWidget {
  final _controller = Get.put(GlobalController());
   SplashScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Center(
        child: Lottie.asset(
          "assets/splash_loading.json",
          reverse: true,
          frameRate: FrameRate.max,
          repeat: true,
          height: 200.h,
          width: 200.w,
        ),
      ),
    );
  }
}
