import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'services/storage_service.dart';
import 'services/sync_service.dart';
import 'screens/home_screen.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  try {
    await Firebase.initializeApp();
    FirebaseFirestore.instance.settings = const Settings(
      persistenceEnabled: true,
      cacheSizeBytes: Settings.CACHE_SIZE_UNLIMITED,
    );
  } catch (_) {
    /* offline demo without firebase config */
  }
  await StorageService.instance.init();
  await StorageService.instance.seedIfNeeded();
  SyncService.instance.startBackgroundSync();
  runApp(const CourseGradeApp());
}

class CourseGradeApp extends StatelessWidget {
  const CourseGradeApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'CourseGrade',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF1B4332),
          primary: const Color(0xFF1B4332),
          secondary: const Color(0xFF40916C),
        ),
        fontFamily: 'DMSans',
        useMaterial3: true,
      ),
      home: const HomeScreen(),
    );
  }
}
