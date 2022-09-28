import 'dart:convert';

import 'package:airvila/global/app_global.dart';
import 'package:http/http.dart' as http;

const baseUrl = 'https://api.airvila.com/';
/*Auth*/
const userSignIn = 'user/sign-in';

Future<http.Response> basicPost(
    {required Map<String, dynamic> body, required String endUrl}) async {
  final header = {
    'Content-type': 'application/json',
    'Accept': 'application/json',
  };
  logger.d(body);
  final response = await http.post(Uri.parse(baseUrl + endUrl),
      headers: header, body: jsonEncode(body));
  logger.d(response.body);
  return response;
}
