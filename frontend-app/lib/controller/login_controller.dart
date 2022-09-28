import 'dart:convert';
import 'package:airvila/controller/global_controller.dart';
import 'package:airvila/global/app_global.dart';
import 'package:airvila/global/server_side.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../global/app_constants.dart';
import '../global/routes.dart';
import 'package:http/http.dart' as http;

class LoginController extends GetxController {
  final emailController = TextEditingController();
  final phoneController = TextEditingController();
  final passwordController = TextEditingController();
  var isLoading = false.obs;
  var isEmailEnabled = true.obs;
  final globalController = Get.find<GlobalController>();

  userLogin(String email, String phone, String password) async {
    if(isEmailEnabled.value){
      if (email.isEmpty || password.isEmpty) {
        errorToast('Fields can not be empty');
        return;
      }
    }
    else{
      if (phone.isEmpty || password.isEmpty) {
        errorToast('Fields can not be empty');
        return;
      }
    }
    if(isEmailEnabled.value){
      if (!email.isEmail) {
        errorToast('Not a valid email');
        return;
      }
    }

    isLoading.value = true;
    http.Response response;
    if(isEmailEnabled.value){
      response = await basicPost(body: {'email': email, 'password': password}, endUrl: userSignIn);
    }
    else{
      response = await basicPost(body: {'phone': phone, 'password': password}, endUrl: userSignIn);
    }
    if (response.statusCode != 200) {
      isLoading.value = false;
      String error = jsonDecode(response.body)['err'];
      errorToast(error);
      return;
    }
    isLoading.value = false;
    successToast('Successfully logged in');
    String getToken = jsonDecode(response.body)['token'];
    globalController.box.put(token, getToken);
    globalController.box.put(bearerToken, 'Bearer $getToken');
    globalController.box.put(isLogged, true);
    Get.offAllNamed(home);
  }
}
