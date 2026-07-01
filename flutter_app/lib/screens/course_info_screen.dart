import 'package:flutter/material.dart';
import '../models/review.dart';
import '../services/storage_service.dart';
import 'scores_screen.dart';

class CourseInfoScreen extends StatefulWidget {
  final Review review;
  const CourseInfoScreen({super.key, required this.review});

  @override
  State<CourseInfoScreen> createState() => _CourseInfoScreenState();
}

class _CourseInfoScreenState extends State<CourseInfoScreen> {
  late Review _review;

  @override
  void initState() {
    super.initState();
    _review = widget.review;
  }

  Future<void> _save() async {
    final saved = await StorageService.instance.upsertReview(
      _review.copyWith(currentStep: 1),
    );
    setState(() => _review = saved);
  }

  void _patch(void Function(CourseInfo) fn) {
    final info = _review.courseInfo;
    fn(info);
    setState(() => _review = _review.copyWith(courseInfo: info));
    _save();
  }

  @override
  Widget build(BuildContext context) {
    final info = _review.courseInfo;
    return Scaffold(
      appBar: AppBar(title: const Text('Course Info')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          TextField(
            decoration: const InputDecoration(labelText: 'Course Name'),
            controller: TextEditingController(text: info.courseName)
              ..selection = TextSelection.collapsed(offset: info.courseName.length),
            onChanged: (v) => _patch((i) => i.courseName = v),
          ),
          Row(
            children: [
              Expanded(
                child: TextField(
                  decoration: const InputDecoration(labelText: 'City'),
                  controller: TextEditingController(text: info.city),
                  onChanged: (v) => _patch((i) => i.city = v),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: TextField(
                  decoration: const InputDecoration(labelText: 'State'),
                  controller: TextEditingController(text: info.state),
                  onChanged: (v) => _patch((i) => i.state = v),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          FilledButton(
            onPressed: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => ScoresScreen(review: _review)),
            ),
            child: const Text('Continue to Scoring'),
          ),
        ],
      ),
    );
  }
}
