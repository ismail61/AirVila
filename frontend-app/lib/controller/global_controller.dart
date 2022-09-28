import 'package:airvila/global/app_constants.dart';
import 'package:airvila/global/routes.dart';
import 'package:get/get.dart';
import 'package:hive_flutter/hive_flutter.dart';

class GlobalController extends GetxController {
  final box = Hive.box(hiveBox);

  @override
  void onInit() {
    isLoggedIn();
    super.onInit();
  }

  isLoggedIn() {
    bool loggedStatus = box.get(isLogged) ?? false;
    Future.delayed(const Duration(seconds: 3), () {
      if (loggedStatus) {
        Get.offAllNamed(home);
      } else {
        Get.offAllNamed(login);
      }
    });
  }
}
