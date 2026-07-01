import 'package:flutter/material.dart';
import '../core/scoring_engine.dart';
import '../models/review.dart';
import '../services/storage_service.dart';
import 'profile_screen.dart';

class ScoresScreen extends StatefulWidget {
  final Review review;
  const ScoresScreen({super.key, required this.review});

  @override
  State<ScoresScreen> createState() => _ScoresScreenState();
}

class _ScoresScreenState extends State<ScoresScreen> {
  late Review _review;
  late List<CategoryWeight> _config;

  @override
  void initState() {
    super.initState();
    _review = widget.review;
    _config = StorageService.instance.scoreConfig;
    _recalc();
  }

  void _recalc() {
    setState(() => _review = _review.recalculate(_config));
  }

  Future<void> _setScore(String id, int value) async {
    final cats = Map<String, int>.from(_review.scoreCategories);
    cats[id] = value;
    _review = _review.copyWith(scoreCategories: cats, currentStep: 2);
    _recalc();
    await StorageService.instance.upsertReview(_review);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Scored Categories')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('Weighted Score', style: TextStyle(fontWeight: FontWeight.bold)),
                  Text(
                    '${_review.letterGrade} (${_review.weightedScore.toStringAsFixed(1)})',
                    style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
            ),
          ),
          ..._config.map((cat) {
            final val = _review.scoreCategories[cat.id] ?? 5;
            return Card(
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('${cat.name} (${(cat.weight * 100).round()}%)'),
                    Slider(
                      value: val.toDouble(),
                      min: 1,
                      max: 10,
                      divisions: 9,
                      label: val.toString(),
                      onChanged: (v) => _setScore(cat.id, v.round()),
                    ),
                  ],
                ),
              ),
            );
          }),
          FilledButton(
            onPressed: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => ProfileScreen(review: _review)),
            ),
            child: const Text('Continue'),
          ),
        ],
      ),
    );
  }
}
