import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:logger/logger.dart';
import 'package:lottie/lottie.dart';

final logger = Logger();

LottieBuilder lottieBuilder({
  required double height,
  required double width,
  required String assetName,
}) {
  return Lottie.asset(
    assetName,
    reverse: true,
    repeat: true,
    frameRate: FrameRate.max,
    height: height,
    width: width,
  );
}

successToast(String text) {
  Fluttertoast.showToast(msg: text, backgroundColor: Colors.green);
}

errorToast(String text) {
  Fluttertoast.showToast(msg: text, backgroundColor: Colors.red);
}

infoToast(String text) {
  Fluttertoast.showToast(msg: text, backgroundColor: Colors.indigo);
}
