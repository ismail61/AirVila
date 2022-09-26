import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../view/auth/home_screen.dart';
import '../view/auth/login_screen.dart';
import '../view/auth/splash_screen.dart';

const splash = '/';
const home = '/home';
const login = '/login';

final pages = [
  page(splash, SplashScreen()),
  page(home, HomeScreen()),
  page(login, LoginScreen()),
];

GetPage page(String name, Widget page) {
  return GetPage(
    name: name,
    page: () => page,
    transition: Transition.cupertino,
  );
}
