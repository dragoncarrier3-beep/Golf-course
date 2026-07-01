import 'package:flutter/material.dart';
import 'package:uuid/uuid.dart';
import '../models/review.dart';
import '../services/storage_service.dart';
import 'course_info_screen.dart';
import 'reviews_list_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  List<Review> _reviews = [];
  Review? _draft;

  @override
  void initState() {
    super.initState();
    _load();
  }

  void _load() {
    setState(() {
      _reviews = StorageService.instance.getReviews();
      _draft = StorageService.instance.getActiveDraft();
    });
  }

  void _startNew() {
    final now = DateTime.now().toIso8601String();
    final review = Review(
      id: const Uuid().v4(),
      courseInfo: CourseInfo(),
      createdAt: now,
      updatedAt: now,
    );
    Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => CourseInfoScreen(review: review)),
    ).then((_) => _load());
  }

  void _continueDraft() {
    if (_draft == null) return;
    Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => CourseInfoScreen(review: _draft!)),
    ).then((_) => _load());
  }

  @override
  Widget build(BuildContext context) {
    final submitted = _reviews.where((r) => !r.isDraft).length;
    return Scaffold(
      backgroundColor: const Color(0xFFF8F6F0),
      appBar: AppBar(
        title: const Text('CourseGrade', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: const Color(0xFF1B4332),
        foregroundColor: Colors.white,
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF1B4332), Color(0xFF40916C)],
              ),
              borderRadius: BorderRadius.circular(16),
            ),
            child: const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Offline-First Intelligence',
                    style: TextStyle(color: Colors.white70, fontSize: 12)),
                SizedBox(height: 8),
                Text('Rate courses with precision.',
                    style: TextStyle(
                        color: Colors.white,
                        fontSize: 24,
                        fontWeight: FontWeight.bold)),
              ],
            ),
          ),
          const SizedBox(height: 20),
          FilledButton(
            onPressed: _startNew,
            style: FilledButton.styleFrom(
              backgroundColor: const Color(0xFF1B4332),
              minimumSize: const Size.fromHeight(52),
            ),
            child: const Text('Start New Review'),
          ),
          if (_draft != null) ...[
            const SizedBox(height: 16),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Continue Saved Review',
                        style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF2D6A4F))),
                    const SizedBox(height: 4),
                    Text(_draft!.courseInfo.courseName.isEmpty
                        ? 'Untitled Course'
                        : _draft!.courseInfo.courseName),
                    const SizedBox(height: 12),
                    OutlinedButton(
                      onPressed: _continueDraft,
                      child: const Text('Resume Draft'),
                    ),
                  ],
                ),
              ),
            ),
          ],
          const SizedBox(height: 12),
          OutlinedButton(
            onPressed: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const ReviewsListScreen()),
            ).then((_) => _load()),
            child: Text('My Submitted Reviews ($submitted)'),
          ),
        ],
      ),
    );
  }
}
